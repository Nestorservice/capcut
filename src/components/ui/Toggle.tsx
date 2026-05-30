import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Colors } from '@constants/colors';

interface Props {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ value, onChange, disabled = false }: Props) {
  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(value ? Colors.accent.pink : Colors.border.default, { duration: 180 }),
  }));
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(value ? 22 : 2, { duration: 180 }) }],
  }));
  return (
    <Pressable onPress={() => !disabled && onChange(!value)} disabled={disabled} hitSlop={6}>
      <Animated.View style={[styles.track, trackStyle, disabled && styles.disabled]}>
        <Animated.View style={[styles.thumb, thumbStyle]}>
          <View style={styles.thumbInner} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: { width: 48, height: 28, borderRadius: 14, justifyContent: 'center', padding: 2 },
  thumb: { width: 24, height: 24, borderRadius: 12, position: 'absolute', top: 2 },
  thumbInner: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#ffffff' },
  disabled: { opacity: 0.5 },
});
