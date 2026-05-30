import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Colors } from '@constants/colors';

interface Props {
  position: number;
  onDrag: (delta: number) => void;
  onDragEnd?: () => void;
  side: 'left' | 'right';
  height?: number;
}

export function TrimHandle({ position, onDrag, onDragEnd, side, height = 60 }: Props) {
  const offset = useSharedValue(position);
  const startOffset = useSharedValue(position);

  const pan = Gesture.Pan()
    .onStart(() => {
      startOffset.value = offset.value;
    })
    .onUpdate(e => {
      const delta = e.translationX;
      offset.value = startOffset.value + delta;
      runOnJS(onDrag)(delta);
    })
    .onEnd(() => {
      if (onDragEnd) runOnJS(onDragEnd)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.container, { height }, animatedStyle]}>
        <View style={[styles.handle, side === 'right' ? styles.handleRight : styles.handleLeft]}>
          <View style={styles.grip} />
          <View style={styles.grip} />
          <View style={styles.grip} />
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: { width: 18, position: 'absolute', top: 0, alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  handle: {
    width: 14,
    height: '100%',
    backgroundColor: Colors.editor.trimHandle,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  handleLeft: { borderTopLeftRadius: 4, borderBottomLeftRadius: 4 },
  handleRight: { borderTopRightRadius: 4, borderBottomRightRadius: 4 },
  grip: { width: 2, height: 8, backgroundColor: '#000000', opacity: 0.7, borderRadius: 1 },
});
