import { TextStyle } from 'react-native';

export const Typography = {
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
    extrabold: '800' as TextStyle['fontWeight'],
    black: '900' as TextStyle['fontWeight'],
  },
  families: {
    default: 'System',
    display: 'System',
    body: 'System',
    mono: 'monospace',
  },
  lineHeights: {
    tight: 1.2,
    snug: 1.3,
    normal: 1.4,
    relaxed: 1.5,
    loose: 1.6,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
} as const;

export const TextStyles = {
  display: {
    fontSize: 32,
    fontWeight: '800' as TextStyle['fontWeight'],
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  headlineLg: {
    fontSize: 24,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 32,
  },
  headlineMd: {
    fontSize: 20,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 28,
  },
  headlineSm: {
    fontSize: 18,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 24,
  },
  bodyLg: {
    fontSize: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 24,
  },
  bodyMd: {
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 20,
  },
  labelMd: {
    fontSize: 12,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  labelSm: {
    fontSize: 10,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 12,
  },
} as const;
