import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Dim = {
  screen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  spacing: {
    unit: 4,
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 48,
    container: 16,
    gutter: 12,
  },
  radius: {
    none: 0,
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
    full: 9999,
  },
  touch: {
    min: 44,
    small: 32,
    medium: 40,
    large: 48,
  },
  header: {
    height: 56,
    editorHeight: 48,
  },
  tabBar: {
    height: 64,
  },
  timeline: {
    height: 180,
    trackHeight: 52,
    audioTrackHeight: 24,
    musicTrackHeight: 24,
    cursorWidth: 2,
    handleWidth: 12,
    minClipWidth: 24,
    pixelsPerSecond: 60,
  },
  preview: {
    minHeight: 320,
    aspectRatio: 9 / 16,
  },
  card: {
    projectWidth: 120,
    projectHeight: 160,
    templateWidth: 200,
    templateHeight: 120,
  },
} as const;
