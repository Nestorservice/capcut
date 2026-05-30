import React, { useCallback, useState } from 'react';
import { Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Avatar } from '@components/ui/Avatar';
import { IconButton } from '@components/ui/IconButton';
import { TabBar } from '@components/ui/TabBar';
import { VideoCard } from '@components/media/VideoCard';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { useAuth } from '@hooks/useAuth';
import { useProjects } from '@hooks/useProjects';
import { MainStackParamList } from '@types/navigation.types';
import { EmptyState } from '@components/ui/EmptyState';

type Nav = NativeStackNavigationProp<MainStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { profile } = useAuth();
  const { recentProjects, refresh, isLoading } = useProjects();
  const [tab, setTab] = useState<'foryou' | 'following'>('foryou');

  const openMediaPicker = useCallback(() => {
    navigation.navigate('MediaPicker', { mode: 'new' });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Image source={require('@assets/images/logo.png')} style={styles.brandLogo} resizeMode="contain" />
          <Text style={styles.brand}>CapCut</Text>
        </View>
        <View style={styles.headerRight}>
          <IconButton icon="notifications" onPress={() => navigation.navigate('Notifications')} />
          <Pressable onPress={() => navigation.navigate('Profile', { userId: profile?.id })}>
            <Avatar uri={profile?.avatar_url} name={profile?.display_name ?? profile?.username} size={32} />
          </Pressable>
        </View>
      </View>

      <TabBar
        tabs={[
          { id: 'foryou', label: 'For You' },
          { id: 'following', label: 'Following' },
        ]}
        activeId={tab}
        onChange={id => setTab(id as 'foryou' | 'following')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={Colors.accent.pink} />}
      >
        <LinearGradient
          colors={Colors.accent.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroInfo}>
            <Text style={styles.heroBadge}>EXCLUSIVE</Text>
            <Text style={styles.heroTitle}>New Feature: AI Background Remover</Text>
          </View>
          <View style={styles.heroArrow}>
            <Icon name="arrow-forward" size={20} color="#ffffff" />
          </View>
        </LinearGradient>

        <Pressable style={styles.newProject} onPress={openMediaPicker}>
          <LinearGradient
            colors={Colors.accent.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.newProjectIcon}
          >
            <Icon name="add" size={28} color="#ffffff" />
          </LinearGradient>
          <View>
            <Text style={styles.newProjectTitle}>New project</Text>
            <Text style={styles.newProjectSubtitle}>Start from scratch</Text>
          </View>
        </Pressable>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Projects</Text>
          <Pressable onPress={() => navigation.navigate('Tabs', { screen: 'Projects' })}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>

        {recentProjects.length === 0 ? (
          <EmptyState
            icon="movie-creation"
            title="No projects yet"
            description="Tap New project to start editing."
            actionLabel="Create Project"
            onAction={openMediaPicker}
          />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow}>
            {recentProjects.map(p => (
              <VideoCard
                key={p.id}
                project={p}
                onPress={() => navigation.navigate('Editor', { screen: 'VideoEditor', params: { projectId: p.id } })}
              />
            ))}
          </ScrollView>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Templates</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow}>
          {[
            { id: 't1', name: 'Cinematic Travel', gradient: ['#667eea', '#764ba2'] as const },
            { id: 't2', name: 'Retro Glitch', gradient: ['#f093fb', '#f5576c'] as const },
            { id: 't3', name: 'Vlog Diary', gradient: ['#4facfe', '#00f2fe'] as const },
          ].map(t => (
            <View key={t.id} style={styles.template}>
              <LinearGradient colors={t.gradient as unknown as string[]} style={StyleSheet.absoluteFillObject} />
              <View style={styles.templateOverlay}>
                <Text style={styles.templateLabel}>{t.name}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
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
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandLogo: { width: 28, height: 28 },
  brand: { color: '#ffffff', fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  content: { paddingBottom: 80 },
  hero: {
    marginHorizontal: Dim.spacing.lg,
    marginTop: Dim.spacing.md,
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 128,
  },
  heroInfo: { flex: 1 },
  heroBadge: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  heroTitle: { color: '#ffffff', fontSize: 20, fontWeight: '700', lineHeight: 26, maxWidth: 220 },
  heroArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newProject: {
    marginHorizontal: Dim.spacing.lg,
    marginTop: Dim.spacing.lg,
    padding: 16,
    backgroundColor: Colors.bg.elevated,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  newProjectIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  newProjectTitle: { color: '#ffffff', fontSize: 18, fontWeight: '700' },
  newProjectSubtitle: { color: Colors.text.secondary, fontSize: Typography.sizes.sm, marginTop: 2 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Dim.spacing.lg,
    marginTop: Dim.spacing.xxl,
    marginBottom: Dim.spacing.md,
  },
  sectionTitle: { color: '#ffffff', fontSize: 18, fontWeight: '700' },
  seeAll: { color: Colors.accent.pink, fontSize: Typography.sizes.sm, fontWeight: '600' },
  cardRow: { paddingHorizontal: Dim.spacing.lg, gap: 12 },
  template: { width: 200, height: 120, borderRadius: 16, overflow: 'hidden', marginRight: 12 },
  templateOverlay: { ...StyleSheet.absoluteFillObject, padding: 12, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.25)' },
  templateLabel: { color: '#ffffff', fontWeight: '700' },
});
