import React, { useMemo } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { TextOverlay } from '@types/editor.types';

interface Props {
  overlay: TextOverlay;
  currentTime: number;
  scale?: number;
}

export function TextOverlayLayer({ overlay, currentTime, scale = 1 }: Props) {
  const { width, height } = useWindowDimensions();
  const visible = currentTime >= overlay.startTime && currentTime <= overlay.endTime;

  const containerStyle = useMemo(() => {
    const baseFontSize = overlay.fontSize * overlay.scale * scale;
    return {
      position: 'absolute' as const,
      left: width * overlay.positionX,
      top: height * 0.4 * overlay.positionY,
      transform: [
        { translateX: -50 },
        { translateY: -baseFontSize / 2 },
        { rotate: `${overlay.rotation}deg` },
      ],
      backgroundColor: overlay.backgroundColor ?? 'transparent',
      paddingHorizontal: overlay.backgroundColor ? 8 : 0,
      paddingVertical: overlay.backgroundColor ? 4 : 0,
      borderRadius: 4,
    };
  }, [overlay, width, height, scale]);

  if (!visible) return null;

  return (
    <View style={containerStyle} pointerEvents="none">
      <Text
        style={{
          color: overlay.color,
          fontSize: overlay.fontSize * overlay.scale * scale,
          fontWeight: overlay.fontWeight === 'bold' ? '800' : '400',
          textAlign: overlay.alignment ?? 'center',
          textShadowColor: overlay.shadow ? 'rgba(0,0,0,0.6)' : 'transparent',
          textShadowOffset: overlay.shadow ? { width: 1, height: 1 } : { width: 0, height: 0 },
          textShadowRadius: overlay.shadow ? 3 : 0,
          letterSpacing: overlay.letterSpacing,
        }}
      >
        {overlay.content}
      </Text>
    </View>
  );
}

export const _styles = StyleSheet.create({});
