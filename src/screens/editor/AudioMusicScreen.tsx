import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditorStackParamList } from '@types/navigation.types';
import { ToolHeader } from './_shared/ToolHeader';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { useEditorStore } from '@store/editorStore';
import { AudioTrack } from '@types/editor.types';
import { uuid } from '@utils/index';
import { formatTime } from '@utils/formatTime';

type Props = NativeStackScreenProps<EditorStackParamList, 'AudioMusic'>;

const PRESET_TRACKS = [
  { id: 'm1', title: 'Upbeat Pop', artist: 'CapCut Library', duration: 45, category: 'Pop' },
  { id: 'm2', title: 'Cinematic Drama', artist: 'CapCut Library', duration: 60, category: 'Cinematic' },
  { id: 'm3', title: 'Lo-Fi Vibes', artist: 'CapCut Library', duration: 90, category: 'Chill' },
  { id: 'm4', title: 'Epic Trailer', artist: 'CapCut Library', duration: 75, category: 'Cinematic' },
  { id: 'm5', title: 'Vlog Beats', artist: 'CapCut Library', duration: 50, category: 'Pop' },
];

export function AudioMusicScreen({ navigation }: Props) {
  const tracks = useEditorStore(s => s.audioTracks);
  const addAudio = useEditorStore(s => s.addAudioTrack);
  const removeAudio = useEditorStore(s => s.removeAudioTrack);

  const onAddPreset = (preset: typeof PRESET_TRACKS[0]) => {
    const track: AudioTrack = {
      id: uuid(),
      uri: `https://example.com/audio/${preset.id}.mp3`,
      title: preset.title,
      artist: preset.artist,
      duration: preset.duration,
      startTime: 0,
      offset: 0,
      volume: 1,
      isMuted: false,
      trackType: 'music',
      fadeIn: 0,
      fadeOut: 0,
    };
    addAudio(track);
  };

  return (
    <SafeAreaView style={styles.root}>
      <ToolHeader title="Music" onClose={() => navigation.goBack()} onApply={() => navigation.goBack()} />
      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={() => navigation.navigate('Voiceover')}>
          <Icon name="mic" size={22} color={Colors.accent.pink} />
          <Text style={styles.actionLabel}>Record Voiceover</Text>
        </Pressable>
      </View>
      {tracks.length > 0 ? (
        <View style={styles.added}>
          <Text style={styles.sectionTitle}>Added</Text>
          {tracks.map(t => (
            <View key={t.id} style={styles.trackRow}>
              <View style={styles.musicIcon}>
                <Icon name="music-note" size={20} color="#ffffff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.trackTitle}>{t.title ?? 'Audio'}</Text>
                <Text style={styles.trackMeta}>{formatTime(t.duration)} · {t.trackType}</Text>
              </View>
              <Pressable hitSlop={8} onPress={() => removeAudio(t.id)}>
                <Icon name="delete" size={20} color={Colors.status.error} />
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
      <Text style={[styles.sectionTitle, { paddingHorizontal: Dim.spacing.lg }]}>Library</Text>
      <FlatList
        data={PRESET_TRACKS}
        keyExtractor={p => p.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable style={styles.libraryRow} onPress={() => onAddPreset(item)}>
            <View style={styles.musicIcon}>
              <Icon name="music-note" size={20} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.trackTitle}>{item.title}</Text>
              <Text style={styles.trackMeta}>{item.artist} · {formatTime(item.duration)}</Text>
            </View>
            <Icon name="add-circle" size={22} color={Colors.accent.pink} />
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  actions: { flexDirection: 'row', padding: Dim.spacing.lg, gap: 8 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: Colors.bg.card, borderRadius: 8 },
  actionLabel: { color: Colors.text.primary, fontSize: Typography.sizes.sm, fontWeight: '600' },
  added: { paddingHorizontal: Dim.spacing.lg, paddingBottom: Dim.spacing.lg },
  sectionTitle: { color: Colors.text.secondary, fontSize: Typography.sizes.sm, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontWeight: '700' },
  trackRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border.light },
  list: { padding: Dim.spacing.lg, paddingBottom: 100, gap: 8 },
  libraryRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: Colors.bg.card, borderRadius: 8 },
  musicIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.accent.pink, alignItems: 'center', justifyContent: 'center' },
  trackTitle: { color: '#ffffff', fontSize: Typography.sizes.base, fontWeight: '700' },
  trackMeta: { color: Colors.text.secondary, fontSize: Typography.sizes.sm, marginTop: 2 },
});
