import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Toggle } from '@components/ui/Toggle';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { MainStackParamList } from '@types/navigation.types';
import { useUIStore } from '@store/uiStore';

type Nav = NativeStackNavigationProp<MainStackParamList>;

export function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const showToast = useUIStore(s => s.showToast);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [highQuality, setHighQuality] = useState(true);

  const clearCache = async () => {
    Alert.alert('Clear cache?', 'This will remove generated thumbnails and temporary files.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          try {
            const cache = RNFS.CachesDirectoryPath;
            const items = await RNFS.readDir(cache);
            for (const item of items) {
              if (item.name.startsWith('captcut_')) {
                await RNFS.unlink(item.path).catch(() => undefined);
              }
            }
            showToast('Cache cleared', 'success');
          } catch (e) {
            showToast((e as Error).message, 'error');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Icon name="arrow-back" size={24} color="#ffffff" />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Section title="Preferences">
          <ToggleRow icon="notifications" label="Push notifications" value={pushEnabled} onChange={setPushEnabled} />
          <ToggleRow icon="save" label="Auto-save projects" value={autoSave} onChange={setAutoSave} />
          <ToggleRow icon="hd" label="High quality preview" value={highQuality} onChange={setHighQuality} />
        </Section>
        <Section title="Storage">
          <NavRow icon="folder" label="Clear cache" onPress={clearCache} />
          <NavRow icon="cloud-queue" label="Cloud storage" onPress={() => undefined} />
        </Section>
        <Section title="Account">
          <NavRow icon="person" label="Edit profile" onPress={() => undefined} />
        </Section>
        <Section title="About">
          <InfoRow label="Version" value="1.0.0" />
          <NavRow icon="info" label="Terms of Service" onPress={() => undefined} />
          <NavRow icon="policy" label="Privacy Policy" onPress={() => undefined} />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function ToggleRow({ icon, label, value, onChange }: { icon: string; label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.row}>
      <Icon name={icon} size={22} color={Colors.text.primary} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Toggle value={value} onChange={onChange} />
    </View>
  );
}

function NavRow({ icon, label, onPress, danger }: { icon: string; label: string; onPress: () => void; danger?: boolean }) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Icon name={icon} size={22} color={danger ? Colors.status.error : Colors.text.primary} />
      <Text style={[styles.rowLabel, danger && { color: Colors.status.error }]}>{label}</Text>
      <Icon name="chevron-right" size={22} color={Colors.text.tertiary} />
    </Pressable>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Dim.spacing.lg, height: 56 },
  title: { color: '#ffffff', fontSize: Typography.sizes.lg, fontWeight: '700' },
  content: { padding: Dim.spacing.lg, gap: 24, paddingBottom: 40 },
  section: { gap: 8 },
  sectionTitle: { color: Colors.text.secondary, fontSize: Typography.sizes.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5 },
  sectionBody: { backgroundColor: Colors.bg.card, borderRadius: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border.light },
  rowLabel: { flex: 1, color: '#ffffff', fontSize: Typography.sizes.base },
  infoValue: { color: Colors.text.secondary, fontSize: Typography.sizes.sm },
});
