import { useCallback, useState } from 'react';
import { cloudinaryUploadService, CloudinaryUploadResult } from '@services/cloudinary/upload.service';

export function useCloudinary() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadVideo = useCallback(async (localPath: string, folder: string): Promise<CloudinaryUploadResult | null> => {
    setIsUploading(true);
    setProgress(0);
    setError(null);
    try {
      const result = await cloudinaryUploadService.uploadVideo(localPath, folder, setProgress);
      return result;
    } catch (e) {
      setError(e as Error);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const uploadThumbnail = useCallback(async (localPath: string, folder: string): Promise<string | null> => {
    try {
      return await cloudinaryUploadService.uploadThumbnail(localPath, folder);
    } catch (e) {
      setError(e as Error);
      return null;
    }
  }, []);

  return { progress, isUploading, error, uploadVideo, uploadThumbnail };
}
