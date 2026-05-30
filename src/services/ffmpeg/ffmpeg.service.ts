import {
  FFmpegKit,
  FFmpegKitConfig,
  FFprobeKit,
  ReturnCode,
  Statistics,
  Session,
} from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';
import { ffmpegCommands } from './commands';
import {
  Clip,
  TextOverlay,
  AudioTrack,
  ExportSettings,
  ColorAdjustments,
  TransitionType,
  AudioOptions,
  AudioMixOption,
  TextOverlayData,
  StickerOverlay,
} from '@types/editor.types';
import { VideoInfo, VideoMetadata } from '@types/media.types';
import { RESOLUTIONS, ASPECT_RATIOS } from '@constants/index';
import { nowFilenameTimestamp } from '@utils/generateThumbnail';

export type ProgressHandler = (progress: number) => void;

class FFmpegService {
  private currentSession: Session | null = null;

  private async getOutputDir(): Promise<string> {
    const dir = `${RNFS.CachesDirectoryPath}/captcut_output`;
    if (!(await RNFS.exists(dir))) {
      await RNFS.mkdir(dir);
    }
    return dir;
  }

  async generateOutputPath(prefix = 'out', ext = 'mp4'): Promise<string> {
    const dir = await this.getOutputDir();
    return `${dir}/${prefix}_${nowFilenameTimestamp()}_${Math.floor(Math.random() * 10000)}.${ext}`;
  }

  private async run(command: string, totalDurationMs?: number, onProgress?: ProgressHandler): Promise<void> {
    if (onProgress && totalDurationMs && totalDurationMs > 0) {
      FFmpegKitConfig.enableStatisticsCallback((stats: Statistics) => {
        const time = stats.getTime();
        if (time > 0) onProgress(Math.min(1, time / totalDurationMs));
      });
    }
    const session = await FFmpegKit.execute(command);
    this.currentSession = session;
    const returnCode = await session.getReturnCode();
    if (!ReturnCode.isSuccess(returnCode)) {
      const logs = await session.getAllLogsAsString();
      throw new Error(`FFmpeg failed: ${logs?.slice(-500) ?? 'unknown error'}`);
    }
    if (onProgress) onProgress(1);
  }

  cancelExecution(): void {
    if (this.currentSession) {
      FFmpegKit.cancel(this.currentSession.getSessionId());
      this.currentSession = null;
    } else {
      FFmpegKit.cancel();
    }
  }

  async trimVideo(inputPath: string, startTime: number, endTime: number, outputPath: string): Promise<string> {
    await this.run(ffmpegCommands.trim(inputPath, startTime, endTime, outputPath));
    return outputPath;
  }

  async splitVideo(inputPath: string, splitTime: number): Promise<[string, string]> {
    const left = await this.generateOutputPath('split_l');
    const right = await this.generateOutputPath('split_r');
    const commands = ffmpegCommands.splitToTwo(inputPath, splitTime, left, right);
    for (const cmd of commands) {
      await this.run(cmd);
    }
    return [left, right];
  }

  async mergeClips(clipPaths: string[], outputPath: string): Promise<string> {
    if (clipPaths.length === 0) throw new Error('No clips to merge');
    if (clipPaths.length === 1) {
      await RNFS.copyFile(clipPaths[0], outputPath);
      return outputPath;
    }
    await this.run(ffmpegCommands.reencodeConcat(clipPaths, outputPath));
    return outputPath;
  }

  async changeSpeed(inputPath: string, speed: number, outputPath: string): Promise<string> {
    await this.run(ffmpegCommands.changeSpeed(inputPath, speed, outputPath));
    return outputPath;
  }

  async extractAudio(videoPath: string, outputPath: string): Promise<string> {
    await this.run(ffmpegCommands.extractAudio(videoPath, outputPath));
    return outputPath;
  }

