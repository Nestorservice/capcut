import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { VideoThumbnail } from './VideoThumbnail';
import { Project } from '@types/project.types';

interface Props {
  project: Project;
  width?: number;
  height?: number;
  onPress?: () => void;
  onMore?: () => void;
}

export function VideoCard({
  project,
  width = Dim.card.projectWidth,
  height = Dim.card.projectHeight,
  onPress,
  onMore,
}: Props) {
  return (
    <View style={{ width }}>
      <Pressable onPress={onPress} style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.97 : 1 }] })}>
        <VideoThumbnail
          uri={project.thumbnail_url}
          width={width}
          height={height}
          duration={project.duration ?? undefined}
        />
      </Pressable>
      <View style={styles.metaRow}>
        <Text style={styles.title} numberOfLines={1}>
          {project.title}
        </Text>
        <Pressable onPress={onMore} hitSlop={8}>
          <Icon name="more-vert" size={18} color={Colors.text.secondary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  title: { flex: 1, color: Colors.text.primary, fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, marginRight: 4 },
});
