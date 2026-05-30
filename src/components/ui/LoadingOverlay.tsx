import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';

interface Props {
  visible: boolean;
  message?: string | null;
}

export function LoadingOverlay({ visible, message }: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <ActivityIndicator size="large" color={Colors.accent.pink} />
          {message ? <Text style={styles.msg}>{message}</Text> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' },
  box: { padding: 24, borderRadius: 12, backgroundColor: Colors.bg.panel, alignItems: 'center', minWidth: 160 },
  msg: { color: Colors.text.primary, marginTop: 12, fontSize: Typography.sizes.base },
});
