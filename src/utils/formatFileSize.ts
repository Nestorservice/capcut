const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

export function formatFileSize(bytes: number, decimals = 1): string {
  if (!isFinite(bytes) || bytes <= 0) return '0 B';
  const i = Math.min(UNITS.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(i === 0 ? 0 : decimals)} ${UNITS[i]}`;
}

export function formatBitrate(bitsPerSecond: number): string {
  if (!isFinite(bitsPerSecond) || bitsPerSecond <= 0) return '0 bps';
  if (bitsPerSecond >= 1_000_000) return `${(bitsPerSecond / 1_000_000).toFixed(1)} Mbps`;
  if (bitsPerSecond >= 1_000) return `${(bitsPerSecond / 1_000).toFixed(1)} Kbps`;
  return `${bitsPerSecond} bps`;
}
