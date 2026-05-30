import { useCallback, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import {
  check,
  request,
  RESULTS,
  PermissionStatus,
  Permission,
  openSettings,
} from 'react-native-permissions';
import { AppPermissions, PERMISSION_RATIONALES } from '@constants/permissions';

type PermissionKey = keyof typeof AppPermissions;
type RationaleKey = keyof typeof PERMISSION_RATIONALES;

const RATIONALE_MAP: Record<PermissionKey, RationaleKey> = {
  CAMERA: 'CAMERA',
  MICROPHONE: 'MICROPHONE',
  READ_MEDIA_VIDEO: 'MEDIA',
  READ_MEDIA_AUDIO: 'MEDIA',
  READ_MEDIA_IMAGES: 'MEDIA',
  WRITE_STORAGE: 'STORAGE',
};

export function usePermissions() {
  const [statuses, setStatuses] = useState<Partial<Record<PermissionKey, PermissionStatus>>>({});

  const checkOne = useCallback(async (key: PermissionKey): Promise<PermissionStatus> => {
    const perm = AppPermissions[key] as Permission;
    const status = await check(perm);
    setStatuses(s => ({ ...s, [key]: status }));
    return status;
  }, []);

  const requestOne = useCallback(async (key: PermissionKey): Promise<boolean> => {
    const perm = AppPermissions[key] as Permission;
    let status = await check(perm);

    if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
      setStatuses(s => ({ ...s, [key]: status }));
      return true;
    }
    if (status === RESULTS.BLOCKED) {
      const rationale = PERMISSION_RATIONALES[RATIONALE_MAP[key]];
      Alert.alert(rationale.title, `${rationale.message}\n\nPlease enable it from app settings.`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => openSettings().catch(() => Linking.openSettings()) },
      ]);
      setStatuses(s => ({ ...s, [key]: status }));
      return false;
    }
    status = await request(perm);
    setStatuses(s => ({ ...s, [key]: status }));
    return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
  }, []);

  const requestMany = useCallback(
    async (keys: PermissionKey[]): Promise<Record<PermissionKey, boolean>> => {
      const out = {} as Record<PermissionKey, boolean>;
      for (const k of keys) {
        out[k] = await requestOne(k);
      }
      return out;
    },
    [requestOne],
  );

  const ensureMediaAccess = useCallback(async (): Promise<boolean> => {
    const keys: PermissionKey[] = Platform.OS === 'android'
      ? ['READ_MEDIA_VIDEO', 'READ_MEDIA_AUDIO', 'READ_MEDIA_IMAGES']
      : ['READ_MEDIA_VIDEO'];
    const results = await requestMany(keys);
    return Object.values(results).every(Boolean);
  }, [requestMany]);

  return {
    statuses,
    check: checkOne,
    request: requestOne,
    requestMany,
    ensureMediaAccess,
  };
}
