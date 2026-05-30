import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';

interface Props {
  label: string;
  icon: string;
  onPress?: () => void;
  active?: boolean;
  disabled?: boolean;
}

export function ToolButton({ label, icon, onPress, active = false, disabled = false }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        { transform: [{ scale: pressed ? 0.94 : 1 }], opacity: disabled ? 0.5 : 1 },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          active && styles.iconWrapActive,
        ]}
      >
        <Icon name={icon} size={22} color={active ? Colors.accent.pink : Colors.text.primary} />
      </View>
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { alignItems: 'center', justifyContent: 'center', minWidth: 64, paddingHorizontal: Dim.spacing.sm },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bg.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(255, 64, 129, 0.12)',
    shadowColor: Colors.accent.pink,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  label: {
    marginTop: 6,
    color: Colors.text.secondary,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  labelActive: { color: Colors.accent.pink },
});
