import React, { useCallback, useEffect, useRef } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditorStackParamList } from '@types/navigation.types';
import { VideoPreview } from '@components/editor/VideoPreview';
import { Timeline } from '@components/editor/Timeline';
import { ToolBar } from '@components/editor/ToolBar';
import { useEditor } from '@hooks/useEditor';
import { useEditorStore } from '@store/editorStore';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { formatTime } from '@utils/formatTime';
import { projectsService } from '@services/supabase/projects.service';
import { useUIStore } from '@store/uiStore';

type Props = NativeStackScreenProps<EditorStackParamList, 'VideoEditor'>;

const TOOL_TO_ROUTE: Record<string, keyof EditorStackParamList | undefined> = {
  trim: 'TrimTool',
  split: 'SplitTool',
  speed: 'SpeedControl',
  text: 'TextEditor',
  audio: 'AudioMusic',
  voice: 'Voiceover',
  filters: 'Filters',
  adjust: 'Adjust',
  transition: 'Transition',
  overlay: 'Overlay',
  stickers: 'Stickers',
  keyframe: 'Keyframe',
  format: 'Format',
};

export function VideoEditorScreen({ navigation, route }: Props) {
  const editor = useEditor();
  const showToast = useUIStore(s => s.showToast);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;
    if (useEditorStore.getState().projectId === route.params.projectId) return;
    void (async () => {
      try {
        const project = await projectsService.getProject(route.params.projectId);
        if (!project) return;
        const td = project.timeline_data;
        useEditorStore.getState().loadProject(project.id, {
          clips: td?.clips ?? [],
          textOverlays: td?.textOverlays ?? [],
          audioTracks: td?.audioTracks ?? [],
          stickerOverlays: td?.stickerOverlays ?? [],
          totalDuration: td?.totalDuration ?? 0,
        });
      } catch (e) {
        showToast((e as Error).message, 'error');
      }
    })();
  }, [route.params.projectId, showToast]);

  const currentClip = editor.clips.length > 0
    ? editor.clips.find(c => editor.currentTime >= 0) ?? editor.clips[0]
    : null;
  const selectedClip = editor.selectedClipId
    ? editor.clips.find(c => c.id === editor.selectedClipId) ?? null
    : null;

  const onPlayPause = useCallback(() => editor.setPlaying(!editor.isPlaying), [editor]);

  const onTimeUpdate = useCallback(
    (time: number) => editor.setCurrentTime(time),
    [editor],
  );

  const handleToolSelect = useCallback(
    (toolId: string) => {
      editor.setActiveTool(toolId);
      const route2 = TOOL_TO_ROUTE[toolId];
      if (!route2) return;
      const needsClip = ['trim', 'split', 'speed', 'filters', 'adjust'].includes(toolId);
      if (needsClip && !selectedClip) {
        showToast('Select a clip first', 'warning');
        return;
      }
      if (toolId === 'trim' || toolId === 'split' || toolId === 'speed' || toolId === 'filters' || toolId === 'adjust') {
        navigation.navigate(route2 as never, { clipId: selectedClip!.id } as never);
        return;
      }
      if (toolId === 'keyframe') {
        navigation.navigate('Keyframe', {
          targetId: selectedClip?.id ?? editor.clips[0]?.id ?? '',
          targetType: 'clip',
        });
        return;
      }
      navigation.navigate(route2 as never);
    },
    [editor, navigation, selectedClip, showToast],
  );

  const handleExport = useCallback(() => {
    if (editor.clips.length === 0) {
      showToast('Add clips before exporting', 'warning');
      return;
    }
    navigation.navigate('ExportSettings', { projectId: editor.projectId ?? route.params.projectId });
  }, [editor.clips.length, editor.projectId, navigation, route.params.projectId, showToast]);

  const onBack = useCallback(() => {
    if (editor.isDirty) {
      Alert.alert('Unsaved changes', 'Save your changes before exiting?', [
        { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
        { text: 'Save', onPress: async () => { await editor.saveNow(); navigation.goBack(); } },
      ]);
    } else {
      navigation.goBack();
    }
  }, [editor, navigation]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable onPress={onBack} hitSlop={10}>
          <Icon name="arrow-back" size={24} color="#ffffff" />
        </Pressable>
        <View style={styles.topRight}>
          <Pressable style={styles.resolutionPill} onPress={() => navigation.navigate('ExportSettings', { projectId: editor.projectId ?? route.params.projectId })}>
            <Text style={styles.resolutionText}>{editor.exportSettings.resolution.toUpperCase()}</Text>
            <Icon name="arrow-drop-down" size={16} color="#ffffff" />
          </Pressable>
          <Pressable onPress={handleExport}>
            <LinearGradient colors={Colors.accent.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.exportBtn}>
              <Text style={styles.exportText}>Export</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      <View style={styles.previewZone}>
        <VideoPreview
          clip={currentClip}
          currentTime={editor.currentTime}
          isPlaying={editor.isPlaying}
          onProgress={onTimeUpdate}
          textOverlays={editor.textOverlays}
          stickerOverlays={editor.stickerOverlays}
        />
        <View style={styles.controlsRow}>
          <View style={styles.undoRow}>
            <Pressable onPress={editor.undo} hitSlop={6}>
              <Icon name="undo" size={20} color={Colors.text.secondary} />
            </Pressable>
            <Pressable onPress={editor.redo} hitSlop={6}>
              <Icon name="redo" size={20} color={Colors.text.secondary} />
            </Pressable>
          </View>
          <View style={styles.timeBadge}>
            <Text style={styles.timeText}>
              {formatTime(editor.currentTime)} / {formatTime(editor.totalDuration)}
            </Text>
          </View>
          <Pressable onPress={onPlayPause} hitSlop={10} style={styles.playBtn}>
            <Icon name={editor.isPlaying ? 'pause' : 'play-arrow'} size={28} color="#ffffff" />
          </Pressable>
        </View>
      </View>

      <View style={styles.timelineZone}>
        <Timeline />
      </View>

      <ToolBar activeToolId={editor.activeToolId} onSelectTool={handleToolSelect} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  topBar: {
    height: 48,
    paddingHorizontal: Dim.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resolutionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface.containerHigh,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 2,
  },
  resolutionText: { color: '#ffffff', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  exportBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8 },
  exportText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  previewZone: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  controlsRow: {
    position: 'absolute',
    bottom: 12,
    left: Dim.spacing.lg,
    right: Dim.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  undoRow: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  timeBadge: { backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  timeText: { color: '#ffffff', fontSize: 12, fontVariant: ['tabular-nums'] },
  playBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)' },
  timelineZone: { height: 180, backgroundColor: Colors.editor.timelineBg, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
});
