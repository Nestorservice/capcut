import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle, TextStyle, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@constants/colors';
import { Dim } from '@constants/dimensions';
import { Typography } from '@constants/typography';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconRight?: string;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  testID?: string;
}

const SIZES: Record<ButtonSize, { height: number; px: number; fontSize: number; icon: number }> = {
  sm: { height: 36, px: 12, fontSize: Typography.sizes.sm, icon: 16 },
  md: { height: 44, px: 16, fontSize: Typography.sizes.base, icon: 18 },
  lg: { height: 52, px: 20, fontSize: Typography.sizes.lg, icon: 20 },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  testID,
}: Props) {
  const sz = SIZES[size];
  const isDisabled = disabled || loading;

  const content = (
    <View style={styles.row}>
      {loading ? (
        <ActivityIndicator color={Colors.text.primary} size="small" />
      ) : (
        <>
          {icon ? <Icon name={icon} size={sz.icon} color={textColor(variant)} style={styles.iconLeft} /> : null}
          <Text style={[styles.label, { color: textColor(variant), fontSize: sz.fontSize }]}>{label}</Text>
          {iconRight ? <Icon name={iconRight} size={sz.icon} color={textColor(variant)} style={styles.iconRight} /> : null}
        </>
      )}
    </View>
  );

  const baseStyle: ViewStyle = {
    height: sz.height,
    paddingHorizontal: sz.px,
    borderRadius: Dim.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: isDisabled ? 0.5 : 1,
    width: fullWidth ? '100%' : undefined,
  };

  if (variant === 'primary') {
    return (
      <Pressable testID={testID} onPress={onPress} disabled={isDisabled} style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.97 : 1 }] }, baseStyle, style]}>
        <LinearGradient
          colors={Colors.accent.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFillObject, { borderRadius: Dim.radius.md }]}
        />
        {content}
      </Pressable>
    );
  }

  const bg =
    variant === 'destructive'
      ? Colors.status.error
      : variant === 'outline'
        ? 'transparent'
        : variant === 'ghost'
          ? 'transparent'
          : Colors.bg.card;
  const border = variant === 'outline' ? Colors.border.medium : 'transparent';

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        baseStyle,
        { backgroundColor: bg, borderColor: border, borderWidth: variant === 'outline' ? 1 : 0, transform: [{ scale: pressed ? 0.97 : 1 }] },
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}

function textColor(variant: ButtonVariant): string {
  if (variant === 'ghost' || variant === 'outline') return Colors.text.primary;
  if (variant === 'destructive') return Colors.text.primary;
  return '#ffffff';
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  label: { fontWeight: Typography.weights.semibold } as TextStyle,
  iconLeft: { marginRight: 8 },
  iconRight: { marginLeft: 8 },
});
