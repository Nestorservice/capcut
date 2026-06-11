export * from './formatTime';
export * from './formatFileSize';
export * from './debounce';
export * from './validateMedia';
export * from './generateThumbnail';

export const clamp = (value: number, min: number, max: number): number => {
  'worklet';
  return Math.max(min, Math.min(max, value));
};

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const uuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const wait = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));
