import { ColorAdjustments } from '@types/editor.types';

export function buildEqFilter(adj: Partial<ColorAdjustments>): string {
  const brightness = adj.brightness ?? 0;
  const contrast = adj.contrast ?? 1;
  const saturation = adj.saturation ?? 1;
  return `eq=brightness=${brightness.toFixed(2)}:contrast=${contrast.toFixed(2)}:saturation=${saturation.toFixed(2)}`;
}

export function buildScaleFilter(width: number, height: number): string {
  return `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:black`;
}

export function buildFadeFilter(direction: 'in' | 'out', startTime: number, duration: number): string {
  return `fade=t=${direction}:st=${startTime.toFixed(2)}:d=${duration.toFixed(2)}`;
}
