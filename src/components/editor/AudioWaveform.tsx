import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { Colors } from '@constants/colors';

interface Props {
  width: number;
  height?: number;
  seed?: number;
  bars?: number;
  color?: string;
  background?: string;
}

function deterministicHeight(seed: number, index: number): number {
  const v = Math.sin(seed * 9301 + index * 49297) * 0.5 + 0.5;
  return 0.2 + v * 0.8;
}

export function AudioWaveform({
  width,
  height = 24,
  seed = 1,
  bars = 60,
  color = Colors.editor.waveform,
  background = `${Colors.editor.waveform}1A`,
}: Props) {
  const barWidth = useMemo(() => Math.max(1.5, width / bars - 1), [width, bars]);

  return (
    <View style={[styles.container, { width, height, backgroundColor: background, borderColor: `${color}55` }]}>
      <Svg width={width} height={height}>
        {Array.from({ length: bars }).map((_, i) => {
          const ratio = deterministicHeight(seed, i);
          const barH = ratio * (height - 4);
          const x = (i * width) / bars + 1;
          const y = (height - barH) / 2;
          return <Rect key={i} x={x} y={y} width={barWidth} height={barH} rx={1} fill={color} />;
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 6, borderWidth: 1, overflow: 'hidden' },
});
