import { Platform } from 'react-native';
import { PERMISSIONS, Permission } from 'react-native-permissions';

const ANDROID_SDK = typeof Platform.Version === 'number' ? Platform.Version : parseInt(String(Platform.Version), 10);

export const isAndroid13Plus = (): boolean => Platform.OS === 'android' && ANDROID_SDK >= 33;
export const isAndroid10Plus = (): boolean => Platform.OS === 'android' && ANDROID_SDK >= 29;

export const AppPermissions = {
  CAMERA: (Platform.OS === 'android'
    ? PERMISSIONS.ANDROID.CAMERA
    : PERMISSIONS.IOS.CAMERA) as Permission,

  MICROPHONE: (Platform.OS === 'android'
    ? PERMISSIONS.ANDROID.RECORD_AUDIO
    : PERMISSIONS.IOS.MICROPHONE) as Permission,

  READ_MEDIA_VIDEO: (Platform.OS === 'android'
    ? isAndroid13Plus()
      ? PERMISSIONS.ANDROID.READ_MEDIA_VIDEO
      : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
    : PERMISSIONS.IOS.PHOTO_LIBRARY) as Permission,

  READ_MEDIA_AUDIO: (Platform.OS === 'android'
    ? isAndroid13Plus()
      ? PERMISSIONS.ANDROID.READ_MEDIA_AUDIO
      : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
    : PERMISSIONS.IOS.MEDIA_LIBRARY) as Permission,

  READ_MEDIA_IMAGES: (Platform.OS === 'android'
    ? isAndroid13Plus()
      ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
      : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
    : PERMISSIONS.IOS.PHOTO_LIBRARY) as Permission,

  WRITE_STORAGE: (Platform.OS === 'android' && !isAndroid10Plus()
    ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
    : PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY) as Permission,
} as const;

export const PERMISSION_RATIONALES = {
  CAMERA: {
    title: 'Camera Access Required',
    message: 'CapCut needs camera access to let you record video clips directly from the app.',
    buttonPositive: 'Allow',
    buttonNegative: 'Deny',
  },
  MICROPHONE: {
    title: 'Microphone Access Required',
    message: 'CapCut needs microphone access to record voiceovers for your projects.',
    buttonPositive: 'Allow',
    buttonNegative: 'Deny',
  },
  MEDIA: {
    title: 'Media Access Required',
    message: 'CapCut needs access to your media library to import videos, photos and audio.',
    buttonPositive: 'Allow',
    buttonNegative: 'Deny',
  },
  STORAGE: {
    title: 'Storage Access Required',
    message: 'CapCut needs storage access to save your exported videos.',
    buttonPositive: 'Allow',
    buttonNegative: 'Deny',
  },
} as const;
