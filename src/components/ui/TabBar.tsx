import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@constants/colors';
import { Dim } from '@constants/dimensions';
import { Typography } from '@constants/typography';

export interface TabItem {
  id: string;
  label: string;
}

interface Props {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  scrollable?: boolean;
}

export function TabBar({ tabs, activeId, onChange, scrollable = false }: Props) {
  const content = (
    <View style={[styles.row, scrollable ? null : styles.evenSpace]}>
      {tabs.map(tab => {
        const isActive = tab.id === activeId;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            style={styles.tabBtn}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
            {isActive ? <View style={styles.indicator} /> : null}
          </Pressable>
        );
      })}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {content}
      </ScrollView>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Dim.spacing.lg },
  row: { flexDirection: 'row', gap: Dim.spacing.xl },
  evenSpace: { paddingHorizontal: Dim.spacing.lg },
  tabBtn: { paddingVertical: Dim.spacing.md, alignItems: 'center' },
  label: { color: Colors.text.secondary, fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold },
  labelActive: { color: Colors.text.primary },
  indicator: {
    position: 'absolute',
    bottom: 0,
    width: 24,
    height: 3,
    backgroundColor: Colors.accent.pink,
    borderRadius: 2,
  },
});
