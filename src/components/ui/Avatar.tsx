import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';

interface Props {
  uri?: string | null;
  name?: string;
  size?: number;
}

export function Avatar({ uri, name, size = 36 }: Props) {
  const initials = name
    ? name
        .split(' ')
        .map(p => p.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <Text style={[styles.initials, { fontSize: Math.max(10, size * 0.4) }]}>{initials}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface.containerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border.medium,
    overflow: 'hidden',
  },
  initials: { color: Colors.text.primary, fontWeight: Typography.weights.bold },
});
