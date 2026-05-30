import { CLOUDINARY_BASE, CLOUDINARY_CONFIG } from './client';

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  resourceType: 'image' | 'video' | 'raw' | 'auto';
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
  thumbnailUrl?: string;
}

export type UploadProgressHandler = (progress: number) => void;

interface CloudinaryRawResponse {
  public_id: string;
  url: string;
  secure_url: string;
  format: string;
  resource_type: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
  thumbnail_url?: string;
}

async function performUpload(
  localPath: string,
  folder: string,
  resourceType: 'image' | 'video',
  onProgress?: UploadProgressHandler,
): Promise<CloudinaryUploadResult> {
  if (!CLOUDINARY_CONFIG.cloudName) {
    throw new Error('Cloudinary cloud name is not configured');
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const form = new FormData();
    const uri = localPath.startsWith('file://') ? localPath : `file://${localPath}`;
    const fileName = localPath.split('/').pop() ?? 'upload';
    const mimeType = resourceType === 'video' ? 'video/mp4' : 'image/jpeg';

    form.append('file', {
      uri,
      name: fileName,
      type: mimeType,
    } as unknown as Blob);
    form.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    form.append('folder', folder);

    xhr.upload.onprogress = event => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.min(1, event.loaded / event.total));
      }
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const raw = JSON.parse(xhr.responseText) as CloudinaryRawResponse;
          resolve({
            publicId: raw.public_id,
            url: raw.url,
            secureUrl: raw.secure_url,
            format: raw.format,
            resourceType: raw.resource_type as CloudinaryUploadResult['resourceType'],
            bytes: raw.bytes,
            width: raw.width,
            height: raw.height,
            duration: raw.duration,
            thumbnailUrl: raw.thumbnail_url,
          });
        } catch (e) {
          reject(new Error(`Cloudinary upload parse failed: ${(e as Error).message}`));
        }
      } else {
        reject(new Error(`Cloudinary upload failed (${xhr.status}): ${xhr.responseText}`));
      }
    };

    xhr.onerror = () => reject(new Error('Cloudinary upload network error'));
    xhr.onabort = () => reject(new Error('Cloudinary upload aborted'));

    xhr.open('POST', `${CLOUDINARY_BASE}/${resourceType}/upload`);
    xhr.send(form);
  });
}

export const cloudinaryUploadService = {
  async uploadVideo(
    localPath: string,
    folder: string,
    onProgress?: UploadProgressHandler,
  ): Promise<CloudinaryUploadResult> {
    return performUpload(localPath, folder, 'video', onProgress);
  },

  async uploadThumbnail(localPath: string, folder: string): Promise<string> {
    const result = await performUpload(localPath, folder, 'image');
    return result.secureUrl;
  },

  async uploadImage(localPath: string, folder: string): Promise<CloudinaryUploadResult> {
    return performUpload(localPath, folder, 'image');
  },
};
