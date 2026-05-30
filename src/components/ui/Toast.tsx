import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUIStore } from '@store/uiStore';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';

const VARIANT_ICONS = {
  success: { icon: 'check-circle', color: Colors.status.success },
  error: { icon: 'error', color: Colors.status.error },
  warning: { icon: 'warning', color: Colors.status.warning },
  info: { icon: 'info', color: Colors.status.info },
} as const;

export function ToastHost() {
  const toasts = useUIStore(s => s.toasts);
  if (toasts.length === 0) return null;
  return (
    <View style={styles.host} pointerEvents="none">
      {toasts.map(t => {
        const variant = VARIANT_ICONS[t.variant];
        return (
          <View key={t.id} style={styles.toast}>
            <Icon name={variant.icon} size={20} color={variant.color} />
            <Text style={styles.text}>{t.message}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    top: 70,
    left: Dim.spacing.lg,
    right: Dim.spacing.lg,
    zIndex: 1000,
    gap: Dim.spacing.sm,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.panel,
    borderRadius: Dim.radius.md,
    padding: Dim.spacing.md,
    gap: Dim.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  text: { color: Colors.text.primary, fontSize: Typography.sizes.base, flex: 1 },
});
