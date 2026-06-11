import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditorStackParamList } from '@types/navigation.types';
import { ToolHeader } from './_shared/ToolHeader';
import { Button } from '@components/ui/Button';
import { Slider } from '@components/ui/Slider';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { useEditorStore } from '@store/editorStore';
import { formatTime } from '@utils/formatTime';
import { useUIStore } from '@store/uiStore';

type Props = NativeStackScreenProps<EditorStackParamList, 'SplitTool'>;

export function SplitToolScreen({ route, navigation }: Props) {
  const clipId = route.params?.clipId;
  const clip = useEditorStore(s => s.clips.find(c => c.id === clipId) ?? null);
  const splitClip = useEditorStore(s => s.splitClip);
  const showToast = useUIStore(s => s.showToast);
  const [splitAt, setSplitAt] = useState(clip ? (clip.trimStart + clip.trimEnd) / 2 : 0);

  if (!clip) {
    return (
      <SafeAreaView style={styles.root}>
        <ToolHeader title="Split" onClose={() => navigation.goBack()} />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Clip not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const onSplit = () => {
    splitClip(clip.id, splitAt);
    showToast('Clip split', 'success');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.root}>
      <ToolHeader title="Split" onClose={() => navigation.goBack()} />
      <View style={styles.content}>
        <View style={styles.heroBox}>
          <Text style={styles.heroValue}>{formatTime(splitAt, true)}</Text>
          <Text style={styles.heroLabel}>Split point</Text>
        </View>
        <Slider
          label="Position"
          value={splitAt}
          min={clip.trimStart + 0.1}
          max={clip.trimEnd - 0.1}
          step={0.1}
          formatValue={v => formatTime(v, true)}
          onChange={setSplitAt}
        />
        <View style={styles.preview}>
          <View style={[styles.previewClip, { flex: splitAt - clip.trimStart }]}>
            <Text style={styles.previewText}>Part 1</Text>
          </View>
          <View style={styles.cutLine} />
          <View style={[styles.previewClip, { flex: clip.trimEnd - splitAt }]}>
            <Text style={styles.previewText}>Part 2</Text>
          </View>
        </View>
        <Button label="Split clip" variant="primary" size="lg" fullWidth onPress={onSplit} icon="call-split" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: Colors.text.secondary },
  content: { padding: Dim.spacing.lg, gap: 24 },
  heroBox: { alignItems: 'center', padding: 24, backgroundColor: Colors.bg.elevated, borderRadius: 16, borderWidth: 1, borderColor: Colors.border.light },
  heroValue: { color: '#ffffff', fontSize: 40, fontWeight: '800' },
  heroLabel: { color: Colors.text.secondary, fontSize: Typography.sizes.sm, marginTop: 4 },
  preview: { flexDirection: 'row', height: 60, gap: 4 },
  previewClip: { backgroundColor: Colors.surface.containerHigh, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  previewText: { color: Colors.text.secondary, fontSize: Typography.sizes.sm },
  cutLine: { width: 2, backgroundColor: Colors.accent.pink, borderRadius: 1 },
});
