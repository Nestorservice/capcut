import { useCallback, useMemo } from 'react';
import { useEditorStore } from '@store/editorStore';
import { Keyframe, KeyframeProperties, InterpolationType } from '@types/editor.types';
import { lerp, uuid } from '@utils/index';

const easeIn = (t: number): number => t * t;
const easeOut = (t: number): number => 1 - (1 - t) * (1 - t);
const easeInOut = (t: number): number => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function applyInterpolation(t: number, type: InterpolationType): number {
  switch (type) {
    case 'ease-in':
      return easeIn(t);
    case 'ease-out':
      return easeOut(t);
    case 'bezier':
      return easeInOut(t);
    default:
      return t;
  }
}

function interpolateProperties(
  a: KeyframeProperties,
  b: KeyframeProperties,
  t: number,
): KeyframeProperties {
  const out: KeyframeProperties = {};
  const keys = new Set<keyof KeyframeProperties>([
    ...(Object.keys(a) as (keyof KeyframeProperties)[]),
    ...(Object.keys(b) as (keyof KeyframeProperties)[]),
  ]);
  for (const key of keys) {
    const av = a[key];
    const bv = b[key];
    if (typeof av === 'number' && typeof bv === 'number') {
      out[key] = lerp(av, bv, t);
    } else if (typeof bv === 'number') {
      out[key] = bv;
    } else if (typeof av === 'number') {
      out[key] = av;
    }
  }
  return out;
}

export function useKeyframe(targetId: string | null) {
  const allKeyframes = useEditorStore(s => s.keyframes);
  const addKeyframe = useEditorStore(s => s.addKeyframe);
  const removeKeyframe = useEditorStore(s => s.removeKeyframe);
  const updateKeyframe = useEditorStore(s => s.updateKeyframe);

  const keyframes = useMemo(
    () => (targetId ? allKeyframes.filter(k => k.targetId === targetId).sort((a, b) => a.time - b.time) : []),
    [allKeyframes, targetId],
  );

  const insertKeyframe = useCallback(
    (time: number, properties: KeyframeProperties, interpolation: InterpolationType = 'linear', targetType: Keyframe['targetType'] = 'clip') => {
      if (!targetId) return;
      addKeyframe({ id: uuid(), time, targetId, targetType, properties, interpolation });
    },
    [addKeyframe, targetId],
  );

  const propertiesAtTime = useCallback(
    (time: number): KeyframeProperties => {
      if (keyframes.length === 0) return {};
      if (time <= keyframes[0].time) return keyframes[0].properties;
      if (time >= keyframes[keyframes.length - 1].time) return keyframes[keyframes.length - 1].properties;
      for (let i = 0; i < keyframes.length - 1; i++) {
        const a = keyframes[i];
        const b = keyframes[i + 1];
        if (time >= a.time && time <= b.time) {
          const localT = (time - a.time) / Math.max(0.001, b.time - a.time);
          return interpolateProperties(a.properties, b.properties, applyInterpolation(localT, b.interpolation));
        }
      }
      return keyframes[keyframes.length - 1].properties;
    },
    [keyframes],
  );

  return {
    keyframes,
    insertKeyframe,
    removeKeyframe,
    updateKeyframe,
    propertiesAtTime,
  };
}
