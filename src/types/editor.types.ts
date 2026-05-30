export interface ColorAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  temperature: number;
  shadows: number;
  highlights: number;
  sharpness: number;
  vibrance: number;
}

export const DEFAULT_COLOR_ADJUSTMENTS: ColorAdjustments = {
  brightness: 0,
  contrast: 1,
  saturation: 1,
  temperature: 0,
  shadows: 0,
  highlights: 0,
  sharpness: 0,
  vibrance: 0,
};

export interface TransformData {
  scale: number;
  rotation: number;
  translateX: number;
  translateY: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
}

export const DEFAULT_TRANSFORM: TransformData = {
  scale: 1,
  rotation: 0,
  translateX: 0,
  translateY: 0,
  flipHorizontal: false,
  flipVertical: false,
};

export interface FilterData {
  filterId: string;
  intensity: number;
  adjustments: ColorAdjustments;
}

export const DEFAULT_FILTER_DATA: FilterData = {
  filterId: 'none',
  intensity: 1,
  adjustments: DEFAULT_COLOR_ADJUSTMENTS,
};

export type InterpolationType = 'linear' | 'ease-in' | 'ease-out' | 'bezier';

export interface KeyframeProperties {
  positionX?: number;
  positionY?: number;
  scale?: number;
  rotation?: number;
  opacity?: number;
}

export interface Keyframe {
  id: string;
  time: number;
  targetId: string;
  targetType: 'clip' | 'text' | 'sticker';
  properties: KeyframeProperties;
  interpolation: InterpolationType;
}

export interface Clip {
  id: string;
  projectId?: string;
  sourceUri: string;
  cloudinaryPublicId?: string;
  thumbnailUri?: string;
  startTime: number;
  endTime: number;
  duration: number;
  trimStart: number;
  trimEnd: number;
  position: number;
  speed: number;
  volume: number;
  isMuted: boolean;
  transform: TransformData;
  filter: FilterData;
  transitionToNextId?: string;
  transitionDuration?: number;
  keyframes: Keyframe[];
}

export interface TextOverlay {
  id: string;
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  color: string;
  backgroundColor?: string;
  positionX: number;
  positionY: number;
  scale: number;
  rotation: number;
  startTime: number;
  endTime: number;
  animationIn?: string;
  animationOut?: string;
  animationLoop?: string;
  shadow?: boolean;
  stroke?: boolean;
  strokeColor?: string;
  strokeWidth?: number;
  letterSpacing?: number;
  lineHeight?: number;
  alignment?: 'left' | 'center' | 'right';
}

export type AudioTrackType = 'music' | 'voiceover' | 'extracted' | 'sfx';

export interface AudioTrack {
  id: string;
  cloudinaryPublicId?: string;
  uri: string;
  title?: string;
  artist?: string;
  duration: number;
  startTime: number;
  offset: number;
  volume: number;
  isMuted: boolean;
  trackType: AudioTrackType;
  fadeIn: number;
  fadeOut: number;
}

export interface StickerOverlay {
  id: string;
  stickerId: string;
  stickerUrl: string;
  positionX: number;
  positionY: number;
  scale: number;
  rotation: number;
  startTime: number;
  endTime: number;
  keyframes: Keyframe[];
}

export interface ExportSettings {
  resolution: '480p' | '720p' | '1080p' | '2k' | '4k';
  frameRate: 24 | 30 | 60;
  format: 'mp4';
  bitrate?: number;
  aspectRatio: string;
  watermark: boolean;
}

export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  resolution: '1080p',
  frameRate: 30,
  format: 'mp4',
  aspectRatio: '9:16',
  watermark: false,
};

export interface EditorSnapshot {
  clips: Clip[];
  textOverlays: TextOverlay[];
  audioTracks: AudioTrack[];
  stickerOverlays: StickerOverlay[];
  totalDuration: number;
  timestamp: number;
}

export interface AudioMixOption {
  uri: string;
  startTime: number;
  duration: number;
  volume: number;
  fadeIn: number;
  fadeOut: number;
}

export interface AudioOptions {
  volume?: number;
  startOffset?: number;
  fadeIn?: number;
  fadeOut?: number;
  replaceOriginal?: boolean;
}

export interface TextOverlayData {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontColor: string;
  fontFamily?: string;
  shadow?: boolean;
  borderWidth?: number;
  borderColor?: string;
}

export type TransitionType = 'fade' | 'dissolve' | 'wipeleft' | 'wiperight' | 'slidedown' | 'slideup' | 'zoom' | 'pixelize' | 'radial' | 'smoothleft';
