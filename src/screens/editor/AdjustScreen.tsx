import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditorStackParamList } from '@types/navigation.types';
import { ToolHeader } from './_shared/ToolHeader';
import { Slider } from '@components/ui/Slider';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { useEditorStore } from '@store/editorStore';
import { ColorAdjustments, DEFAULT_COLOR_ADJUSTMENTS } from '@types/editor.types';

type Props = NativeStackScreenProps<EditorStackParamList, 'Adjust'>;

interface AdjustControl {
  key: keyof ColorAdjustments;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

const CONTROLS: AdjustControl[] = [
  { key: 'brightness', label: 'Brightness', min: -1, max: 1, step: 0.01, defaultValue: 0 },
  { key: 'contrast', label: 'Contrast', min: 0, max: 2, step: 0.01, defaultValue: 1 },
  { key: 'saturation', label: 'Saturation', min: 0, max: 3, step: 0.01, defaultValue: 1 },
  { key: 'temperature', label: 'Temperature', min: -1, max: 1, step: 0.01, defaultValue: 0 },
  { key: 'shadows', label: 'Shadows', min: -1, max: 1, step: 0.01, defaultValue: 0 },
  { key: 'highlights', label: 'Highlights', min: -1, max: 1, step: 0.01, defaultValue: 0 },
  { key: 'sharpness', label: 'Sharpness', min: 0, max: 1, step: 0.01, defaultValue: 0 },
  { key: 'vibrance', label: 'Vibrance', min: -1, max: 1, step: 0.01, defaultValue: 0 },
];

export function AdjustScreen({ route, navigation }: Props) {
  const clip = useEditorStore(s => s.clips.find(c => c.id === route.params.clipId) ?? null);
  const updateClip = useEditorStore(s => s.updateClip);
  const [adj, setAdj] = useState<ColorAdjustments>(clip?.filter.adjustments ?? DEFAULT_COLOR_ADJUSTMENTS);

  if (!clip) {
    return (
      <SafeAreaView style={styles.root}>
        <ToolHeader title="Adjust" onClose={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const onApply = () => {
    updateClip(clip.id, { filter: { ...clip.filter, adjustments: adj } });
    navigation.goBack();
  };

  const onReset = () => setAdj(DEFAULT_COLOR_ADJUSTMENTS);

  return (
    <SafeAreaView style={styles.root}>
      <ToolHeader title="Adjust" onClose={() => navigation.goBack()} onApply={onApply} />
      <ScrollView contentContainerStyle={styles.content}>
        {CONTROLS.map(c => (
          <Slider
            key={c.key}
            label={c.label}
            min={c.min}
            max={c.max}
            step={c.step}
            value={adj[c.key]}
            onChange={v => setAdj(prev => ({ ...prev, [c.key]: v }))}
            formatValue={v => v.toFixed(2)}
          />
        ))}
        <Pressable onPress={onReset} style={styles.resetBtn}>
          <Text style={styles.resetText}>Reset all</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  content: { padding: Dim.spacing.lg, gap: 16, paddingBottom: 40 },
  resetBtn: { alignSelf: 'center', paddingVertical: 12, paddingHorizontal: 24 },
  resetText: { color: Colors.accent.pink, fontSize: Typography.sizes.base, fontWeight: '700' },
});
