import { CLOUDINARY_DELIVERY } from './client';

export interface VideoTransformOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | 'auto:low' | 'auto:good' | 'auto:best' | number;
  format?: 'mp4' | 'webm' | 'auto';
  startOffset?: number;
  endOffset?: number;
  crop?: 'fill' | 'fit' | 'pad' | 'scale';
}

function buildTransformations(opts: VideoTransformOptions = {}): string {
  const parts: string[] = [];
  if (opts.width) parts.push(`w_${opts.width}`);
  if (opts.height) parts.push(`h_${opts.height}`);
  if (opts.crop) parts.push(`c_${opts.crop}`);
  if (opts.quality !== undefined) parts.push(`q_${opts.quality}`);
  if (opts.format) parts.push(`f_${opts.format}`);
  if (opts.startOffset !== undefined) parts.push(`so_${opts.startOffset}`);
  if (opts.endOffset !== undefined) parts.push(`eo_${opts.endOffset}`);
  return parts.join(',');
}

export const cloudinaryTransformService = {
  getVideoUrl(publicId: string, options: VideoTransformOptions = {}): string {
    const transforms = buildTransformations(options);
    const path = transforms ? `${transforms}/${publicId}` : publicId;
    return `${CLOUDINARY_DELIVERY}/video/upload/${path}.mp4`;
  },

  getThumbnailUrl(publicId: string, width = 400, height = 600): string {
    return `${CLOUDINARY_DELIVERY}/video/upload/w_${width},h_${height},c_fill,q_auto,f_jpg,so_1/${publicId}.jpg`;
  },

  getImageUrl(publicId: string, width = 400, height = 400): string {
    return `${CLOUDINARY_DELIVERY}/image/upload/w_${width},h_${height},c_fill,q_auto,f_auto/${publicId}`;
  },

  getStreamingUrl(publicId: string): string {
    return `${CLOUDINARY_DELIVERY}/video/upload/sp_auto/${publicId}.m3u8`;
  },
};
