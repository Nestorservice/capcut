import React, { useMemo } from 'react';
import { Image, useWindowDimensions } from 'react-native';
import { StickerOverlay } from '@types/editor.types';

interface Props {
  overlay: StickerOverlay;
  currentTime: number;
}

export function StickerOverlayLayer({ overlay, currentTime }: Props) {
  const { width, height } = useWindowDimensions();
  const visible = currentTime >= overlay.startTime && currentTime <= overlay.endTime;

  const stickerSize = 80 * overlay.scale;

  const containerStyle = useMemo(
    () => ({
      position: 'absolute' as const,
      left: width * overlay.positionX - stickerSize / 2,
      top: height * 0.4 * overlay.positionY - stickerSize / 2,
      width: stickerSize,
      height: stickerSize,
      transform: [{ rotate: `${overlay.rotation}deg` }],
    }),
    [overlay, width, height, stickerSize],
  );

  if (!visible) return null;

  return (
    <Image source={{ uri: overlay.stickerUrl }} style={containerStyle} resizeMode="contain" />
  );
}
