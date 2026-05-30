import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditorStackParamList } from '@types/navigation.types';
import { ToolHeader } from './_shared/ToolHeader';
import { TabBar } from '@components/ui/TabBar';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { useEditorStore } from '@store/editorStore';

type Props = NativeStackScreenProps<EditorStackParamList, 'TextAnimation'>;

const ANIMATIONS = {
  in: ['fade', 'slide-up', 'slide-down', 'zoom-in', 'typewriter'],
  loop: ['none', 'pulse', 'bounce', 'shake', 'rotate'],
  out: ['fade', 'slide-up', 'slide-down', 'zoom-out'],
};

export function TextAnimationScreen({ route, navigation }: Props) {
  const overlay = useEditorStore(s => s.textOverlays.find(t => t.id === route.params.overlayId) ?? null);
  const updateText = useEditorStore(s => s.updateTextOverlay);
  const [tab, setTab] = useState<'in' | 'loop' | 'out'>('in');

  if (!overlay) {
    return (
      <SafeAreaView style={styles.root}>
        <ToolHeader title="Animations" onClose={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const current = tab === 'in' ? overlay.animationIn : tab === 'loop' ? overlay.animationLoop : overlay.animationOut;

  const setAnimation = (value: string) => {
    if (tab === 'in') updateText(overlay.id, { animationIn: value });
    if (tab === 'loop') updateText(overlay.id, { animationLoop: value });
    if (tab === 'out') updateText(overlay.id, { animationOut: value });
  };

  return (
    <SafeAreaView style={styles.root}>
      <ToolHeader title="Animations" onClose={() => navigation.goBack()} onApply={() => navigation.goBack()} />
      <TabBar
        tabs={[
          { id: 'in', label: 'In' },
          { id: 'loop', label: 'Loop' },
          { id: 'out', label: 'Out' },
        ]}
        activeId={tab}
        onChange={id => setTab(id as 'in' | 'loop' | 'out')}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {ANIMATIONS[tab].map(name => (
            <Pressable
              key={name}
              onPress={() => setAnimation(name)}
              style={[styles.card, current === name && styles.cardActive]}
            >
              <Text style={[styles.cardLabel, current === name && styles.cardLabelActive]}>{name}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  content: { padding: Dim.spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '47%', height: 80, backgroundColor: Colors.bg.elevated, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border.light },
  cardActive: { borderColor: Colors.accent.pink, backgroundColor: 'rgba(255,64,129,0.1)' },
  cardLabel: { color: Colors.text.primary, fontSize: Typography.sizes.base, fontWeight: '600', textTransform: 'capitalize' },
  cardLabelActive: { color: Colors.accent.pink },
});
