import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Colors } from '@constants/colors';
import { Dim } from '@constants/dimensions';
import { Clip } from '@types/editor.types';

interface Props {
  clip: Clip;
  widthPx: number;
  selected: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
}

export function ClipItem({ clip, widthPx, selected, onPress, onLongPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.container,
        {
          width: Math.max(Dim.timeline.minClipWidth, widthPx),
          borderColor: selected ? Colors.editor.selectedClip : Colors.editor.clipBorder,
          borderWidth: selected ? 2 : 1,
        },
      ]}
    >
      {clip.thumbnailUri ? (
        <Image source={{ uri: clip.thumbnailUri }} style={styles.thumb} resizeMode="cover" />
      ) : (
        <View style={styles.thumb} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Dim.timeline.trackHeight,
    backgroundColor: Colors.surface.containerHigh,
    borderRadius: 6,
    overflow: 'hidden',
    marginHorizontal: 1,
  },
  thumb: { width: '100%', height: '100%', opacity: 0.85 },
});
