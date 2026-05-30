import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditorStackParamList } from '@types/navigation.types';
import { ToolHeader } from './_shared/ToolHeader';
import { Slider } from '@components/ui/Slider';
import { FilterPreview } from '@components/effects/FilterPreview';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { FILTERS } from '@constants/filters';
import { useEditorStore } from '@store/editorStore';

type Props = NativeStackScreenProps<EditorStackParamList, 'Filters'>;

export function FiltersScreen({ route, navigation }: Props) {
  const clip = useEditorStore(s => s.clips.find(c => c.id === route.params.clipId) ?? null);
  const updateClip = useEditorStore(s => s.updateClip);
  const [selectedFilterId, setSelectedFilterId] = useState(clip?.filter.filterId ?? 'none');
  const [intensity, setIntensity] = useState(clip?.filter.intensity ?? 1);

  if (!clip) {
    return (
      <SafeAreaView style={styles.root}>
        <ToolHeader title="Filters" onClose={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const onApply = () => {
    updateClip(clip.id, {
      filter: { ...clip.filter, filterId: selectedFilterId, intensity },
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.root}>
      <ToolHeader title="Filters" onClose={() => navigation.goBack()} onApply={onApply} />
      <View style={styles.content}>
        <Text style={styles.section}>Style</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTERS.map(f => (
            <FilterPreview
              key={f.id}
              filter={f}
              previewUri={clip.thumbnailUri ?? undefined}
              selected={f.id === selectedFilterId}
              onPress={() => setSelectedFilterId(f.id)}
            />
          ))}
        </ScrollView>
        {selectedFilterId !== 'none' ? (
          <Slider
            label="Intensity"
            value={intensity}
            min={0}
            max={1}
            step={0.05}
            onChange={setIntensity}
            formatValue={v => `${Math.round(v * 100)}%`}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  content: { padding: Dim.spacing.lg, gap: 16 },
  section: { color: Colors.text.secondary, fontSize: Typography.sizes.sm, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  filterRow: { paddingVertical: 8 },
});
