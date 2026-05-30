import { useMemo, useCallback } from 'react';
import { useEditorStore } from '@store/editorStore';
import { Dim } from '@constants/dimensions';

export function useTimeline() {
  const clips = useEditorStore(s => s.clips);
  const currentTime = useEditorStore(s => s.currentTime);
  const totalDuration = useEditorStore(s => s.totalDuration);
  const timelineScale = useEditorStore(s => s.timelineScale);
  const setCurrentTime = useEditorStore(s => s.setCurrentTime);
  const setTimelineScale = useEditorStore(s => s.setTimelineScale);
  const isPlaying = useEditorStore(s => s.isPlaying);
  const setPlaying = useEditorStore(s => s.setPlaying);

  const pixelsPerSecond = Dim.timeline.pixelsPerSecond * timelineScale;

  const timelineWidth = useMemo(() => Math.max(totalDuration * pixelsPerSecond, 0), [totalDuration, pixelsPerSecond]);

  const cursorPosition = useMemo(() => currentTime * pixelsPerSecond, [currentTime, pixelsPerSecond]);

  const timeFromOffset = useCallback(
    (offset: number) => Math.max(0, Math.min(totalDuration, offset / pixelsPerSecond)),
    [pixelsPerSecond, totalDuration],
  );

  const offsetFromTime = useCallback(
    (time: number) => Math.max(0, time * pixelsPerSecond),
    [pixelsPerSecond],
  );

  const clipBounds = useMemo(() => {
    let cumulative = 0;
    return clips.map(clip => {
      const effective = Math.max(0.1, (clip.trimEnd - clip.trimStart) / Math.max(0.1, clip.speed));
      const bounds = {
        clip,
        startTime: cumulative,
        endTime: cumulative + effective,
        startPx: cumulative * pixelsPerSecond,
        widthPx: effective * pixelsPerSecond,
      };
      cumulative += effective;
      return bounds;
    });
  }, [clips, pixelsPerSecond]);

  const clipAtTime = useCallback(
    (time: number) => clipBounds.find(b => time >= b.startTime && time < b.endTime),
    [clipBounds],
  );

  return {
    clips,
    currentTime,
    totalDuration,
    timelineScale,
    pixelsPerSecond,
    timelineWidth,
    cursorPosition,
    isPlaying,
    clipBounds,
    timeFromOffset,
    offsetFromTime,
    clipAtTime,
    setCurrentTime,
    setTimelineScale,
    setPlaying,
  };
}
