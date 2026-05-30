import { useCallback, useEffect, useRef } from 'react';
import { useEditorStore } from '@store/editorStore';
import { projectsService } from '@services/supabase/projects.service';
import { storageService } from '@services/supabase/storage.service';
import { useAuthStore } from '@store/authStore';
import { APP_CONFIG } from '@constants/index';

export function useEditor() {
  const store = useEditorStore();
  const userId = useAuthStore(s => s.user?.id);
  const saveTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const persist = useCallback(async () => {
    const state = useEditorStore.getState();
    if (!state.projectId || !userId) return;
    try {
      await projectsService.updateProject(state.projectId, {
        timeline_data: {
          clips: state.clips,
          textOverlays: state.textOverlays,
          audioTracks: state.audioTracks,
          stickerOverlays: state.stickerOverlays,
          totalDuration: state.totalDuration,
        },
        duration: state.totalDuration,
      });
      await storageService.saveClips(state.projectId, userId, state.clips);
      await storageService.saveTextOverlays(state.projectId, state.textOverlays);
      await storageService.saveAudioTracks(state.projectId, state.audioTracks);
      await storageService.saveStickers(state.projectId, state.stickerOverlays);
      useEditorStore.getState().markClean();
    } catch (e) {
      console.warn('Auto-save failed', e);
    }
  }, [userId]);

  useEffect(() => {
    if (!store.projectId) return;
    saveTimer.current = setInterval(() => {
      const dirty = useEditorStore.getState().isDirty;
      if (dirty) void persist();
    }, APP_CONFIG.AUTO_SAVE_INTERVAL_MS);
    return () => {
      if (saveTimer.current) clearInterval(saveTimer.current);
    };
  }, [persist, store.projectId]);

  const saveNow = useCallback(() => persist(), [persist]);

  return { ...store, saveNow };
}
