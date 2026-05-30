import { MediaAsset } from '@types/media.types';

const VIDEO_MIME_TYPES = ['video/mp4', 'video/quicktime', 'video/x-matroska', 'video/webm', 'video/3gpp'];
const AUDIO_MIME_TYPES = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/aac', 'audio/x-m4a', 'audio/ogg'];
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
const MAX_AUDIO_SIZE = 50 * 1024 * 1024;
const MAX_IMAGE_SIZE = 20 * 1024 * 1024;

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

export function validateVideo(asset: MediaAsset): ValidationResult {
  if (asset.type !== 'video') return { valid: false, reason: 'Not a video file' };
  if (asset.mimeType && !VIDEO_MIME_TYPES.includes(asset.mimeType)) {
    return { valid: false, reason: `Unsupported video format: ${asset.mimeType}` };
  }
  if (asset.size !== undefined && asset.size > MAX_VIDEO_SIZE) {
    return { valid: false, reason: 'Video file too large (max 500 MB)' };
  }
  if (asset.duration !== undefined && asset.duration < 0.1) {
    return { valid: false, reason: 'Video too short' };
  }
  return { valid: true };
}

export function validateAudio(asset: MediaAsset): ValidationResult {
  if (asset.type !== 'audio') return { valid: false, reason: 'Not an audio file' };
  if (asset.mimeType && !AUDIO_MIME_TYPES.includes(asset.mimeType)) {
    return { valid: false, reason: `Unsupported audio format: ${asset.mimeType}` };
  }
  if (asset.size !== undefined && asset.size > MAX_AUDIO_SIZE) {
    return { valid: false, reason: 'Audio file too large (max 50 MB)' };
  }
  return { valid: true };
}

export function validateImage(asset: MediaAsset): ValidationResult {
  if (asset.type !== 'image') return { valid: false, reason: 'Not an image file' };
  if (asset.mimeType && !IMAGE_MIME_TYPES.includes(asset.mimeType)) {
    return { valid: false, reason: `Unsupported image format: ${asset.mimeType}` };
  }
  if (asset.size !== undefined && asset.size > MAX_IMAGE_SIZE) {
    return { valid: false, reason: 'Image file too large (max 20 MB)' };
  }
  return { valid: true };
}
