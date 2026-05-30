import { useCallback, useEffect, useRef, useState } from 'react';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { nowFilenameTimestamp } from '@utils/generateThumbnail';

export function useVoiceRecorder() {
  const recorderRef = useRef<AudioRecorderPlayer | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedTime, setRecordedTime] = useState(0);
  const [recordedPath, setRecordedPath] = useState<string | null>(null);

  useEffect(() => {
    recorderRef.current = new AudioRecorderPlayer();
    return () => {
      const r = recorderRef.current;
      if (r) {
        void r.stopRecorder().catch(() => undefined);
        r.removeRecordBackListener();
      }
    };
  }, []);

  const start = useCallback(async (): Promise<string> => {
    const recorder = recorderRef.current;
    if (!recorder) throw new Error('Recorder not initialized');
    const dir = `${RNFS.CachesDirectoryPath}/captcut_voice`;
    if (!(await RNFS.exists(dir))) await RNFS.mkdir(dir);
    const path = `${dir}/voice_${nowFilenameTimestamp()}.m4a`;
    setRecordedPath(null);
    setRecordedTime(0);
    await recorder.startRecorder(path, {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
    });
    recorder.addRecordBackListener(e => {
      setRecordedTime(e.currentPosition / 1000);
    });
    setIsRecording(true);
    return path;
  }, []);

  const stop = useCallback(async (): Promise<string | null> => {
    const recorder = recorderRef.current;
    if (!recorder) return null;
    try {
      const path = await recorder.stopRecorder();
      recorder.removeRecordBackListener();
      setIsRecording(false);
      setRecordedPath(path);
      return path;
    } catch (e) {
      setIsRecording(false);
      console.warn('Stop recording failed', e);
      return null;
    }
  }, []);

  return { isRecording, recordedTime, recordedPath, start, stop };
}

export function useAudioPreview() {
  const playerRef = useRef<AudioRecorderPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    playerRef.current = new AudioRecorderPlayer();
    return () => {
      const p = playerRef.current;
      if (p) {
        void p.stopPlayer().catch(() => undefined);
        p.removePlayBackListener();
      }
    };
  }, []);

  const play = useCallback(async (uri: string) => {
    const player = playerRef.current;
    if (!player) return;
    await player.startPlayer(uri);
    setIsPlaying(true);
    player.addPlayBackListener(e => {
      setPosition(e.currentPosition / 1000);
      setDuration(e.duration / 1000);
      if (e.currentPosition >= e.duration) {
        setIsPlaying(false);
      }
    });
  }, []);

  const stop = useCallback(async () => {
    const player = playerRef.current;
    if (!player) return;
    await player.stopPlayer();
    player.removePlayBackListener();
    setIsPlaying(false);
    setPosition(0);
  }, []);

  return { isPlaying, position, duration, play, stop };
}
