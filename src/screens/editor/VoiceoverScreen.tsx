import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, cancelAnimation } from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditorStackParamList } from '@types/navigation.types';
import { ToolHeader } from './_shared/ToolHeader';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { useVoiceRecorder } from '@hooks/useAudio';
import { usePermissions } from '@hooks/usePermissions';
import { useEditorStore } from '@store/editorStore';
import { uuid } from '@utils/index';
import { formatTime } from '@utils/formatTime';
import { ffmpegService } from '@services/ffmpeg/ffmpeg.service';

type Props = NativeStackScreenProps<EditorStackParamList, 'Voiceover'>;

export function VoiceoverScreen({ navigation }: Props) {
  const recorder = useVoiceRecorder();
  const { request } = usePermissions();
  const addAudio = useEditorStore(s => s.addAudioTrack);
  const currentTime = useEditorStore(s => s.currentTime);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (recorder.isRecording) {
      pulse.value = withRepeat(withTiming(1.2, { duration: 700 }), -1, true);
    } else {
      cancelAnimation(pulse);
      pulse.value = 1;
    }
  }, [pulse, recorder.isRecording]);

  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  const toggleRecord = async () => {
    if (recorder.isRecording) {
      const path = await recorder.stop();
      if (path) {
        try {
          const info = await ffmpegService.getVideoInfo(path);
          addAudio({
            id: uuid(),
            uri: path,
            duration: info.duration,
            startTime: currentTime,
            offset: 0,
            volume: 1,
            isMuted: false,
            trackType: 'voiceover',
            fadeIn: 0,
            fadeOut: 0,
            title: 'Voiceover',
          });
        } catch {
          addAudio({
            id: uuid(),
            uri: path,
            duration: recorder.recordedTime,
            startTime: currentTime,
            offset: 0,
            volume: 1,
            isMuted: false,
            trackType: 'voiceover',
            fadeIn: 0,
            fadeOut: 0,
            title: 'Voiceover',
          });
        }
        navigation.goBack();
      }
      return;
    }
    const granted = await request('MICROPHONE');
    if (!granted) return;
    await recorder.start();
  };

  return (
    <SafeAreaView style={styles.root}>
      <ToolHeader title="Voiceover" onClose={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={styles.timer}>{formatTime(recorder.recordedTime, true)}</Text>
        <Text style={styles.hint}>{recorder.isRecording ? 'Recording...' : 'Tap to record'}</Text>
        <Animated.View style={[pulseStyle, { marginTop: 60 }]}>
          <Pressable onPress={toggleRecord} style={styles.recordBtn}>
            <Icon name={recorder.isRecording ? 'stop' : 'mic'} size={44} color="#ffffff" />
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Dim.spacing.xxl },
  timer: { color: '#ffffff', fontSize: 48, fontWeight: '800', fontVariant: ['tabular-nums'] },
  hint: { color: Colors.text.secondary, fontSize: Typography.sizes.base, marginTop: 8 },
  recordBtn: { width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.accent.pink, alignItems: 'center', justifyContent: 'center' },
});
