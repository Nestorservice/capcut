import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditorStackParamList } from '@types/navigation.types';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { useExport } from '@hooks/useExport';
import { formatTimeCompact } from '@utils/formatTime';

type Props = NativeStackScreenProps<EditorStackParamList, 'ExportProgress'>;

const RING_SIZE = 220;
const STROKE = 12;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ExportProgressScreen({ route, navigation }: Props) {
  const { step, progress, startExport, cancel, error, outputPath, estimatedRemaining } = useExport();

  useEffect(() => {
    void (async () => {
      const path = await startExport();
      if (path) {
        navigation.replace('ExportComplete', { projectId: route.params.projectId, outputUri: path });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (step === 'completed' && outputPath) {
      navigation.replace('ExportComplete', { projectId: route.params.projectId, outputUri: outputPath });
    }
  }, [step, outputPath, navigation, route.params.projectId]);

  const percent = Math.round(progress * 100);
  const offset = CIRCUMFERENCE * (1 - progress);

  const onCancel = () => {
    cancel();
    navigation.goBack();
  };

  const message =
    step === 'rendering'
      ? 'Rendering video...'
      : step === 'uploading'
        ? 'Uploading to cloud...'
        : step === 'saving'
          ? 'Saving project...'
          : step === 'failed'
            ? `Failed: ${error?.message ?? 'Unknown error'}`
            : 'Preparing...';

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <View style={styles.ringWrap}>
          <Svg width={RING_SIZE} height={RING_SIZE}>
            <Circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS} stroke={Colors.bg.card} strokeWidth={STROKE} fill="none" />
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke={Colors.accent.pink}
              strokeWidth={STROKE}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              strokeLinecap="round"
              fill="none"
              transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
            />
          </Svg>
          <View style={styles.ringCenter}>
            <Text style={styles.percent}>{percent}%</Text>
            {estimatedRemaining !== null ? (
              <Text style={styles.eta}>~{formatTimeCompact(estimatedRemaining)} left</Text>
            ) : null}
          </View>
        </View>
        <Text style={styles.message}>{message}</Text>
        <Pressable onPress={onCancel} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Dim.spacing.xxl },
  ringWrap: { width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center' },
  ringCenter: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  percent: { color: '#ffffff', fontSize: 48, fontWeight: '800' },
  eta: { color: Colors.text.secondary, fontSize: Typography.sizes.sm, marginTop: 4 },
  message: { color: Colors.text.primary, fontSize: Typography.sizes.base, marginTop: 32 },
  cancelBtn: { marginTop: 24, paddingHorizontal: 24, paddingVertical: 12 },
  cancelText: { color: Colors.status.error, fontSize: Typography.sizes.base, fontWeight: '700' },
});
