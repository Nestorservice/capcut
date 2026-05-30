import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { Colors } from '@constants/colors';

interface Props {
  position: number;
  selected?: boolean;
  onPress?: () => void;
}

export function KeyframeMarker({ position, selected = false, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, { left: position - 8, borderColor: selected ? '#ffffff' : Colors.editor.keyframe }]}
    >
      <View style={styles.diamond} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
    borderWidth: 1,
  },
  diamond: { width: '100%', height: '100%', backgroundColor: Colors.editor.keyframe, borderRadius: 2 },
});
