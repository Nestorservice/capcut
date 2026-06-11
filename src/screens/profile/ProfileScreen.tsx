import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Avatar } from '@components/ui/Avatar';
import { Button } from '@components/ui/Button';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { useAuth } from '@hooks/useAuth';
import { useProjects } from '@hooks/useProjects';
import { MainStackParamList } from '@types/navigation.types';
import { VideoThumbnail } from '@components/media/VideoThumbnail';
import { formatFileSize } from '@utils/formatFileSize';

type Nav = NativeStackNavigationProp<MainStackParamList>;

const SCREEN_W = Dimensions.get('window').width;

export function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { profile } = useAuth();
  const { projects } = useProjects();

  const totalDuration = projects.reduce((sum, p) => sum + (p.duration ?? 0), 0);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Me</Text>
        <Pressable hitSlop={8} onPress={() => navigation.navigate('Settings')}>
          <Icon name="settings" size={26} color="#ffffff" />
        </Pressable>
      </View>

      <View style={styles.profileBlock}>
        <Avatar uri={profile?.avatar_url} name={profile?.display_name ?? profile?.username} size={88} />
        <Text style={styles.displayName}>{profile?.display_name ?? profile?.username ?? 'Guest'}</Text>
        {profile?.username ? <Text style={styles.username}>@{profile.username}</Text> : null}
        {profile?.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
      </View>

      <View style={styles.statsRow}>
        <Stat label="Projects" value={String(projects.length)} />
        <Stat label="Duration" value={`${Math.round(totalDuration)}s`} />
        <Stat label="Storage" value={formatFileSize(profile?.storage_used ?? 0)} />
      </View>

      <View style={styles.actionsRow}>
        <Button label="Edit profile" variant="outline" size="md" onPress={() => undefined} icon="edit" fullWidth />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your projects</Text>
      </View>

      <FlatList
        data={projects}
        keyExtractor={p => p.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={{ gap: 4, paddingHorizontal: 16 }}
        renderItem={({ item }) => {
          const size = (SCREEN_W - 16 * 2 - 4 * 2) / 3;
          return (
            <Pressable
              onPress={() => navigation.navigate('Editor', { screen: 'VideoEditor', params: { projectId: item.id } })}
              style={{ marginBottom: 4 }}
            >
              <VideoThumbnail uri={item.thumbnail_url} width={size} height={size} duration={item.duration ?? undefined} />
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Dim.spacing.lg, height: 56 },
  title: { color: '#ffffff', fontSize: Typography.sizes.xxl, fontWeight: '800' },
  profileBlock: { alignItems: 'center', paddingHorizontal: Dim.spacing.lg, paddingVertical: 8 },
  displayName: { color: '#ffffff', fontSize: 22, fontWeight: '700', marginTop: 12 },
  username: { color: Colors.text.secondary, fontSize: Typography.sizes.base, marginTop: 2 },
  bio: { color: Colors.text.secondary, fontSize: Typography.sizes.sm, textAlign: 'center', marginTop: 8, maxWidth: 280 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16, marginHorizontal: Dim.spacing.lg, backgroundColor: Colors.bg.card, borderRadius: 16, marginTop: 16 },
  stat: { alignItems: 'center' },
  statValue: { color: '#ffffff', fontSize: Typography.sizes.lg, fontWeight: '700' },
  statLabel: { color: Colors.text.secondary, fontSize: Typography.sizes.xs, marginTop: 2 },
  actionsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: Dim.spacing.lg, marginTop: 16 },
  sectionHeader: { paddingHorizontal: Dim.spacing.lg, marginTop: 20, marginBottom: 8 },
  sectionTitle: { color: '#ffffff', fontSize: Typography.sizes.lg, fontWeight: '700' },
  grid: { paddingBottom: 80 },
});
