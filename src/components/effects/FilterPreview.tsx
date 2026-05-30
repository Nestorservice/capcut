import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { FilterDefinition } from '@constants/filters';

interface Props {
  filter: FilterDefinition;
  previewUri?: string;
  selected: boolean;
  onPress?: () => void;
}

export function FilterPreview({ filter, previewUri, selected, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.btn}>
      <View
        style={[
          styles.thumb,
          selected && styles.thumbActive,
        ]}
      >
        {previewUri ? (
          <Image source={{ uri: previewUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, { backgroundColor: Colors.bg.elevated }]} />
        )}
      </View>
      <Text style={[styles.label, selected && styles.labelActive]} numberOfLines={1}>
        {filter.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { alignItems: 'center', width: 80, marginRight: Dim.spacing.sm },
  thumb: {
    width: 64,
    height: 80,
    borderRadius: Dim.radius.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbActive: { borderColor: Colors.accent.pink },
  image: { width: '100%', height: '100%' },
  label: { marginTop: 6, color: Colors.text.secondary, fontSize: Typography.sizes.xs, textAlign: 'center' },
  labelActive: { color: Colors.accent.pink, fontWeight: Typography.weights.bold },
});
