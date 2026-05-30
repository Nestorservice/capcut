import RNFS from 'react-native-fs';

export function getThumbnailDir(): string {
  return `${RNFS.CachesDirectoryPath}/captcut_thumbnails`;
}

export function getProjectThumbnailDir(projectId: string): string {
  return `${getThumbnailDir()}/${projectId}`;
}

export function getClipThumbnailDir(clipId: string): string {
  return `${getThumbnailDir()}/clips/${clipId}`;
}

export async function ensureThumbnailDir(dir: string): Promise<void> {
  const exists = await RNFS.exists(dir);
  if (!exists) {
    await RNFS.mkdir(dir);
  }
}

export function buildThumbnailUri(dir: string, index: number): string {
  return `${dir}/thumb_${index.toString().padStart(4, '0')}.jpg`;
}

export function nowFilenameTimestamp(): string {
  const d = new Date();
  return `${d.getFullYear()}${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${d.getDate().toString().padStart(2, '0')}_${d
    .getHours()
    .toString()
    .padStart(2, '0')}${d.getMinutes().toString().padStart(2, '0')}${d
    .getSeconds()
    .toString()
    .padStart(2, '0')}`;
}
