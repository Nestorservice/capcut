import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, View, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@constants/colors';
import { Dim } from '@constants/dimensions';
import { MediaAsset } from '@types/media.types';
import { Typography } from '@constants/typography';
import { Text } from 'react-native';
import { formatTime } from '@utils/formatTime';

interface Props {
  items: MediaAsset[];
  onSelect: (item: MediaAsset) => void;
  selectedIds?: string[];
  columns?: number;
}

const SCREEN_W = Dimensions.get('window').width;

export function MediaGrid({ items, onSelect, selectedIds = [], columns = 3 }: Props) {
  const gap = 4;
  const itemSize = (SCREEN_W - Dim.spacing.lg * 2 - gap * (columns - 1)) / columns;

  return (
    <FlatList
      data={items}
      numColumns={columns}
      keyExtractor={item => item.id}
      contentContainerStyle={{ padding: Dim.spacing.lg, gap }}
      columnWrapperStyle={{ gap }}
      renderItem={({ item }) => {
        const selected = selectedIds.includes(item.id);
        return (
          <Pressable onPress={() => onSelect(item)} style={{ width: itemSize, height: itemSize }}>
            <View style={[styles.tile, selected && styles.selected]}>
              <Image source={{ uri: item.thumbnailUri ?? item.uri }} style={styles.image} resizeMode="cover" />
              {item.type === 'video' ? (
                <View style={styles.videoTag}>
                  <Icon name="play-circle-fill" size={14} color="#ffffff" />
                  {item.duration ? <Text style={styles.duration}>{formatTime(item.duration)}</Text> : null}
                </View>
              ) : null}
              {selected ? (
                <View style={styles.checkOverlay}>
                  <Icon name="check-circle" size={20} color={Colors.accent.pink} />
                </View>
              ) : null}
            </View>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, borderRadius: Dim.radius.sm, overflow: 'hidden', backgroundColor: Colors.bg.card },
  selected: { borderWidth: 2, borderColor: Colors.accent.pink },
  image: { width: '100%', height: '100%' },
  videoTag: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
  },
  duration: { color: '#ffffff', fontSize: Typography.sizes.xs, fontWeight: Typography.weights.semibold },
  checkOverlay: { position: 'absolute', top: 4, right: 4 },
});
