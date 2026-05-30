import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';

interface Props {
  title: string;
  onClose: () => void;
  onApply?: () => void;
  applyLabel?: string;
}

export function ToolHeader({ title, onClose, onApply, applyLabel = 'Done' }: Props) {
  return (
    <View style={styles.row}>
      <Pressable hitSlop={10} onPress={onClose}>
        <Icon name="close" size={26} color="#ffffff" />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      {onApply ? (
        <Pressable hitSlop={10} onPress={onApply}>
          <Text style={styles.apply}>{applyLabel}</Text>
        </Pressable>
      ) : (
        <View style={{ width: 36 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 56,
    paddingHorizontal: Dim.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  title: { color: '#ffffff', fontSize: Typography.sizes.lg, fontWeight: '700' },
  apply: { color: Colors.accent.pink, fontSize: Typography.sizes.base, fontWeight: '700' },
});
