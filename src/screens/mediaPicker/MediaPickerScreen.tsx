import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@types/navigation.types';
import { Button } from '@components/ui/Button';
import { MediaGrid } from '@components/media/MediaGrid';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { MediaAsset } from '@types/media.types';
import { uuid } from '@utils/index';
import { usePermissions } from '@hooks/usePermissions';
import { useProjects } from '@hooks/useProjects';
import { useEditorStore } from '@store/editorStore';
import { Clip, DEFAULT_FILTER_DATA, DEFAULT_TRANSFORM } from '@types/editor.types';
import { ffmpegService } from '@services/ffmpeg/ffmpeg.service';
import { useUIStore } from '@store/uiStore';

type Props = NativeStackScreenProps<MainStackParamList, 'MediaPicker'>;

export function MediaPickerScreen({ route, navigation }: Props) {
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [tab, setTab] = useState<'video' | 'photo'>('video');
  const { ensureMediaAccess } = usePermissions();
  const { createProject, isCreating } = useProjects();
  const showToast = useUIStore(s => s.showToast);
  const showLoading = useUIStore(s => s.showLoading);
  const hideLoading = useUIStore(s => s.hideLoading);

  const loadMedia = useCallback(async () => {
    const granted = await ensureMediaAccess();
    if (!granted) {
      showToast('Media access denied', 'error');
      return;
    }
    const result = await launchImageLibrary({
      mediaType: tab,
      selectionLimit: 0,
      includeBase64: false,
      includeExtra: true,
    });
    if (result.didCancel) return;
    if (result.errorMessage) {
      showToast(result.errorMessage, 'error');
      return;
    }
    const assets: MediaAsset[] = (result.assets ?? []).map((a: Asset) => ({
      id: a.uri ?? uuid(),
      uri: a.uri ?? '',
      type: tab === 'video' ? 'video' : 'image',
      duration: a.duration,
      width: a.width,
      height: a.height,
      size: a.fileSize,
      mimeType: a.type,
      thumbnailUri: a.uri,
      fileName: a.fileName ?? undefined,
    }));
    setItems(assets);
  }, [ensureMediaAccess, showToast, tab]);

  useEffect(() => {
    void loadMedia();
  }, [loadMedia]);

  const toggleSelect = (item: MediaAsset) => {
    setSelectedIds(prev =>
      prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id],
    );
  };

  const handleContinue = useCallback(async () => {
    if (selectedIds.length === 0) {
      showToast('Select at least one clip', 'warning');
      return;
    }
    const selectedAssets = items.filter(it => selectedIds.includes(it.id));
    try {
      showLoading('Preparing project...');
      let projectId = route.params.projectId;
      if (route.params.mode === 'new') {
        const newProject = await createProject({ title: 'Untitled Project' });
        projectId = newProject.id;
      }
      if (!projectId) throw new Error('No project id');

      const clips: Clip[] = [];
      for (let i = 0; i < selectedAssets.length; i++) {
        const a = selectedAssets[i];
        let duration = a.duration ?? 0;
        let width = a.width ?? 1080;
        let height = a.height ?? 1920;
        if (a.type === 'video' && (!duration || !width)) {
          try {
            const info = await ffmpegService.getVideoInfo(a.uri);
            duration = info.duration;
            width = info.width;
            height = info.height;
          } catch {
            duration = duration || 5;
          }
        } else if (a.type === 'image') {
          duration = 3;
        }
        clips.push({
          id: uuid(),
          sourceUri: a.uri,
          thumbnailUri: a.thumbnailUri,
          startTime: 0,
          endTime: duration,
          duration,
          trimStart: 0,
          trimEnd: duration,
          position: i,
          speed: 1,
          volume: 1,
          isMuted: false,
          transform: { ...DEFAULT_TRANSFORM },
          filter: { ...DEFAULT_FILTER_DATA },
          keyframes: [],
        });
      }

      useEditorStore.getState().loadProject(projectId, {
        clips,
        textOverlays: [],
        audioTracks: [],
        stickerOverlays: [],
        totalDuration: clips.reduce((sum, c) => sum + (c.trimEnd - c.trimStart) / c.speed, 0),
      });
      hideLoading();
      navigation.replace('Editor', { screen: 'VideoEditor', params: { projectId } });
    } catch (e) {
      hideLoading();
      showToast((e as Error).message, 'error');
    }
  }, [createProject, hideLoading, items, navigation, route.params.mode, route.params.projectId, selectedIds, showLoading, showToast]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Icon name="close" size={26} color="#ffffff" />
        </Pressable>
        <Text style={styles.title}>{selectedIds.length === 0 ? 'Select Media' : `${selectedIds.length} selected`}</Text>
        <View style={{ width: 26 }} />
      </View>
      <View style={styles.tabs}>
        {(['video', 'photo'] as const).map(t => (
          <Pressable
            key={t}
            onPress={() => {
              setTab(t);
              setSelectedIds([]);
            }}
            style={[styles.tab, tab === t && styles.tabActive]}
          >
            <Text style={[styles.tabLabel, tab === t && styles.tabLabelActive]}>{t === 'video' ? 'Videos' : 'Photos'}</Text>
          </Pressable>
        ))}
      </View>
      <MediaGrid items={items} onSelect={toggleSelect} selectedIds={selectedIds} columns={3} />
      <View style={styles.footer}>
        <Button
          label={`Continue ${selectedIds.length > 0 ? `(${selectedIds.length})` : ''}`}
          variant="primary"
          size="lg"
          fullWidth
          loading={isCreating}
          disabled={selectedIds.length === 0}
          onPress={handleContinue}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Dim.spacing.lg,
    height: 56,
  },
  title: { color: '#ffffff', fontSize: Typography.sizes.lg, fontWeight: '700' },
  tabs: { flexDirection: 'row', paddingHorizontal: Dim.spacing.lg, gap: 8, marginBottom: 8 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, backgroundColor: Colors.bg.card },
  tabActive: { backgroundColor: Colors.accent.pink },
  tabLabel: { color: Colors.text.secondary, fontSize: Typography.sizes.sm, fontWeight: '600' },
  tabLabelActive: { color: '#ffffff' },
  footer: {
    padding: Dim.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    backgroundColor: '#000000',
  },
});
