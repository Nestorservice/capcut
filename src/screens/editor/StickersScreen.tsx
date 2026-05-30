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
import { StickerOverlay } from '@types/editor.types';
import { uuid } from '@utils/index';

type Props = NativeStackScreenProps<EditorStackParamList, 'Stickers'>;

const STICKERS = [
  { id: 's1', icon: 'favorite', color: '#ff4081' },
  { id: 's2', icon: 'star', color: '#ffeb3b' },
  { id: 's3', icon: 'celebration', color: '#9c27b0' },
  { id: 's4', icon: 'whatshot', color: '#ff5722' },
  { id: 's5', icon: 'sentiment-very-satisfied', color: '#ffd600' },
  { id: 's6', icon: 'bolt', color: '#ffc107' },
  { id: 's7', icon: 'auto-awesome', color: '#9c27b0' },
  { id: 's8', icon: 'verified', color: '#03a9f4' },
  { id: 's9', icon: 'thumb-up', color: '#03a9f4' },
  { id: 's10', icon: 'visibility', color: '#03a9f4' },
  { id: 's11', icon: 'rocket-launch', color: '#ff5722' },
  { id: 's12', icon: 'volume-up', color: '#4caf50' },
];

export function StickersScreen({ navigation }: Props) {
  const currentTime = useEditorStore(s => s.currentTime);
  const totalDuration = useEditorStore(s => s.totalDuration);
  const addSticker = useEditorStore(s => s.addStickerOverlay);

  const onPick = (sticker: typeof STICKERS[0]) => {
    const overlay: StickerOverlay = {
      id: uuid(),
      stickerId: sticker.id,
      stickerUrl: `material:${sticker.icon}`,
      positionX: 0.5,
      positionY: 0.5,
      scale: 1,
      rotation: 0,
      startTime: currentTime,
      endTime: Math.min(totalDuration, currentTime + 3),
      keyframes: [],
    };
    addSticker(overlay);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.root}>
      <ToolHeader title="Stickers" onClose={() => navigation.goBack()} />
      <FlatList
        data={STICKERS}
        keyExtractor={s => s.id}
        numColumns={4}
        contentContainerStyle={styles.list}
        columnWrapperStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <Pressable style={styles.cell} onPress={() => onPick(item)}>
            <View style={[styles.bg, { backgroundColor: `${item.color}33` }]}>
              <Icon name={item.icon} size={36} color={item.color} />
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  list: { padding: Dim.spacing.lg, gap: 12 },
  cell: { flex: 1, aspectRatio: 1, padding: 4 },
  bg: { flex: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