  async removeAudio(videoPath: string, outputPath: string): Promise<string> {
    await this.run(ffmpegCommands.removeAudio(videoPath, outputPath));
    return outputPath;
  }

  async addAudioTrack(
    videoPath: string,
    audioPath: string,
    outputPath: string,
    options: AudioOptions = {},
  ): Promise<string> {
    await this.run(
      ffmpegCommands.addAudioTrack(videoPath, audioPath, outputPath, {
        volume: options.volume,
        offset: options.startOffset,
        replace: options.replaceOriginal,
      }),
    );
    return outputPath;
  }

  async mixAudioTracks(tracks: AudioMixOption[], outputPath: string): Promise<string> {
    if (tracks.length === 0) throw new Error('No audio tracks to mix');
    const inputArgs = tracks.map(t => `-itsoffset ${t.startTime.toFixed(3)} -i "${t.uri}"`).join(' ');
    const filterParts = tracks
      .map((t, i) => `[${i}:a]volume=${t.volume.toFixed(2)}[a${i}]`)
      .concat([
        `${tracks.map((_, i) => `[a${i}]`).join('')}amix=inputs=${tracks.length}:duration=longest[a]`,
      ])
      .join(';');
    const cmd = `-y ${inputArgs} -filter_complex "${filterParts}" -map "[a]" -c:a aac -b:a 192k "${outputPath}"`;
    await this.run(cmd);
    return outputPath;
  }

  async applyFilter(inputPath: string, filterName: string, intensity: number, outputPath: string): Promise<string> {
    await this.run(ffmpegCommands.applyFilter(inputPath, filterName, intensity, outputPath));
    return outputPath;
  }

  async applyColorAdjustment(inputPath: string, adjustments: ColorAdjustments, outputPath: string): Promise<string> {
    await this.run(ffmpegCommands.applyColorAdjustment(inputPath, adjustments, outputPath));
    return outputPath;
  }

  async addTextOverlay(inputPath: string, textData: TextOverlayData, outputPath: string): Promise<string> {
    await this.run(
      ffmpegCommands.addTextOverlay(
        inputPath,
        textData.text,
        textData.x,
        textData.y,
        textData.fontSize,
        textData.fontColor,
        outputPath,
        {
          shadow: textData.shadow,
          borderWidth: textData.borderWidth,
          borderColor: textData.borderColor,
        },
      ),
    );
    return outputPath;
  }

  async applyTransition(
    clip1Path: string,
    clip2Path: string,
    transition: TransitionType,
    duration: number,
    outputPath: string,
  ): Promise<string> {
    const info = await this.getVideoInfo(clip1Path);
    const offset = Math.max(0, info.duration - duration);
    await this.run(ffmpegCommands.applyTransition(clip1Path, clip2Path, transition, offset, duration, outputPath));
    return outputPath;
  }

  async changeResolution(inputPath: string, resolution: string, outputPath: string): Promise<string> {
    const res = RESOLUTIONS.find(r => r.value === resolution);
    if (!res) throw new Error(`Unknown resolution: ${resolution}`);
    await this.run(ffmpegCommands.changeResolution(inputPath, res.width, res.height, outputPath));
    return outputPath;
  }

  async changeFrameRate(inputPath: string, fps: number, outputPath: string): Promise<string> {
    await this.run(ffmpegCommands.changeFrameRate(inputPath, fps, outputPath));
    return outputPath;
  }

  async changeAspectRatio(inputPath: string, ratio: string, outputPath: string): Promise<string> {
    const ar = ASPECT_RATIOS.find(r => r.value === ratio);
    if (!ar) throw new Error(`Unknown aspect ratio: ${ratio}`);
    const targetWidth = 1080;
    const targetHeight = Math.floor((targetWidth / ar.width) * ar.height);
    await this.run(ffmpegCommands.changeAspectRatio(inputPath, targetWidth, targetHeight, outputPath));
    return outputPath;
  }

