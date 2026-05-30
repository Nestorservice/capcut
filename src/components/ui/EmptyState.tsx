import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { Button } from './Button';

interface Props {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon = 'inbox', title, description, actionLabel, onAction }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={48} color={Colors.text.secondary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.desc}>{description}</Text> : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button label={actionLabel} onPress={onAction} variant="primary" size="md" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: Dim.spacing.xxxl },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.bg.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Dim.spacing.lg,
  },
  title: { color: Colors.text.primary, fontSize: Typography.sizes.xl, fontWeight: Typography.weights.bold, textAlign: 'center' },
  desc: {
    color: Colors.text.secondary,
    fontSize: Typography.sizes.base,
    textAlign: 'center',
    marginTop: Dim.spacing.sm,
    maxWidth: 300,
  },
  action: { marginTop: Dim.spacing.xl },
});
