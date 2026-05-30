import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Share from 'react-native-share';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditorStackParamList } from '@types/navigation.types';
import { Button } from '@components/ui/Button';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { useUIStore } from '@store/uiStore';

type Props = NativeStackScreenProps<EditorStackParamList, 'ExportComplete'>;

export function ExportCompleteScreen({ navigation, route }: Props) {
  const showToast = useUIStore(s => s.showToast);

  const onShare = async () => {
    try {
      await Share.open({
        url: `file://${route.params.outputUri}`,
        type: 'video/mp4',
        failOnCancel: false,
      });
    } catch (e) {
      showToast((e as Error).message, 'error');
    }
  };

  const onDone = () => {
    navigation.getParent()?.goBack();
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <LinearGradient
          colors={Colors.accent.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconBg}
        >
          <Icon name="check" size={56} color="#ffffff" />
        </LinearGradient>
        <Text style={styles.title}>Export Complete!</Text>
        <Text style={styles.subtitle}>Your video has been exported successfully.</Text>

        <View style={styles.actions}>
          <Button label="Share" icon="share" variant="primary" size="lg" fullWidth onPress={onShare} />
          <Pressable style={styles.secondaryBtn} onPress={onDone}>
            <Text style={styles.secondaryText}>Back to projects</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Dim.spacing.xxl, gap: 16 },
  iconBg: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '800' },
  subtitle: { color: Colors.text.secondary, fontSize: Typography.sizes.base, textAlign: 'center' },
  actions: { width: '100%', marginTop: 32, gap: 12 },
  secondaryBtn: { paddingVertical: 14, alignItems: 'center' },
  secondaryText: { color: Colors.text.secondary, fontSize: Typography.sizes.base, fontWeight: '600' },
});