  async generateThumbnail(videoPath: string, atTime: number, outputPath: string): Promise<string> {
    await this.run(ffmpegCommands.generateThumbnail(videoPath, atTime, outputPath));
    return outputPath;
  }

  async generateThumbnailStrip(videoPath: string, count: number, outputDir: string): Promise<string[]> {
    if (!(await RNFS.exists(outputDir))) {
      await RNFS.mkdir(outputDir);
    }
    const info = await this.getVideoInfo(videoPath);
    const fps = count / Math.max(info.duration, 0.1);
    const pattern = `${outputDir}/thumb_%04d.jpg`;
    await this.run(ffmpegCommands.generateThumbnailStrip(videoPath, count, fps, pattern));
    const items = await RNFS.readDir(outputDir);
    return items
      .filter(i => i.name.startsWith('thumb_') && i.name.endsWith('.jpg'))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(i => i.path);
  }

  async getVideoInfo(videoPath: string): Promise<VideoInfo> {
    const session = await FFprobeKit.getMediaInformation(videoPath);
    const info = session.getMediaInformation();
    if (!info) throw new Error('Could not read media info');
    const duration = parseFloat(info.getDuration() ?? '0');
    const streams = info.getStreams() ?? [];
    const videoStream = streams.find(s => s.getType() === 'video');
    const audioStream = streams.find(s => s.getType() === 'audio');
    const width = parseInt(String(videoStream?.getWidth() ?? '0'), 10);
    const height = parseInt(String(videoStream?.getHeight() ?? '0'), 10);
    const frameRateStr = videoStream?.getAverageFrameRate() ?? videoStream?.getRealFrameRate() ?? '30/1';
    const [num, den] = frameRateStr.split('/').map(Number);
    const frameRate = den && den !== 0 ? num / den : num;
    return {
      duration,
      width,
      height,
      bitrate: parseInt(info.getBitrate() ?? '0', 10),
      frameRate: isFinite(frameRate) ? frameRate : 30,
      codec: videoStream?.getCodec() ?? 'unknown',
      size: parseInt(info.getSize() ?? '0', 10),
      hasAudio: !!audioStream,
      audioCodec: audioStream?.getCodec(),
      audioBitrate: audioStream ? parseInt(String(audioStream.getBitrate() ?? '0'), 10) : undefined,
      audioSampleRate: audioStream ? parseInt(String(audioStream.getSampleRate() ?? '0'), 10) : undefined,
    };
  }

  async getVideoMetadata(videoPath: string): Promise<VideoMetadata> {
    const info = await this.getVideoInfo(videoPath);
    return {
      duration: info.duration,
      width: info.width,
      height: info.height,
      bitrate: info.bitrate,
      frameRate: info.frameRate,
      codec: info.codec,
      size: info.size,
    };
  }

  async processClip(clip: Clip, workDir: string): Promise<string> {
    let current = clip.sourceUri;
    if (clip.trimStart > 0 || clip.trimEnd < clip.duration) {
      const trimmed = `${workDir}/trim_${clip.id}.mp4`;
      await this.trimVideo(clip.sourceUri, clip.trimStart, clip.trimEnd, trimmed);
      current = trimmed;
    }
    if (clip.speed !== 1.0) {
      const sped = `${workDir}/speed_${clip.id}.mp4`;
      await this.changeSpeed(current, clip.speed, sped);
      current = sped;
    }
    if (clip.filter.filterId !== 'none') {
      const filtered = `${workDir}/filter_${clip.id}.mp4`;
      await this.applyFilter(current, clip.filter.filterId, clip.filter.intensity, filtered);
      current = filtered;
    }
    const adj = clip.filter.adjustments;
    const hasAdj =
      adj.brightness !== 0 || adj.contrast !== 1 || adj.saturation !== 1 || adj.sharpness !== 0 || adj.temperature !== 0;
    if (hasAdj) {
      const adjusted = `${workDir}/adj_${clip.id}.mp4`;
      await this.applyColorAdjustment(current, adj, adjusted);
      current = adjusted;
    }
    if (clip.isMuted || clip.volume !== 1.0) {
      const audioed = `${workDir}/vol_${clip.id}.mp4`;
      const cmd = clip.isMuted
        ? `-y -i "${current}" -c:v copy -an "${audioed}"`
        : `-y -i "${current}" -filter:a "volume=${clip.volume.toFixed(2)}" -c:v copy "${audioed}"`;
      await this.run(cmd);
      current = audioed;
    }
    return current;
  }

