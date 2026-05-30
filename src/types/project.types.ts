import { Clip, TextOverlay, AudioTrack, StickerOverlay } from './editor.types';

export type ProjectStatus = 'draft' | 'processing' | 'completed' | 'failed';

export interface Project {
  id: string;
  user_id: string;
  title: string;
  thumbnail_url: string | null;
  cloudinary_public_id: string | null;
  video_url: string | null;
  duration: number | null;
  resolution: string;
  frame_rate: number;
  status: ProjectStatus;
  timeline_data: TimelineData;
  metadata: Record<string, unknown>;
  file_size: number;
  created_at: string;
  updated_at: string;
}

export interface TimelineData {
  clips: Clip[];
  textOverlays: TextOverlay[];
  audioTracks: AudioTrack[];
  stickerOverlays: StickerOverlay[];
  totalDuration: number;
}

export interface CreateProjectInput {
  title?: string;
  thumbnail_url?: string;
  resolution?: string;
  frame_rate?: number;
}

export interface UpdateProjectInput {
  title?: string;
  thumbnail_url?: string;
  cloudinary_public_id?: string;
  video_url?: string;
  duration?: number;
  resolution?: string;
  frame_rate?: number;
  status?: ProjectStatus;
  timeline_data?: TimelineData;
  metadata?: Record<string, unknown>;
  file_size?: number;
}

export type NotificationType =
  | 'project_complete'
  | 'project_failed'
  | 'system'
  | 'tip'
  | 'feature_announcement';

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}
