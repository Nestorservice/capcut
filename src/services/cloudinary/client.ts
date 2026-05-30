import Config from 'react-native-config';

export const CLOUDINARY_CONFIG = {
  cloudName: Config.CLOUDINARY_CLOUD_NAME ?? '',
  apiKey: Config.CLOUDINARY_API_KEY ?? '',
  uploadPreset: Config.CLOUDINARY_UPLOAD_PRESET ?? 'capcut_clone_unsigned',
} as const;

export const CLOUDINARY_BASE = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}`;
export const CLOUDINARY_DELIVERY = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}`;

if (!CLOUDINARY_CONFIG.cloudName) {
  console.warn('[Cloudinary] Missing CLOUDINARY_CLOUD_NAME in env');
}
