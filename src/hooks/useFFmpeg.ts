import { useCallback, useRef, useState } from 'react';
import { ffmpegService } from '@services/ffmpeg/ffmpeg.service';

export function useFFmpeg() {
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const cancelled = useRef(false);

  const reset = useCallback(() => {
    setProgress(0);
    setIsRunning(false);
    setError(null);
    cancelled.current = false;
  }, []);

  const cancel = useCallback(() => {
    cancelled.current = true;
    ffmpegService.cancelExecution();
    setIsRunning(false);
  }, []);

  const run = useCallback(async <T>(operation: (onProgress: (p: number) => void) => Promise<T>): Promise<T | null> => {
    reset();
    setIsRunning(true);
    try {
      const result = await operation(p => {
        if (!cancelled.current) setProgress(p);
      });
      setProgress(1);
      return result;
    } catch (e) {
      if (!cancelled.current) {
        setError(e as Error);
      }
      return null;
    } finally {
      setIsRunning(false);
    }
  }, [reset]);

  return { progress, isRunning, error, cancel, reset, run, ffmpeg: ffmpegService };
}
