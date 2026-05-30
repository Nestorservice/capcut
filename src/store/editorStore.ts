import { create } from 'zustand';
import {
  Clip,
  TextOverlay,
  AudioTrack,
  StickerOverlay,
  Keyframe,
  ExportSettings,
  EditorSnapshot,
  DEFAULT_EXPORT_SETTINGS,
} from '@types/editor.types';
import { APP_CONFIG } from '@constants/index';

interface EditorState {
  projectId: string | null;
  clips: Clip[];
  selectedClipId: string | null;
  currentTime: number;
  totalDuration: number;
  isPlaying: boolean;
  timelineScale: number;
  textOverlays: TextOverlay[];
  selectedTextId: string | null;
  audioTracks: AudioTrack[];
  selectedAudioId: string | null;
  stickerOverlays: StickerOverlay[];
  selectedStickerId: string | null;
  keyframes: Keyframe[];
  activeToolId: string | null;
  exportSettings: ExportSettings;
  history: EditorSnapshot[];
  historyIndex: number;
  isDirty: boolean;

  loadProject: (projectId: string, snapshot?: Partial<EditorSnapshot>) => void;
  resetEditor: () => void;

  addClip: (clip: Clip) => void;
  removeClip: (id: string) => void;
  updateClip: (id: string, updates: Partial<Clip>) => void;
  reorderClips: (fromIndex: number, toIndex: number) => void;
  splitClip: (clipId: string, atTime: number) => void;
  trimClip: (clipId: string, startTime: number, endTime: number) => void;
  selectClip: (id: string | null) => void;

  setCurrentTime: (time: number) => void;
  setPlaying: (playing: boolean) => void;
  setTimelineScale: (scale: number) => void;

  addTextOverlay: (text: TextOverlay) => void;
  updateTextOverlay: (id: string, updates: Partial<TextOverlay>) => void;
  removeTextOverlay: (id: string) => void;
  selectText: (id: string | null) => void;

  addAudioTrack: (track: AudioTrack) => void;
  updateAudioTrack: (id: string, updates: Partial<AudioTrack>) => void;
  removeAudioTrack: (id: string) => void;
  selectAudio: (id: string | null) => void;

  addStickerOverlay: (sticker: StickerOverlay) => void;
  updateStickerOverlay: (id: string, updates: Partial<StickerOverlay>) => void;
  removeStickerOverlay: (id: string) => void;
  selectSticker: (id: string | null) => void;

  addKeyframe: (keyframe: Keyframe) => void;
  removeKeyframe: (id: string) => void;
  updateKeyframe: (id: string, updates: Partial<Keyframe>) => void;

  setActiveTool: (toolId: string | null) => void;
  setExportSettings: (settings: Partial<ExportSettings>) => void;

  undo: () => void;
  redo: () => void;
  saveSnapshot: () => void;
  markClean: () => void;
}

const recomputeDuration = (clips: Clip[]): number =>
  clips.reduce((sum, c) => sum + Math.max(0, c.trimEnd - c.trimStart) / Math.max(0.1, c.speed), 0);

const recomputePositions = (clips: Clip[]): Clip[] =>
  clips.map((c, idx) => ({ ...c, position: idx }));

const takeSnapshot = (s: EditorState): EditorSnapshot => ({
  clips: JSON.parse(JSON.stringify(s.clips)),
  textOverlays: JSON.parse(JSON.stringify(s.textOverlays)),
  audioTracks: JSON.parse(JSON.stringify(s.audioTracks)),
  stickerOverlays: JSON.parse(JSON.stringify(s.stickerOverlays)),
  totalDuration: s.totalDuration,
  timestamp: Date.now(),
});

const MAX_HISTORY = 50;

