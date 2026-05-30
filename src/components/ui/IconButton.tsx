import React from 'react';
import { Pressable, StyleSheet, ViewStyle, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@constants/colors';

interface Props {
  icon: string;
  onPress?: () => void;
  size?: number;
  color?: string;
  background?: string;
  containerSize?: number;
  disabled?: boolean;
  badge?: number;
  style?: ViewStyle;
  testID?: string;
}

export function IconButton({
  icon,
  onPress,
  size = 24,
  color = Colors.text.primary,
  background,
  containerSize = 44,
  disabled = false,
  badge,
  style,
  testID,
}: Props) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      style={({ pressed }) => [
        styles.btn,
        {
          width: containerSize,
          height: containerSize,
          backgroundColor: background ?? 'transparent',
          opacity: disabled ? 0.4 : 1,
          transform: [{ scale: pressed ? 0.92 : 1 }],
        },
        style,
      ]}
    >
      <Icon name={icon} size={size} color={color} />
      {badge && badge > 0 ? (
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { alignItems: 'center', justifyContent: 'center', borderRadius: 999 },
  badge: { position: 'absolute', top: 6, right: 6 },
  badgeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accent.pink },
});
