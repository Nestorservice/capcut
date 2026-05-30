import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';

interface Props {
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

export function Badge({ label, variant = 'default' }: Props) {
  const bg = COLORS[variant];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const COLORS: Record<NonNullable<Props['variant']>, string> = {
  default: Colors.bg.card,
  primary: Colors.accent.pink,
  success: Colors.status.success,
  warning: Colors.status.warning,
  error: Colors.status.error,
};

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, alignSelf: 'flex-start' },
  label: { color: '#ffffff', fontSize: Typography.sizes.xs, fontWeight: Typography.weights.bold },
});