export const useEditorStore = create<EditorState>((set, get) => ({
  projectId: null,
  clips: [],
  selectedClipId: null,
  currentTime: 0,
  totalDuration: 0,
  isPlaying: false,
  timelineScale: APP_CONFIG.DEFAULT_TIMELINE_SCALE,
  textOverlays: [],
  selectedTextId: null,
  audioTracks: [],
  selectedAudioId: null,
  stickerOverlays: [],
  selectedStickerId: null,
  keyframes: [],
  activeToolId: null,
  exportSettings: DEFAULT_EXPORT_SETTINGS,
  history: [],
  historyIndex: -1,
  isDirty: false,

  loadProject: (projectId, snapshot) =>
    set({
      projectId,
      clips: snapshot?.clips ?? [],
      textOverlays: snapshot?.textOverlays ?? [],
      audioTracks: snapshot?.audioTracks ?? [],
      stickerOverlays: snapshot?.stickerOverlays ?? [],
      totalDuration: snapshot?.totalDuration ?? recomputeDuration(snapshot?.clips ?? []),
      currentTime: 0,
      isPlaying: false,
      selectedClipId: null,
      selectedTextId: null,
      selectedAudioId: null,
      selectedStickerId: null,
      activeToolId: null,
      history: [],
      historyIndex: -1,
      isDirty: false,
    }),

  resetEditor: () =>
    set({
      projectId: null,
      clips: [],
      textOverlays: [],
      audioTracks: [],
      stickerOverlays: [],
      keyframes: [],
      currentTime: 0,
      totalDuration: 0,
      isPlaying: false,
      selectedClipId: null,
      selectedTextId: null,
      selectedAudioId: null,
      selectedStickerId: null,
      activeToolId: null,
      history: [],
      historyIndex: -1,
      isDirty: false,
    }),

  addClip: clip => {
    const { clips } = get();
    const next = recomputePositions([...clips, clip]);
    set({ clips: next, totalDuration: recomputeDuration(next), isDirty: true });
    get().saveSnapshot();
  },

  removeClip: id => {
    const { clips, selectedClipId } = get();
    const next = recomputePositions(clips.filter(c => c.id !== id));
    set({
      clips: next,
      totalDuration: recomputeDuration(next),
      selectedClipId: selectedClipId === id ? null : selectedClipId,
      isDirty: true,
    });
    get().saveSnapshot();
  },

  updateClip: (id, updates) => {
    const { clips } = get();
    const next = clips.map(c => (c.id === id ? { ...c, ...updates } : c));
    set({ clips: next, totalDuration: recomputeDuration(next), isDirty: true });
  },

  reorderClips: (fromIndex, toIndex) => {
    const { clips } = get();
    if (fromIndex === toIndex) return;
    const next = [...clips];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    set({ clips: recomputePositions(next), isDirty: true });
    get().saveSnapshot();
  },

  splitClip: (clipId, atTime) => {
    const { clips } = get();
    const idx = clips.findIndex(c => c.id === clipId);
    if (idx === -1) return;
    const clip = clips[idx];
    const localTime = atTime;
    if (localTime <= clip.trimStart + APP_CONFIG.MIN_CLIP_DURATION) return;
    if (localTime >= clip.trimEnd - APP_CONFIG.MIN_CLIP_DURATION) return;
    const left: Clip = { ...clip, trimEnd: localTime };
    const right: Clip = {
      ...clip,
      id: `${clip.id}_split_${Date.now()}`,
      trimStart: localTime,
    };
    const next = recomputePositions([...clips.slice(0, idx), left, right, ...clips.slice(idx + 1)]);
    set({ clips: next, totalDuration: recomputeDuration(next), isDirty: true });
    get().saveSnapshot();
  },

  trimClip: (clipId, startTime, endTime) => {
    const { clips } = get();
    const next = clips.map(c =>
      c.id === clipId
        ? {
            ...c,
            trimStart: Math.max(0, startTime),
            trimEnd: Math.min(c.duration, Math.max(startTime + APP_CONFIG.MIN_CLIP_DURATION, endTime)),
          }
        : c,
    );
    set({ clips: next, totalDuration: recomputeDuration(next), isDirty: true });
  },

  selectClip: id => set({ selectedClipId: id }),

  setCurrentTime: time => set({ currentTime: Math.max(0, time) }),
  setPlaying: playing => set({ isPlaying: playing }),
  setTimelineScale: scale =>
    set({
      timelineScale: Math.max(APP_CONFIG.MIN_TIMELINE_SCALE, Math.min(APP_CONFIG.MAX_TIMELINE_SCALE, scale)),
    }),

  addTextOverlay: text => {
    set(s => ({ textOverlays: [...s.textOverlays, text], isDirty: true }));
    get().saveSnapshot();
  },

  updateTextOverlay: (id, updates) =>
    set(s => ({
      textOverlays: s.textOverlays.map(t => (t.id === id ? { ...t, ...updates } : t)),
      isDirty: true,
    })),

  removeTextOverlay: id => {
    set(s => ({
      textOverlays: s.textOverlays.filter(t => t.id !== id),
      selectedTextId: s.selectedTextId === id ? null : s.selectedTextId,
      isDirty: true,
    }));
    get().saveSnapshot();
  },

  selectText: id => set({ selectedTextId: id }),

  addAudioTrack: track => {
    set(s => ({ audioTracks: [...s.audioTracks, track], isDirty: true }));
    get().saveSnapshot();
  },

  updateAudioTrack: (id, updates) =>
    set(s => ({
      audioTracks: s.audioTracks.map(t => (t.id === id ? { ...t, ...updates } : t)),
      isDirty: true,
    })),

  removeAudioTrack: id => {
    set(s => ({
      audioTracks: s.audioTracks.filter(t => t.id !== id),
      selectedAudioId: s.selectedAudioId === id ? null : s.selectedAudioId,
      isDirty: true,
    }));
    get().saveSnapshot();
  },

  selectAudio: id => set({ selectedAudioId: id }),

  addStickerOverlay: sticker => {
    set(s => ({ stickerOverlays: [...s.stickerOverlays, sticker], isDirty: true }));
    get().saveSnapshot();
  },

  updateStickerOverlay: (id, updates) =>
    set(s => ({
      stickerOverlays: s.stickerOverlays.map(t => (t.id === id ? { ...t, ...updates } : t)),
      isDirty: true,
    })),

  removeStickerOverlay: id => {
    set(s => ({
      stickerOverlays: s.stickerOverlays.filter(t => t.id !== id),
      selectedStickerId: s.selectedStickerId === id ? null : s.selectedStickerId,
      isDirty: true,
    }));
    get().saveSnapshot();
  },

  selectSticker: id => set({ selectedStickerId: id }),

  addKeyframe: keyframe => set(s => ({ keyframes: [...s.keyframes, keyframe], isDirty: true })),
  removeKeyframe: id => set(s => ({ keyframes: s.keyframes.filter(k => k.id !== id), isDirty: true })),
  updateKeyframe: (id, updates) =>
    set(s => ({
      keyframes: s.keyframes.map(k => (k.id === id ? { ...k, ...updates } : k)),
      isDirty: true,
    })),

  setActiveTool: toolId => set({ activeToolId: toolId }),
  setExportSettings: settings =>
    set(s => ({ exportSettings: { ...s.exportSettings, ...settings } })),

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const previous = history[historyIndex - 1];
    set({
      clips: previous.clips,
      textOverlays: previous.textOverlays,
      audioTracks: previous.audioTracks,
      stickerOverlays: previous.stickerOverlays,
      totalDuration: previous.totalDuration,
      historyIndex: historyIndex - 1,
      isDirty: true,
    });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const next = history[historyIndex + 1];
    set({
      clips: next.clips,
      textOverlays: next.textOverlays,
      audioTracks: next.audioTracks,
      stickerOverlays: next.stickerOverlays,
      totalDuration: next.totalDuration,
      historyIndex: historyIndex + 1,
      isDirty: true,
    });
  },

  saveSnapshot: () => {
    const state = get();
    const snapshot = takeSnapshot(state);
    const trimmed = state.history.slice(0, state.historyIndex + 1);
    trimmed.push(snapshot);
    const sliced = trimmed.length > MAX_HISTORY ? trimmed.slice(trimmed.length - MAX_HISTORY) : trimmed;
    set({ history: sliced, historyIndex: sliced.length - 1 });
  },

  markClean: () => set({ isDirty: false }),
}));
