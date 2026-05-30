import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { formatTime } from '@utils/formatTime';

interface Props {
  uri?: string | null;
  width: number;
  height: number;
  duration?: number;
}

export function VideoThumbnail({ uri, width, height, duration }: Props) {
  return (
    <View style={[styles.container, { width, height }]}>
      {uri ? (
        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, { backgroundColor: Colors.bg.elevated }]} />
      )}
      {duration !== undefined ? (
        <View style={styles.durationPill}>
          <Text style={styles.durationText}>{formatTime(duration)}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Dim.radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.bg.card,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  image: { width: '100%', height: '100%' },
  durationPill: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: { color: '#ffffff', fontSize: Typography.sizes.xs, fontWeight: Typography.weights.bold },
});
