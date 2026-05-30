import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { useAuthStore } from '@store/authStore';
import { notificationsService } from '@services/supabase/projects.service';
import { AppNotification } from '@types/project.types';
import { MainStackParamList } from '@types/navigation.types';
import { EmptyState } from '@components/ui/EmptyState';

type Nav = NativeStackNavigationProp<MainStackParamList>;

const ICONS: Record<string, string> = {
  project_complete: 'check-circle',
  project_failed: 'error',
  system: 'info',
  tip: 'lightbulb',
  feature_announcement: 'campaign',
};

export function NotificationsScreen() {
  const navigation = useNavigation<Nav>();
  const userId = useAuthStore(s => s.user?.id);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const list = await notificationsService.list(userId);
      setItems(list);
    } catch (e) {
      console.warn('Notifications load failed', e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  const onTap = async (n: AppNotification) => {
    if (!n.is_read) {
      await notificationsService.markAsRead(n.id);
      setItems(s => s.map(it => (it.id === n.id ? { ...it, is_read: true } : it)));
    }
  };

  const markAll = async () => {
    if (!userId) return;
    await notificationsService.markAllAsRead(userId);
    setItems(s => s.map(it => ({ ...it, is_read: true })));
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Icon name="arrow-back" size={24} color="#ffffff" />
        </Pressable>
        <Text style={styles.title}>Notifications</Text>
        <Pressable onPress={markAll}>
          <Text style={styles.markAll}>Mark all</Text>
        </Pressable>
      </View>
      {items.length === 0 && !loading ? (
        <EmptyState icon="notifications-none" title="No notifications yet" description="When something happens, it'll show up here." />
      ) : (
        <FlatList
          data={items}
          keyExtractor={n => n.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={Colors.accent.pink} />}
          renderItem={({ item }) => (
            <Pressable onPress={() => onTap(item)} style={[styles.item, item.is_read && styles.itemRead]}>
              <View style={[styles.iconBg, item.is_read && styles.iconBgRead]}>
                <Icon name={ICONS[item.type] ?? 'notifications'} size={20} color="#ffffff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                {item.body ? <Text style={styles.itemBody} numberOfLines={2}>{item.body}</Text> : null}
                <Text style={styles.itemDate}>{new Date(item.created_at).toLocaleString()}</Text>
              </View>
              {!item.is_read ? <View style={styles.dot} /> : null}
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Dim.spacing.lg, height: 56 },
  title: { color: '#ffffff', fontSize: Typography.sizes.lg, fontWeight: '700' },
  markAll: { color: Colors.accent.pink, fontSize: Typography.sizes.sm, fontWeight: '700' },
  list: { padding: Dim.spacing.lg, gap: 8 },
  item: { flexDirection: 'row', gap: 12, padding: 12, backgroundColor: Colors.bg.card, borderRadius: 12, alignItems: 'flex-start' },
  itemRead: { backgroundColor: Colors.bg.secondary, opacity: 0.7 },
  iconBg: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.accent.pink, alignItems: 'center', justifyContent: 'center' },
  iconBgRead: { backgroundColor: Colors.surface.containerHigh },
  itemTitle: { color: '#ffffff', fontSize: Typography.sizes.base, fontWeight: '700' },
  itemBody: { color: Colors.text.secondary, fontSize: Typography.sizes.sm, marginTop: 4 },
  itemDate: { color: Colors.text.tertiary, fontSize: Typography.sizes.xs, marginTop: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accent.pink, marginTop: 6 },
});
