import React, { useCallback, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View, Text } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, runOnJS } from 'react-native-reanimated';
import { Colors } from '@constants/colors';
import { Dim } from '@constants/dimensions';
import { Typography } from '@constants/typography';
import { clamp } from '@utils/index';

interface Props {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  step?: number;
}

export function Slider({
  value,
  min,
  max,
  onChange,
  onChangeEnd,
  label,
  showValue = true,
  formatValue,
  step,
}: Props) {
  const [width, setWidth] = useState(0);
  const offset = useSharedValue(0);
  const startOffset = useSharedValue(0);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setWidth(w);
    const ratio = (value - min) / Math.max(0.0001, max - min);
    offset.value = clamp(ratio, 0, 1) * w;
  }, [max, min, offset, value]);

  const update = useCallback(
    (px: number, finalize = false) => {
      const ratio = clamp(px / Math.max(1, width), 0, 1);
      let v = min + ratio * (max - min);
      if (step && step > 0) v = Math.round(v / step) * step;
      onChange(v);
      if (finalize) onChangeEnd?.(v);
    },
    [max, min, onChange, onChangeEnd, step, width],
  );

  const pan = Gesture.Pan()
    .onStart(() => {
      startOffset.value = offset.value;
    })
    .onUpdate(e => {
      offset.value = clamp(startOffset.value + e.translationX, 0, width);
      runOnJS(update)(offset.value);
    })
    .onEnd(() => {
      runOnJS(update)(offset.value, true);
    });

  const fillStyle = useAnimatedStyle(() => ({ width: offset.value }));
  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value - 10 }] }));

  return (
    <View style={styles.container}>
      {label || showValue ? (
        <View style={styles.headerRow}>
          {label ? <Text style={styles.label}>{label}</Text> : <View />}
          {showValue ? (
            <Text style={styles.value}>{formatValue ? formatValue(value) : value.toFixed(2)}</Text>
          ) : null}
        </View>
      ) : null}
      <GestureDetector gesture={pan}>
        <View style={styles.track} onLayout={onLayout}>
          <View style={styles.trackBg} />
          <Animated.View style={[styles.fill, fillStyle]} />
          <Animated.View style={[styles.thumb, thumbStyle]} />
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: Dim.spacing.sm },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Dim.spacing.sm },
  label: { color: Colors.text.secondary, fontSize: Typography.sizes.sm },
  value: { color: Colors.text.primary, fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold },
  track: { height: 24, justifyContent: 'center' },
  trackBg: { position: 'absolute', left: 0, right: 0, height: 3, backgroundColor: Colors.border.default, borderRadius: 2 },
  fill: { position: 'absolute', left: 0, height: 3, backgroundColor: Colors.accent.pink, borderRadius: 2 },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.accent.pink,
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: Colors.accent.pink,
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
});
