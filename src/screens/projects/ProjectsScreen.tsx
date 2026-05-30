import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View, Text, Pressable, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProjects } from '@hooks/useProjects';
import { VideoCard } from '@components/media/VideoCard';
import { EmptyState } from '@components/ui/EmptyState';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { MainStackParamList } from '@types/navigation.types';

type Nav = NativeStackNavigationProp<MainStackParamList>;

const SCREEN_W = Dimensions.get('window').width;

export function ProjectsScreen() {
  const navigation = useNavigation<Nav>();
  const { projects, isLoading, refresh, deleteProject } = useProjects();
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const columns = view === 'grid' ? 2 : 1;
  const cardWidth = view === 'grid' ? (SCREEN_W - Dim.spacing.lg * 2 - Dim.spacing.md) / 2 : SCREEN_W - Dim.spacing.lg * 2;
  const cardHeight = view === 'grid' ? cardWidth * 1.33 : 200;

  const confirmDelete = (projectId: string, title: string) => {
    Alert.alert('Delete Project', `Delete "${title}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteProject(projectId),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Projects</Text>
        <View style={styles.headerActions}>
          <Pressable hitSlop={8} onPress={() => setView(v => (v === 'grid' ? 'list' : 'grid'))}>
            <Icon name={view === 'grid' ? 'view-list' : 'grid-view'} size={24} color="#ffffff" />
          </Pressable>
        </View>
      </View>

      {projects.length === 0 && !isLoading ? (
        <EmptyState
          icon="folder-open"
          title="No projects"
          description="Create your first project to start editing."
          actionLabel="Create Project"
          onAction={() => navigation.navigate('MediaPicker', { mode: 'new' })}
        />
      ) : (
        <FlatList
          key={view}
          data={projects}
          keyExtractor={p => p.id}
          numColumns={columns}
          contentContainerStyle={styles.list}
          columnWrapperStyle={view === 'grid' ? styles.row : undefined}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={Colors.accent.pink} />}
          renderItem={({ item }) => (
            <View style={{ marginBottom: Dim.spacing.lg, width: cardWidth }}>
              <VideoCard
                project={item}
                width={cardWidth}
                height={cardHeight}
                onPress={() => navigation.navigate('Editor', { screen: 'VideoEditor', params: { projectId: item.id } })}
                onMore={() => confirmDelete(item.id, item.title)}
              />
            </View>
          )}
        />
      )}
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
  title: { color: '#ffffff', fontSize: Typography.sizes.xxl, fontWeight: '800' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  list: { padding: Dim.spacing.lg, paddingBottom: 100 },
  row: { gap: Dim.spacing.md, justifyContent: 'space-between' },
});
