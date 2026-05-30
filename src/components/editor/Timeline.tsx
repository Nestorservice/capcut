import React, { useCallback, useEffect, useRef } from 'react';
import { Dimensions, ScrollView, StyleSheet, View, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useTimeline } from '@hooks/useTimeline';
import { useEditorStore } from '@store/editorStore';
import { Colors } from '@constants/colors';
import { Dim } from '@constants/dimensions';
import { ClipItem } from './ClipItem';
import { TimelineCursor } from './TimelineCursor';
import { AudioWaveform } from './AudioWaveform';

const SCREEN_W = Dimensions.get('window').width;

interface Props {
  onAddPress?: () => void;
}

export function Timeline({ onAddPress: _onAddPress }: Props) {
  const {
    clipBounds,
    timelineWidth,
    cursorPosition,
    pixelsPerSecond,
    timelineScale,
    isPlaying,
    setCurrentTime,
    setTimelineScale,
    timeFromOffset,
  } = useTimeline();
  const selectedClipId = useEditorStore(s => s.selectedClipId);
  const selectClip = useEditorStore(s => s.selectClip);
  const audioTracks = useEditorStore(s => s.audioTracks);

  const scrollRef = useRef<ScrollView>(null);
  const lastScale = useRef(timelineScale);
  const isUserScrolling = useRef(false);

  useEffect(() => {
    if (!isUserScrolling.current) {
      scrollRef.current?.scrollTo({ x: cursorPosition, animated: !isPlaying });
    }
  }, [cursorPosition, isPlaying]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!isUserScrolling.current) return;
      const x = e.nativeEvent.contentOffset.x;
      const time = timeFromOffset(x);
      setCurrentTime(time);
    },
    [setCurrentTime, timeFromOffset],
  );

  const pinch = Gesture.Pinch()
    .onStart(() => {
      lastScale.current = timelineScale;
    })
    .onUpdate(e => {
      const next = Math.max(0.5, Math.min(10, lastScale.current * e.scale));
      setTimelineScale(next);
    });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={pinch}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: SCREEN_W / 2,
            paddingVertical: Dim.spacing.lg,
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
          onScrollBeginDrag={() => {
            isUserScrolling.current = true;
          }}
          onMomentumScrollEnd={() => {
            isUserScrolling.current = false;
          }}
          onScrollEndDrag={() => {
            isUserScrolling.current = false;
          }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={[styles.videoTrack, { width: Math.max(timelineWidth, 1) }]}>
            {clipBounds.map(({ clip, widthPx, startPx }) => (
              <View key={clip.id} style={{ position: 'absolute', left: startPx }}>
                <ClipItem
                  clip={clip}
                  widthPx={widthPx}
                  selected={clip.id === selectedClipId}
                  onPress={() => selectClip(clip.id === selectedClipId ? null : clip.id)}
                />
              </View>
            ))}
          </View>
          {audioTracks.length > 0 ? (
            <View style={[styles.audioRow, { width: Math.max(timelineWidth, 1) }]}>
              {audioTracks.slice(0, 1).map(track => (
                <View
                  key={track.id}
                  style={{
                    position: 'absolute',
                    left: track.startTime * pixelsPerSecond,
                    width: track.duration * pixelsPerSecond,
                  }}
                >
                  <AudioWaveform
                    width={Math.max(80, track.duration * pixelsPerSecond)}
                    height={Dim.timeline.audioTrackHeight}
                    seed={parseInt(track.id.replace(/\D/g, '').slice(0, 5) || '1', 10)}
                  />
                </View>
              ))}
            </View>
          ) : null}
        </ScrollView>
      </GestureDetector>
      <TimelineCursor />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.editor.timelineBg, position: 'relative' },
  videoTrack: { height: Dim.timeline.trackHeight, position: 'relative' },
  audioRow: { height: Dim.timeline.audioTrackHeight + Dim.spacing.sm, marginTop: Dim.spacing.sm, position: 'relative' },
});
