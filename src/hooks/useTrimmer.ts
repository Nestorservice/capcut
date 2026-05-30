import { useCallback, useState } from 'react';
import { useEditorStore } from '@store/editorStore';
import { APP_CONFIG } from '@constants/index';
import { ffmpegService } from '@services/ffmpeg/ffmpeg.service';
import { getClipThumbnailDir, ensureThumbnailDir } from '@utils/generateThumbnail';

export function useTrimmer(clipId: string | null) {
  const clip = useEditorStore(s => (clipId ? s.clips.find(c => c.id === clipId) ?? null : null));
  const trimClip = useEditorStore(s => s.trimClip);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);

  const loadThumbnails = useCallback(
    async (count = APP_CONFIG.THUMBNAIL_STRIP_COUNT) => {
      if (!clip) return;
      setIsLoadingThumbnails(true);
      try {
        const dir = getClipThumbnailDir(clip.id);
        await ensureThumbnailDir(dir);
        const paths = await ffmpegService.generateThumbnailStrip(clip.sourceUri, count, dir);
        setThumbnails(paths);
      } catch (e) {
        console.warn('Thumbnail strip generation failed', e);
      } finally {
        setIsLoadingThumbnails(false);
      }
    },
    [clip],
  );

  const applyTrim = useCallback(
    (startTime: number, endTime: number) => {
      if (!clip) return;
      const minDur = APP_CONFIG.MIN_TRIM_DURATION;
      const newStart = Math.max(0, startTime);
      const newEnd = Math.min(clip.duration, Math.max(newStart + minDur, endTime));
      trimClip(clip.id, newStart, newEnd);
    },
    [clip, trimClip],
  );

  return {
    clip,
    thumbnails,
    isLoadingThumbnails,
    loadThumbnails,
    applyTrim,
  };
}
