import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '@constants/colors';
import { Dim } from '@constants/dimensions';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
}

export function Card({ children, onPress, style, padding = Dim.spacing.lg }: Props) {
  const inner = (
    <View style={[styles.card, { padding }, style]}>{children}</View>
  );
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.98 : 1 }] })}>
        {inner}
      </Pressable>
    );
  }
  return inner;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bg.elevated,
    borderRadius: Dim.radius.xl,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
});
