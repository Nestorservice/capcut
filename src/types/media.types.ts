export type MediaType = 'video' | 'image' | 'audio';

export interface MediaAsset {
  id: string;
  uri: string;
  type: MediaType;
  duration?: number;
  width?: number;
  height?: number;
  size?: number;
  mimeType?: string;
  thumbnailUri?: string;
  fileName?: string;
}

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  bitrate: number;
  frameRate: number;
  codec: string;
  size: number;
}

export interface VideoInfo extends VideoMetadata {
  hasAudio: boolean;
  audioCodec?: string;
  audioBitrate?: number;
  audioSampleRate?: number;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverUrl?: string;
  category?: string;
}
