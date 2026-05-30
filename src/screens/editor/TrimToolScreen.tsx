import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditorStackParamList } from '@types/navigation.types';
import { ToolHeader } from './_shared/ToolHeader';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { Slider } from '@components/ui/Slider';
import { useTrimmer } from '@hooks/useTrimmer';
import { formatTime } from '@utils/formatTime';

type Props = NativeStackScreenProps<EditorStackParamList, 'TrimTool'>;

export function TrimToolScreen({ route, navigation }: Props) {
  const { clip, thumbnails, loadThumbnails, applyTrim } = useTrimmer(route.params.clipId);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);

  useEffect(() => {
    if (clip) {
      setTrimStart(clip.trimStart);
      setTrimEnd(clip.trimEnd);
      void loadThumbnails();
    }
  }, [clip, loadThumbnails]);

  if (!clip) {
    return (
      <SafeAreaView style={styles.root}>
        <ToolHeader title="Trim" onClose={() => navigation.goBack()} />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Clip not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const onApply = () => {
    applyTrim(trimStart, trimEnd);
    navigation.goBack();
  };

  const duration = trimEnd - trimStart;

  return (
    <SafeAreaView style={styles.root}>
      <ToolHeader title="Trim" onClose={() => navigation.goBack()} onApply={onApply} />
      <View style={styles.previewArea}>
        <View style={styles.previewBox}>
          <Text style={styles.duration}>{formatTime(duration, true)}</Text>
          <Text style={styles.totalDuration}>of {formatTime(clip.duration, true)}</Text>
        </View>
      </View>

      <View style={styles.thumbnailStrip}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnailRow}>
          {thumbnails.map((uri, i) => (
            <Image key={i} source={{ uri: `file://${uri}` }} style={styles.thumbnail} />
          ))}
        </ScrollView>
        <View style={[styles.trimHandle, styles.trimHandleLeft, { left: `${(trimStart / clip.duration) * 100}%` }]} />
        <View style={[styles.trimHandle, styles.trimHandleRight, { left: `${(trimEnd / clip.duration) * 100}%` }]} />
      </View>

      <View style={styles.sliderArea}>
        <Slider
          label="Start"
          value={trimStart}
          min={0}
          max={clip.duration - 0.3}
          step={0.1}
          formatValue={v => formatTime(v, true)}
          onChange={setTrimStart}
        />
        <Slider
          label="End"
          value={trimEnd}
          min={trimStart + 0.3}
          max={clip.duration}
          step={0.1}
          formatValue={v => formatTime(v, true)}
          onChange={setTrimEnd}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: Colors.text.secondary, fontSize: Typography.sizes.base },
  previewArea: { padding: Dim.spacing.xl, alignItems: 'center' },
  previewBox: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: Colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  duration: { color: '#ffffff', fontSize: 32, fontWeight: '800' },
  totalDuration: { color: Colors.text.secondary, fontSize: Typography.sizes.sm, marginTop: 6 },
  thumbnailStrip: { height: 80, marginHorizontal: Dim.spacing.lg, position: 'relative', borderRadius: Dim.radius.md, overflow: 'hidden', backgroundColor: Colors.bg.card },
  thumbnailRow: { flexDirection: 'row' },
  thumbnail: { width: 50, height: 80 },
  trimHandle: { position: 'absolute', top: 0, bottom: 0, width: 4, backgroundColor: Colors.editor.trimHandle },
  trimHandleLeft: { transform: [{ translateX: -2 }] },
  trimHandleRight: { transform: [{ translateX: -2 }] },
  sliderArea: { padding: Dim.spacing.lg, gap: 16 },
});
