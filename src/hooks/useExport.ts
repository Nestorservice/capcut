import { useCallback, useState } from 'react';
import RNFS from 'react-native-fs';
import { useEditorStore } from '@store/editorStore';
import { useAuthStore } from '@store/authStore';
import { ffmpegService } from '@services/ffmpeg/ffmpeg.service';
import { cloudinaryUploadService } from '@services/cloudinary/upload.service';
import { projectsService } from '@services/supabase/projects.service';
import { nowFilenameTimestamp } from '@utils/generateThumbnail';

export type ExportStep = 'idle' | 'rendering' | 'uploading' | 'saving' | 'completed' | 'cancelled' | 'failed';

export function useExport() {
  const [step, setStep] = useState<ExportStep>('idle');
  const [progress, setProgress] = useState(0);
  const [outputPath, setOutputPath] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [estimatedRemaining, setEstimatedRemaining] = useState<number | null>(null);

  const clips = useEditorStore(s => s.clips);
  const textOverlays = useEditorStore(s => s.textOverlays);
  const audioTracks = useEditorStore(s => s.audioTracks);
  const exportSettings = useEditorStore(s => s.exportSettings);
  const projectId = useEditorStore(s => s.projectId);
  const profile = useAuthStore(s => s.profile);

  const reset = useCallback(() => {
    setStep('idle');
    setProgress(0);
    setOutputPath(null);
    setError(null);
    setStartTime(null);
    setEstimatedRemaining(null);
  }, []);

  const cancel = useCallback(() => {
    ffmpegService.cancelExecution();
    setStep('cancelled');
  }, []);

  const startExport = useCallback(async (): Promise<string | null> => {
    if (!projectId) {
      setError(new Error('No project loaded'));
      return null;
    }
    reset();
    setStartTime(Date.now());
    setStep('rendering');

    try {
      const exportDir = `${RNFS.DocumentDirectoryPath}/CapCut`;
      if (!(await RNFS.exists(exportDir))) {
        await RNFS.mkdir(exportDir);
      }
      const outPath = `${exportDir}/export_${nowFilenameTimestamp()}.mp4`;

      await ffmpegService.exportVideo(
        clips,
        textOverlays,
        audioTracks,
        exportSettings,
        outPath,
        p => {
          setProgress(p);
          if (startTime !== null && p > 0.02) {
            const elapsed = (Date.now() - startTime) / 1000;
            const total = elapsed / p;
            setEstimatedRemaining(Math.max(0, total - elapsed));
          }
        },
      );
      setOutputPath(outPath);

      const folder = `${profile?.cloudinary_folder ?? 'captcut'}/${projectId}`;
      setStep('uploading');
      try {
        const upload = await cloudinaryUploadService.uploadVideo(outPath, folder, setProgress);
        setStep('saving');
        await projectsService.updateProject(projectId, {
          status: 'completed',
          video_url: upload.secureUrl,
          cloudinary_public_id: upload.publicId,
          duration: upload.duration,
          file_size: upload.bytes,
        });
      } catch (uploadErr) {
        console.warn('Cloudinary upload failed, local file still available', uploadErr);
      }

      setStep('completed');
      setProgress(1);
      return outPath;
    } catch (e) {
      setError(e as Error);
      setStep('failed');
      return null;
    }
  }, [audioTracks, clips, exportSettings, profile?.cloudinary_folder, projectId, reset, startTime, textOverlays]);

  return {
    step,
    progress,
    outputPath,
    error,
    estimatedRemaining,
    startExport,
    cancel,
    reset,
  };
}
