import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@constants/colors';

export function TimelineCursor() {
  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.head} />
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 2,
    transform: [{ translateX: -1 }],
    alignItems: 'center',
    zIndex: 40,
  },
  head: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.editor.cursor,
    marginTop: -4,
  },
  line: { width: 2, flex: 1, backgroundColor: Colors.editor.cursor },
});
