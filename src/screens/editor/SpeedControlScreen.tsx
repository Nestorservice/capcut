import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditorStackParamList } from '@types/navigation.types';
import { ToolHeader } from './_shared/ToolHeader';
import { Slider } from '@components/ui/Slider';
import { TabBar } from '@components/ui/TabBar';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { useEditorStore } from '@store/editorStore';

type Props = NativeStackScreenProps<EditorStackParamList, 'SpeedControl'>;

const PRESETS = [0.25, 0.5, 1, 1.5, 2, 3, 4];

export function SpeedControlScreen({ route, navigation }: Props) {
  const clip = useEditorStore(s => s.clips.find(c => c.id === route.params.clipId) ?? null);
  const updateClip = useEditorStore(s => s.updateClip);
  const [tab, setTab] = useState<'normal' | 'curve'>('normal');
  const [speed, setSpeed] = useState(clip?.speed ?? 1);

  if (!clip) {
    return (
      <SafeAreaView style={styles.root}>
        <ToolHeader title="Speed" onClose={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const onApply = () => {
    updateClip(clip.id, { speed });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.root}>
      <ToolHeader title="Speed" onClose={() => navigation.goBack()} onApply={onApply} />
      <TabBar
        tabs={[
          { id: 'normal', label: 'Normal' },
          { id: 'curve', label: 'Curve' },
        ]}
        activeId={tab}
        onChange={id => setTab(id as 'normal' | 'curve')}
      />
      <View style={styles.content}>
        <View style={styles.heroBox}>
          <Text style={styles.heroValue}>{speed.toFixed(2)}x</Text>
          <Text style={styles.heroLabel}>{speed === 1 ? 'Normal' : speed < 1 ? 'Slow motion' : 'Fast'}</Text>
        </View>

        {tab === 'normal' ? (
          <>
            <Slider
              value={speed}
              min={0.1}
              max={10}
              step={0.05}
              onChange={setSpeed}
              formatValue={v => `${v.toFixed(2)}x`}
              label="Speed"
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presets}>
              {PRESETS.map(p => (
                <Pressable
                  key={p}
                  onPress={() => setSpeed(p)}
                  style={[styles.preset, speed === p && styles.presetActive]}
                >
                  <Text style={[styles.presetText, speed === p && styles.presetTextActive]}>{p}x</Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        ) : (
          <View style={styles.curveBox}>
            <Text style={styles.curveLabel}>Curve mode</Text>
            <Text style={styles.curveDesc}>Variable speed curves coming soon. Apply normal speed for now.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  content: { padding: Dim.spacing.lg, gap: 24 },
  heroBox: { alignItems: 'center', padding: 24, backgroundColor: Colors.bg.elevated, borderRadius: 16, borderWidth: 1, borderColor: Colors.border.light },
  heroValue: { color: '#ffffff', fontSize: 48, fontWeight: '800' },
  heroLabel: { color: Colors.text.secondary, fontSize: Typography.sizes.sm, marginTop: 4 },
  presets: { gap: 8, paddingHorizontal: 4 },
  preset: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: Colors.bg.card, borderWidth: 1, borderColor: Colors.border.light },
  presetActive: { backgroundColor: Colors.accent.pink, borderColor: Colors.accent.pink },
  presetText: { color: Colors.text.primary, fontSize: Typography.sizes.sm, fontWeight: '600' },
  presetTextActive: { color: '#ffffff' },
  curveBox: { padding: 24, backgroundColor: Colors.bg.card, borderRadius: 12, alignItems: 'center' },
  curveLabel: { color: Colors.text.primary, fontSize: Typography.sizes.lg, fontWeight: '700', marginBottom: 8 },
  curveDesc: { color: Colors.text.secondary, fontSize: Typography.sizes.sm, textAlign: 'center' },
});
