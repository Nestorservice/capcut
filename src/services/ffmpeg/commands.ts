import { ColorAdjustments } from '@types/editor.types';
import { getFilterById } from '@constants/filters';
import { getTransitionById } from '@constants/transitions';

const escape = (s: string): string => `"${s.replace(/"/g, '\\"')}"`;

export const ffmpegCommands = {
  probe(inputPath: string): string {
    return `-v error -show_format -show_streams -of json ${escape(inputPath)}`;
  },

  trim(inputPath: string, startTime: number, endTime: number, outputPath: string): string {
    const duration = Math.max(0.1, endTime - startTime);
    return `-y -ss ${startTime.toFixed(3)} -i ${escape(inputPath)} -t ${duration.toFixed(3)} -c:v libx264 -preset veryfast -crf 23 -c:a aac -b:a 128k ${escape(outputPath)}`;
  },

  splitToTwo(inputPath: string, splitTime: number, leftOut: string, rightOut: string): string[] {
    return [
      `-y -i ${escape(inputPath)} -t ${splitTime.toFixed(3)} -c:v libx264 -preset veryfast -crf 23 -c:a aac ${escape(leftOut)}`,
      `-y -ss ${splitTime.toFixed(3)} -i ${escape(inputPath)} -c:v libx264 -preset veryfast -crf 23 -c:a aac ${escape(rightOut)}`,
    ];
  },

  concat(listFilePath: string, outputPath: string): string {
    return `-y -f concat -safe 0 -i ${escape(listFilePath)} -c copy ${escape(outputPath)}`;
  },

  reencodeConcat(inputs: string[], outputPath: string): string {
    const inputArgs = inputs.map(p => `-i ${escape(p)}`).join(' ');
    const n = inputs.length;
    const filter = inputs.map((_, i) => `[${i}:v:0][${i}:a:0]`).join('') + `concat=n=${n}:v=1:a=1[v][a]`;
    return `-y ${inputArgs} -filter_complex "${filter}" -map "[v]" -map "[a]" -c:v libx264 -preset veryfast -crf 23 -c:a aac -b:a 128k ${escape(outputPath)}`;
  },

  changeSpeed(inputPath: string, speed: number, outputPath: string): string {
    const safe = Math.max(0.1, Math.min(100, speed));
    const vSetpts = (1 / safe).toFixed(4);
    let audioChain = '';
    let remaining = safe;
    const atempos: string[] = [];
    while (remaining > 2.0) {
      atempos.push('atempo=2.0');
      remaining /= 2.0;
    }
    while (remaining < 0.5) {
      atempos.push('atempo=0.5');
      remaining /= 0.5;
    }
    atempos.push(`atempo=${remaining.toFixed(4)}`);
    audioChain = atempos.join(',');
    return `-y -i ${escape(inputPath)} -filter_complex "[0:v]setpts=${vSetpts}*PTS[v];[0:a]${audioChain}[a]" -map "[v]" -map "[a]" -c:v libx264 -preset veryfast -crf 23 -c:a aac ${escape(outputPath)}`;
  },

  extractAudio(videoPath: string, outputPath: string): string {
    return `-y -i ${escape(videoPath)} -vn -acodec libmp3lame -b:a 192k ${escape(outputPath)}`;
  },

  removeAudio(videoPath: string, outputPath: string): string {
    return `-y -i ${escape(videoPath)} -c:v copy -an ${escape(outputPath)}`;
  },

  addAudioTrack(
    videoPath: string,
    audioPath: string,
    outputPath: string,
    options: { volume?: number; replace?: boolean; offset?: number },
  ): string {
    const vol = options.volume ?? 1.0;
    const offset = options.offset ?? 0;
    if (options.replace) {
      return `-y -i ${escape(videoPath)} -itsoffset ${offset.toFixed(3)} -i ${escape(audioPath)} -c:v copy -filter_complex "[1:a]volume=${vol.toFixed(2)}[a]" -map 0:v:0 -map "[a]" -shortest ${escape(outputPath)}`;
    }
    return `-y -i ${escape(videoPath)} -itsoffset ${offset.toFixed(3)} -i ${escape(audioPath)} -filter_complex "[0:a]volume=1.0[a0];[1:a]volume=${vol.toFixed(2)}[a1];[a0][a1]amix=inputs=2:duration=longest[a]" -map 0:v:0 -map "[a]" -c:v copy ${escape(outputPath)}`;
  },

  applyFilter(inputPath: string, filterId: string, intensity: number, outputPath: string): string {
    const filter = getFilterById(filterId);
    if (!filter.filterGraph) {
      return `-y -i ${escape(inputPath)} -c copy ${escape(outputPath)}`;
    }
    const intensityClamped = Math.max(0, Math.min(1, intensity));
    const filterGraph =
      intensityClamped < 1
        ? `split[a][b];[a]${filter.filterGraph}[filtered];[b][filtered]blend=all_opacity=${intensityClamped.toFixed(2)}`
        : filter.filterGraph;
    return `-y -i ${escape(inputPath)} -vf "${filterGraph}" -c:v libx264 -preset veryfast -crf 23 -c:a copy ${escape(outputPath)}`;
  },

  applyColorAdjustment(inputPath: string, adj: ColorAdjustments, outputPath: string): string {
    const eq = `eq=brightness=${adj.brightness.toFixed(2)}:contrast=${adj.contrast.toFixed(2)}:saturation=${adj.saturation.toFixed(2)}`;
    const parts = [eq];
    if (adj.sharpness !== 0) {
      const amount = (adj.sharpness * 2).toFixed(2);
      parts.push(`unsharp=5:5:${amount}:5:5:0`);
    }
    if (adj.temperature !== 0) {
      const r = (1 + adj.temperature * 0.3).toFixed(2);
      const b = (1 - adj.temperature * 0.3).toFixed(2);
      parts.push(`colorchannelmixer=rr=${r}:bb=${b}`);
    }
    const chain = parts.join(',');
    return `-y -i ${escape(inputPath)} -vf "${chain}" -c:v libx264 -preset veryfast -crf 23 -c:a copy ${escape(outputPath)}`;
  },

  addTextOverlay(
    inputPath: string,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    fontColor: string,
    outputPath: string,
    options?: { startTime?: number; endTime?: number; shadow?: boolean; borderWidth?: number; borderColor?: string },
  ): string {
    const escTxt = text.replace(/'/g, "\\'").replace(/:/g, '\\:').replace(/%/g, '\\%');
    const fontColorClean = fontColor.replace('#', '');
    const parts = [
      `text='${escTxt}'`,
      `fontsize=${fontSize}`,
      `fontcolor=0x${fontColorClean}`,
      `x=(w-text_w)*${x.toFixed(3)}`,
      `y=(h-text_h)*${y.toFixed(3)}`,
    ];
    if (options?.shadow) {
      parts.push('shadowcolor=black@0.5', 'shadowx=2', 'shadowy=2');
    }
    if (options?.borderWidth) {
      parts.push(`borderw=${options.borderWidth}`, `bordercolor=0x${(options.borderColor ?? '#000000').replace('#', '')}`);
    }
    if (options?.startTime !== undefined && options?.endTime !== undefined) {
      parts.push(`enable='between(t,${options.startTime.toFixed(3)},${options.endTime.toFixed(3)})'`);
    }
    return `-y -i ${escape(inputPath)} -vf "drawtext=${parts.join(':')}" -c:v libx264 -preset veryfast -crf 23 -c:a copy ${escape(outputPath)}`;
  },

  applyTransition(
    inputA: string,
    inputB: string,
    transitionId: string,
    offset: number,
    duration: number,
    outputPath: string,
  ): string {
    const t = getTransitionById(transitionId);
    if (!t.xfadeName) {
      return this.reencodeConcat([inputA, inputB], outputPath);
    }
    const filter = `[0:v][1:v]xfade=transition=${t.xfadeName}:duration=${duration.toFixed(2)}:offset=${offset.toFixed(2)}[v];[0:a][1:a]acrossfade=d=${duration.toFixed(2)}[a]`;
    return `-y -i ${escape(inputA)} -i ${escape(inputB)} -filter_complex "${filter}" -map "[v]" -map "[a]" -c:v libx264 -preset veryfast -crf 23 -c:a aac ${escape(outputPath)}`;
  },

  changeResolution(inputPath: string, width: number, height: number, outputPath: string): string {
    return `-y -i ${escape(inputPath)} -vf "scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -preset veryfast -crf 23 -c:a copy ${escape(outputPath)}`;
  },

  changeFrameRate(inputPath: string, fps: number, outputPath: string): string {
    return `-y -i ${escape(inputPath)} -r ${fps} -c:v libx264 -preset veryfast -crf 23 -c:a copy ${escape(outputPath)}`;
  },

  changeAspectRatio(inputPath: string, width: number, height: number, outputPath: string): string {
    return `-y -i ${escape(inputPath)} -vf "scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height}" -c:v libx264 -preset veryfast -crf 23 -c:a copy ${escape(outputPath)}`;
  },

  generateThumbnail(videoPath: string, atTime: number, outputPath: string): string {
    return `-y -ss ${atTime.toFixed(3)} -i ${escape(videoPath)} -vframes 1 -q:v 3 -vf "scale=320:-2" ${escape(outputPath)}`;
  },

  generateThumbnailStrip(videoPath: string, count: number, fps: number, outputPattern: string): string {
    return `-y -i ${escape(videoPath)} -vf "fps=${fps.toFixed(4)},scale=160:-2" -vsync vfr -q:v 4 -frames:v ${count} ${escape(outputPattern)}`;
  },

  reverse(videoPath: string, outputPath: string): string {
    return `-y -i ${escape(videoPath)} -vf reverse -af areverse -c:v libx264 -preset veryfast -crf 23 -c:a aac ${escape(outputPath)}`;
  },
};
