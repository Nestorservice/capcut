import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditorStackParamList } from '@types/navigation.types';
import { ToolHeader } from './_shared/ToolHeader';
import { Slider } from '@components/ui/Slider';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { TRANSITIONS } from '@constants/transitions';
import { useEditorStore } from '@store/editorStore';

type Props = NativeStackScreenProps<EditorStackParamList, 'Transition'>;

export function TransitionScreen({ route, navigation }: Props) {
  const clip = useEditorStore(s => s.clips.find(c => c.id === route.params.clipId) ?? null);
  const updateClip = useEditorStore(s => s.updateClip);
  const [selectedId, setSelectedId] = useState(clip?.transitionToNextId ?? 'none');
  const [duration, setDuration] = useState(clip?.transitionDuration ?? 0.5);

  if (!clip) {
    return (
      <SafeAreaView style={styles.root}>
        <ToolHeader title="Transition" onClose={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const onApply = () => {
    updateClip(clip.id, {
      transitionToNextId: selectedId === 'none' ? undefined : selectedId,
      transitionDuration: duration,
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.root}>
      <ToolHeader title="Transition" onClose={() => navigation.goBack()} onApply={onApply} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {TRANSITIONS.map(t => (
            <Pressable
              key={t.id}
              onPress={() => setSelectedId(t.id)}
              style={[styles.card, selectedId === t.id && styles.cardActive]}
            >
              <View style={styles.iconWrap}>
                <Icon name={t.icon} size={26} color={selectedId === t.id ? '#ffffff' : Colors.text.secondary} />
              </View>
              <Text style={[styles.cardLabel, selectedId === t.id && styles.cardLabelActive]}>{t.name}</Text>
            </Pressable>
          ))}
        </View>
        {selectedId !== 'none' ? (
          <View style={{ marginTop: 20 }}>
            <Slider
              label="Duration"
              value={duration}
              min={0.1}
              max={2}
              step={0.05}
              onChange={setDuration}
              formatValue={v => `${v.toFixed(1)}s`}
            />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  content: { padding: Dim.spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  card: { width: '30%', aspectRatio: 1, backgroundColor: Colors.bg.elevated, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border.light, gap: 6 },
  cardActive: { backgroundColor: Colors.accent.pink, borderColor: Colors.accent.pink },
  iconWrap: { alignItems: 'center', justifyContent: 'center' },
  cardLabel: { color: Colors.text.secondary, fontSize: Typography.sizes.xs, fontWeight: '600' },
  cardLabelActive: { color: '#ffffff' },
});
