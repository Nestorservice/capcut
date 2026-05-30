import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditorStackParamList } from '@types/navigation.types';
import { ToolHeader } from './_shared/ToolHeader';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { useEditorStore } from '@store/editorStore';
import { Clip, DEFAULT_FILTER_DATA, DEFAULT_TRANSFORM } from '@types/editor.types';
import { uuid } from '@utils/index';
import { usePermissions } from '@hooks/usePermissions';

type Props = NativeStackScreenProps<EditorStackParamList, 'Overlay'>;

export function OverlayScreen({ navigation }: Props) {
  const addClip = useEditorStore(s => s.addClip);
  const { ensureMediaAccess } = usePermissions();

  const pickOverlay = async () => {
    const granted = await ensureMediaAccess();
    if (!granted) return;
    const result = await launchImageLibrary({ mediaType: 'video', selectionLimit: 1 });
    if (result.didCancel || !result.assets?.[0]) return;
    const asset = result.assets[0];
    const duration = asset.duration ?? 5;
    const overlayClip: Clip = {
      id: uuid(),
      sourceUri: asset.uri ?? '',
      thumbnailUri: asset.uri,
      startTime: 0,
      endTime: duration,
      duration,
      trimStart: 0,
      trimEnd: duration,
      position: 999,
      speed: 1,
      volume: 0,
      isMuted: true,
      transform: { ...DEFAULT_TRANSFORM, scale: 0.5 },
      filter: { ...DEFAULT_FILTER_DATA },
      keyframes: [],
    };
    addClip(overlayClip);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.root}>
      <ToolHeader title="Overlay" onClose={() => navigation.goBack()} />
      <View style={styles.content}>
        <Pressable style={styles.bigBtn} onPress={pickOverlay}>
          <Icon name="add-photo-alternate" size={36} color={Colors.accent.pink} />
          <Text style={styles.bigBtnLabel}>Pick from gallery</Text>
          <Text style={styles.bigBtnHint}>Add a video as a picture-in-picture overlay</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  content: { padding: Dim.spacing.lg, gap: 16 },
  bigBtn: { padding: 24, backgroundColor: Colors.bg.card, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: Colors.border.light, gap: 8 },
  bigBtnLabel: { color: '#ffffff', fontSize: Typography.sizes.lg, fontWeight: '700' },
  bigBtnHint: { color: Colors.text.secondary, fontSize: Typography.sizes.sm, textAlign: 'center' },
});
