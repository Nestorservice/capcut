import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import Video, { VideoRef, OnLoadData, OnProgressData } from 'react-native-video';
import { Colors } from '@constants/colors';
import { Clip, TextOverlay, StickerOverlay } from '@types/editor.types';
import { TextOverlayLayer } from '@components/effects/TextOverlay';
import { StickerOverlayLayer } from '@components/effects/StickerOverlay';

interface Props {
  clip: Clip | null;
  currentTime: number;
  isPlaying: boolean;
  onProgress?: (time: number) => void;
  onLoad?: (duration: number) => void;
  onEnd?: () => void;
  textOverlays?: TextOverlay[];
  stickerOverlays?: StickerOverlay[];
  muted?: boolean;
  aspectRatio?: number;
}

export function VideoPreview({
  clip,
  currentTime,
  isPlaying,
  onProgress,
  onLoad,
  onEnd,
  textOverlays = [],
  stickerOverlays = [],
  muted = false,
  aspectRatio = 9 / 16,
}: Props) {
  const videoRef = useRef<VideoRef>(null);
  const [loading, setLoading] = useState(false);
  const lastSeek = useRef(0);

  const onVideoProgress = useCallback(
    (data: OnProgressData) => {
      onProgress?.(data.currentTime);
    },
    [onProgress],
  );

  const onVideoLoad = useCallback(
    (data: OnLoadData) => {
      setLoading(false);
      onLoad?.(data.duration);
    },
    [onLoad],
  );

  useEffect(() => {
    if (!videoRef.current || !clip) return;
    if (Math.abs(currentTime - lastSeek.current) > 0.4) {
      videoRef.current.seek(currentTime);
      lastSeek.current = currentTime;
    }
  }, [clip, currentTime]);

  if (!clip) {
    return (
      <View style={[styles.container, { aspectRatio }]}>
        <View style={styles.placeholder} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { aspectRatio }]}>
      <Video
        ref={videoRef}
        source={{ uri: clip.sourceUri }}
        style={StyleSheet.absoluteFill}
        paused={!isPlaying}
        muted={muted || clip.isMuted}
        volume={clip.volume}
        resizeMode="contain"
        onProgress={onVideoProgress}
        onLoad={onVideoLoad}
        onLoadStart={() => setLoading(true)}
        onEnd={onEnd}
        progressUpdateInterval={100}
        repeat={false}
      />
      {textOverlays.map(t => (
        <TextOverlayLayer key={t.id} overlay={t} currentTime={currentTime} />
      ))}
      {stickerOverlays.map(s => (
        <StickerOverlayLayer key={s.id} overlay={s} currentTime={currentTime} />
      ))}
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={Colors.accent.pink} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg.primary,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  placeholder: { flex: 1, backgroundColor: Colors.bg.primary },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
