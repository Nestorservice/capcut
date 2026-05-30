export function formatTime(totalSeconds: number, includeMs = false): string {
  const safe = Math.max(0, isFinite(totalSeconds) ? totalSeconds : 0);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = Math.floor(safe % 60);
  const pad = (n: number) => n.toString().padStart(2, '0');

  if (includeMs) {
    const ms = Math.floor((safe - Math.floor(safe)) * 100);
    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(ms)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}.${pad(ms)}`;
  }

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

export function formatTimeCompact(seconds: number): string {
  const safe = Math.max(0, seconds);
  if (safe < 60) return `${Math.floor(safe)}s`;
  if (safe < 3600) {
    const m = Math.floor(safe / 60);
    const s = Math.floor(safe % 60);
    return s === 0 ? `${m}m` : `${m}m ${s}s`;
  }
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function parseTimecode(timecode: string): number {
  const parts = timecode.split(':').map(p => parseFloat(p));
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return parts[0] ?? 0;
}
