export * from './colors';
export * from './typography';
export * from './dimensions';
export * from './filters';
export * from './transitions';
export * from './permissions';

export const APP_CONFIG = {
  AUTO_SAVE_INTERVAL_MS: 30_000,
  MIN_CLIP_DURATION: 0.1,
  MIN_TRIM_DURATION: 0.3,
  MAX_VIDEO_DURATION: 60 * 60,
  DEFAULT_FPS: 30,
  DEFAULT_RESOLUTION: '1080p',
  THUMBNAIL_STRIP_COUNT: 12,
  DEFAULT_TIMELINE_SCALE: 1,
  MIN_TIMELINE_SCALE: 0.5,
  MAX_TIMELINE_SCALE: 10,
} as const;

export const RESOLUTIONS = [
  { label: '480p', value: '480p', width: 854, height: 480 },
  { label: '720p', value: '720p', width: 1280, height: 720 },
  { label: '1080p', value: '1080p', width: 1920, height: 1080 },
  { label: '2K', value: '2k', width: 2560, height: 1440 },
  { label: '4K', value: '4k', width: 3840, height: 2160 },
] as const;

export const FRAME_RATES = [24, 30, 60] as const;

export const ASPECT_RATIOS = [
  { label: '9:16', value: '9:16', width: 9, height: 16 },
  { label: '16:9', value: '16:9', width: 16, height: 9 },
  { label: '1:1', value: '1:1', width: 1, height: 1 },
  { label: '4:5', value: '4:5', width: 4, height: 5 },
  { label: '3:4', value: '3:4', width: 3, height: 4 },
  { label: '4:3', value: '4:3', width: 4, height: 3 },
] as const;

export const EDITOR_TOOLS = [
  { id: 'trim', name: 'Trim', icon: 'content-cut' },
  { id: 'split', name: 'Split', icon: 'call-split' },
  { id: 'speed', name: 'Speed', icon: 'speed' },
  { id: 'text', name: 'Text', icon: 'text-fields' },
  { id: 'audio', name: 'Audio', icon: 'music-note' },
  { id: 'voice', name: 'Voice', icon: 'mic' },
  { id: 'filters', name: 'Filters', icon: 'filter-vintage' },
  { id: 'adjust', name: 'Adjust', icon: 'tune' },
  { id: 'transition', name: 'Transitions', icon: 'gradient' },
  { id: 'overlay', name: 'Overlay', icon: 'layers' },
  { id: 'stickers', name: 'Stickers', icon: 'emoji-emotions' },
  { id: 'keyframe', name: 'Keyframe', icon: 'animation' },
  { id: 'format', name: 'Format', icon: 'aspect-ratio' },
] as const;
