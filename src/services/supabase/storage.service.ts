import { supabase } from './client';
import { Clip, TextOverlay, AudioTrack, StickerOverlay } from '@types/editor.types';

interface ClipRow {
  id: string;
  project_id: string;
  user_id: string;
  cloudinary_public_id: string;
  original_url: string;
  thumbnail_url: string | null;
  start_time: number;
  end_time: number;
  duration: number;
  position: number;
  speed: number;
  volume: number;
  is_muted: boolean;
  transform_data: Record<string, unknown>;
  filter_data: Record<string, unknown>;
  keyframes: unknown[];
}

export const storageService = {
  async saveClips(projectId: string, userId: string, clips: Clip[]): Promise<void> {
    const { error: delErr } = await supabase.from('clips').delete().eq('project_id', projectId);
    if (delErr) throw delErr;
    if (clips.length === 0) return;
    const rows: Omit<ClipRow, 'id'>[] = clips.map((c, idx) => ({
      project_id: projectId,
      user_id: userId,
      cloudinary_public_id: c.cloudinaryPublicId ?? '',
      original_url: c.sourceUri,
      thumbnail_url: c.thumbnailUri ?? null,
      start_time: c.trimStart,
      end_time: c.trimEnd,
      duration: c.duration,
      position: idx,
      speed: c.speed,
      volume: c.volume,
      is_muted: c.isMuted,
      transform_data: c.transform as unknown as Record<string, unknown>,
      filter_data: c.filter as unknown as Record<string, unknown>,
      keyframes: c.keyframes as unknown[],
    }));
    const { error } = await supabase.from('clips').insert(rows);
    if (error) throw error;
  },

  async saveTextOverlays(projectId: string, overlays: TextOverlay[]): Promise<void> {
    const { error: delErr } = await supabase
      .from('text_overlays')
      .delete()
      .eq('project_id', projectId);
    if (delErr) throw delErr;
    if (overlays.length === 0) return;
    const rows = overlays.map(o => ({
      project_id: projectId,
      content: o.content,
      font_family: o.fontFamily,
      font_size: o.fontSize,
      font_weight: o.fontWeight,
      color: o.color,
      background_color: o.backgroundColor ?? null,
      position_x: o.positionX,
      position_y: o.positionY,
      scale: o.scale,
      rotation: o.rotation,
      start_time: o.startTime,
      end_time: o.endTime,
      animation_in: o.animationIn ?? null,
      animation_out: o.animationOut ?? null,
      animation_loop: o.animationLoop ?? null,
      style_data: { shadow: o.shadow, stroke: o.stroke, alignment: o.alignment },
    }));
    const { error } = await supabase.from('text_overlays').insert(rows);
    if (error) throw error;
  },

  async saveAudioTracks(projectId: string, tracks: AudioTrack[]): Promise<void> {
    const { error: delErr } = await supabase
      .from('audio_tracks')
      .delete()
      .eq('project_id', projectId);
    if (delErr) throw delErr;
    if (tracks.length === 0) return;
    const rows = tracks.map(t => ({
      project_id: projectId,
      cloudinary_public_id: t.cloudinaryPublicId ?? null,
      url: t.uri,
      title: t.title ?? null,
      artist: t.artist ?? null,
      duration: t.duration,
      start_time: t.startTime,
      offset: t.offset,
      volume: t.volume,
      is_muted: t.isMuted,
      track_type: t.trackType,
      fade_in: t.fadeIn,
      fade_out: t.fadeOut,
    }));
    const { error } = await supabase.from('audio_tracks').insert(rows);
    if (error) throw error;
  },

  async saveStickers(projectId: string, stickers: StickerOverlay[]): Promise<void> {
    const { error: delErr } = await supabase
      .from('sticker_overlays')
      .delete()
      .eq('project_id', projectId);
    if (delErr) throw delErr;
    if (stickers.length === 0) return;
    const rows = stickers.map(s => ({
      project_id: projectId,
      sticker_id: s.stickerId,
      sticker_url: s.stickerUrl,
      position_x: s.positionX,
      position_y: s.positionY,
      scale: s.scale,
      rotation: s.rotation,
      start_time: s.startTime,
      end_time: s.endTime,
    }));
    const { error } = await supabase.from('sticker_overlays').insert(rows);
    if (error) throw error;
  },
};
