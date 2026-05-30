import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@store/authStore';
import { authService } from '@services/supabase/auth.service';
import { usersService } from '@services/supabase/users.service';
import { useUIStore } from '@store/uiStore';
import { AuthCredentials, SignUpCredentials } from '@types/user.types';

export function useAuth() {
  const {
    session,
    user,
    profile,
    isLoading,
    isHydrated,
    setSession,
    setProfile,
    setHydrated,
    setLoading,
    reset,
  } = useAuthStore();
  const showToast = useUIStore(s => s.showToast);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const current = await authService.getSession();
        if (!active) return;
        setSession(current, current?.user ?? null);
        if (current?.user) {
          try {
            const p = await usersService.getProfile(current.user.id);
            if (active) setProfile(p);
          } catch (e) {
            console.warn('Failed to load profile', e);
          }
        }
      } finally {
        if (active) setHydrated(true);
      }
    })();
    const unsub = authService.onAuthStateChange(async s => {
      setSession(s, s?.user ?? null);
      if (s?.user) {
        try {
          const p = await usersService.getProfile(s.user.id);
          setProfile(p);
        } catch {
          // ignore
        }
      } else {
        setProfile(null);
      }
    });
    return () => {
      active = false;
      unsub();
    };
  }, [setHydrated, setProfile, setSession]);

  const signIn = useCallback(
    async (creds: AuthCredentials) => {
      setLoading(true);
      try {
        await authService.signInWithEmail(creds);
      } catch (e) {
        showToast((e as Error).message, 'error');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, showToast],
  );

  const signUp = useCallback(
    async (creds: SignUpCredentials) => {
      setLoading(true);
      try {
        await authService.signUpWithEmail(creds);
        showToast('Account created. Check your email to verify.', 'success');
      } catch (e) {
        showToast((e as Error).message, 'error');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, showToast],
  );

  const signOut = useCallback(async () => {
    try {
      await authService.signOut();
      reset();
    } catch (e) {
      showToast((e as Error).message, 'error');
    }
  }, [reset, showToast]);

  return {
    session,
    user,
    profile,
    isLoading,
    isHydrated,
    isAuthenticated: !!session,
    signIn,
    signUp,
    signOut,
  };
}
