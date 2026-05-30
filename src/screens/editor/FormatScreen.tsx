import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditorStackParamList } from '@types/navigation.types';
import { ToolHeader } from './_shared/ToolHeader';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { ASPECT_RATIOS } from '@constants/index';
import { useEditorStore } from '@store/editorStore';

type Props = NativeStackScreenProps<EditorStackParamList, 'Format'>;

export function FormatScreen({ navigation }: Props) {
  const setExportSettings = useEditorStore(s => s.setExportSettings);
  const currentRatio = useEditorStore(s => s.exportSettings.aspectRatio);
  const [ratio, setRatio] = useState(currentRatio);

  const onApply = () => {
    setExportSettings({ aspectRatio: ratio });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.root}>
      <ToolHeader title="Format" onClose={() => navigation.goBack()} onApply={onApply} />
      <View style={styles.content}>
        <Text style={styles.section}>Aspect ratio</Text>
        <View style={styles.grid}>
          {ASPECT_RATIOS.map(a => {
            const aspect = a.width / a.height;
            const isPortrait = aspect <= 1;
            const w = isPortrait ? 60 : 90;
            const h = isPortrait ? 90 : 60;
            const selected = ratio === a.value;
            return (
              <Pressable key={a.value} onPress={() => setRatio(a.value)} style={styles.card}>
                <View style={[styles.aspect, { width: w, height: h }, selected && styles.aspectActive]} />
                <Text style={[styles.label, selected && styles.labelActive]}>{a.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  content: { padding: Dim.spacing.lg, gap: 16 },
  section: { color: Colors.text.secondary, fontSize: Typography.sizes.sm, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  card: { alignItems: 'center', gap: 8, padding: 12, width: 110 },
  aspect: { borderRadius: 6, borderWidth: 2, borderColor: Colors.border.medium },
  aspectActive: { borderColor: Colors.accent.pink },
  label: { color: Colors.text.secondary, fontSize: Typography.sizes.sm, fontWeight: '600' },
  labelActive: { color: Colors.accent.pink },
});
