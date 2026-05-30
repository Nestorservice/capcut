import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditorStackParamList } from '@types/navigation.types';
import { ToolHeader } from './_shared/ToolHeader';
import { Button } from '@components/ui/Button';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { FRAME_RATES, RESOLUTIONS } from '@constants/index';
import { useEditorStore } from '@store/editorStore';
import { ExportSettings } from '@types/editor.types';

type Props = NativeStackScreenProps<EditorStackParamList, 'ExportSettings'>;

export function ExportSettingsScreen({ route, navigation }: Props) {
  const setExportSettings = useEditorStore(s => s.setExportSettings);
  const current = useEditorStore(s => s.exportSettings);
  const [resolution, setResolution] = useState<ExportSettings['resolution']>(current.resolution);
  const [frameRate, setFrameRate] = useState<ExportSettings['frameRate']>(current.frameRate);

  const onStart = () => {
    setExportSettings({ resolution, frameRate });
    navigation.replace('ExportProgress', { projectId: route.params.projectId });
  };

  return (
    <SafeAreaView style={styles.root}>
      <ToolHeader title="Export" onClose={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.section}>Resolution</Text>
        <View style={styles.row}>
          {RESOLUTIONS.map(r => (
            <Pressable
              key={r.value}
              onPress={() => setResolution(r.value as ExportSettings['resolution'])}
              style={[styles.chip, resolution === r.value && styles.chipActive]}
            >
              <Text style={[styles.chipText, resolution === r.value && styles.chipTextActive]}>{r.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.section}>Frame rate</Text>
        <View style={styles.row}>
          {FRAME_RATES.map(fps => (
            <Pressable
              key={fps}
              onPress={() => setFrameRate(fps)}
              style={[styles.chip, frameRate === fps && styles.chipActive]}
            >
              <Text style={[styles.chipText, frameRate === fps && styles.chipTextActive]}>{fps}fps</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.info}>
          <Text style={styles.infoTitle}>Output format</Text>
          <Text style={styles.infoValue}>MP4 (H.264)</Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button label="Export video" variant="primary" size="lg" fullWidth icon="play-arrow" onPress={onStart} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  content: { padding: Dim.spacing.lg, gap: 16 },
  section: { color: Colors.text.secondary, fontSize: Typography.sizes.sm, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginTop: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 999, backgroundColor: Colors.bg.card, borderWidth: 1, borderColor: Colors.border.light },
  chipActive: { backgroundColor: Colors.accent.pink, borderColor: Colors.accent.pink },
  chipText: { color: Colors.text.primary, fontSize: Typography.sizes.sm, fontWeight: '600' },
  chipTextActive: { color: '#ffffff' },
  info: { backgroundColor: Colors.bg.card, padding: 16, borderRadius: 12 },
  infoTitle: { color: Colors.text.secondary, fontSize: Typography.sizes.xs, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  infoValue: { color: '#ffffff', fontSize: Typography.sizes.base, fontWeight: '700', marginTop: 6 },
  footer: { padding: Dim.spacing.lg, borderTopWidth: 1, borderTopColor: Colors.border.light },
});