  async exportVideo(
    clips: Clip[],
    textOverlays: TextOverlay[],
    audioTracks: AudioTrack[],
    settings: ExportSettings,
    outputPath: string,
    onProgress: ProgressHandler,
  ): Promise<string> {
    if (clips.length === 0) throw new Error('No clips to export');
    const workDir = `${RNFS.CachesDirectoryPath}/captcut_export_${Date.now()}`;
    await RNFS.mkdir(workDir);

    try {
      onProgress(0.01);
      const processedClips: string[] = [];
      for (let i = 0; i < clips.length; i++) {
        const processed = await this.processClip(clips[i], workDir);
        processedClips.push(processed);
        onProgress(0.05 + (0.5 * (i + 1)) / clips.length);
      }

      const mergedPath = `${workDir}/merged.mp4`;
      await this.mergeClips(processedClips, mergedPath);
      onProgress(0.6);

      let current = mergedPath;
      if (textOverlays.length > 0) {
        for (let i = 0; i < textOverlays.length; i++) {
          const overlay = textOverlays[i];
          const next = `${workDir}/text_${i}.mp4`;
          await this.addTextOverlay(
            current,
            {
              text: overlay.content,
              x: overlay.positionX,
              y: overlay.positionY,
              fontSize: overlay.fontSize,
              fontColor: overlay.color,
              shadow: overlay.shadow,
              borderWidth: overlay.stroke ? overlay.strokeWidth : undefined,
              borderColor: overlay.strokeColor,
            },
            next,
          );
          current = next;
          onProgress(0.6 + (0.15 * (i + 1)) / textOverlays.length);
        }
      } else {
        onProgress(0.75);
      }

      if (audioTracks.length > 0) {
        const tracks: AudioMixOption[] = audioTracks
          .filter(t => !t.isMuted)
          .map(t => ({
            uri: t.uri,
            startTime: t.startTime,
            duration: t.duration,
            volume: t.volume,
            fadeIn: t.fadeIn,
            fadeOut: t.fadeOut,
          }));
        if (tracks.length > 0) {
          const withAudio = `${workDir}/with_audio.mp4`;
          await this.addAudioTrack(current, tracks[0].uri, withAudio, {
            volume: tracks[0].volume,
            startOffset: tracks[0].startTime,
            replaceOriginal: false,
          });
          current = withAudio;
        }
      }
      onProgress(0.85);

      const resolved = RESOLUTIONS.find(r => r.value === settings.resolution) ?? RESOLUTIONS[2];
      const finalCmd = `-y -i "${current}" -vf "scale=${resolved.width}:${resolved.height}:force_original_aspect_ratio=decrease,pad=${resolved.width}:${resolved.height}:(ow-iw)/2:(oh-ih)/2" -r ${settings.frameRate} -c:v libx264 -preset medium -crf 20 -c:a aac -b:a 192k -movflags +faststart "${outputPath}"`;
      await this.run(finalCmd);
      onProgress(1);
      return outputPath;
    } finally {
      try {
        await RNFS.unlink(workDir);
      } catch {
        // best effort cleanup
      }
    }
  }

  async renderStickersStub(_stickers: StickerOverlay[], inputPath: string, outputPath: string): Promise<string> {
    await RNFS.copyFile(inputPath, outputPath);
    return outputPath;
  }
}

export const ffmpegService = new FFmpegService();
