import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ToolButton } from './ToolButton';
import { EDITOR_TOOLS } from '@constants/index';
import { Colors } from '@constants/colors';
import { Dim } from '@constants/dimensions';

interface Props {
  activeToolId: string | null;
  onSelectTool: (toolId: string) => void;
}

export function ToolBar({ activeToolId, onSelectTool }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {EDITOR_TOOLS.map(tool => (
          <ToolButton
            key={tool.id}
            label={tool.name}
            icon={tool.icon}
            active={activeToolId === tool.id}
            onPress={() => onSelectTool(tool.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.bg.toolbar, borderTopWidth: 1, borderTopColor: Colors.border.light },
  content: { paddingHorizontal: Dim.spacing.md, paddingVertical: Dim.spacing.md, gap: Dim.spacing.xs },
});
