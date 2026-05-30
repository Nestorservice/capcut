import React from 'react';
import { ViewStyle, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '@constants/colors';

interface Props {
  children?: React.ReactNode;
  colors?: readonly [string, string, ...string[]];
  style?: ViewStyle;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

export function GradientView({
  children,
  colors = Colors.accent.gradient,
  style,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
}: Props) {
  return (
    <LinearGradient colors={colors as unknown as string[]} start={start} end={end} style={style}>
      <View>{children}</View>
    </LinearGradient>
  );
}
