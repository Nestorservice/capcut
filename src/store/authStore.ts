import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { UserProfile } from '@types/user.types';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isHydrated: boolean;
  hasCompletedOnboarding: boolean;
  setSession: (session: Session | null, user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setHydrated: (hydrated: boolean) => void;
  completeOnboarding: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  session: null,
  user: null,
  profile: null,
  isLoading: false,
  isHydrated: false,
  hasCompletedOnboarding: false,
  setSession: (session, user) => set({ session, user }),
  setProfile: profile => set({ profile }),
  setHydrated: isHydrated => set({ isHydrated }),
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
  setLoading: isLoading => set({ isLoading }),
  reset: () =>
    set({
      session: null,
      user: null,
      profile: null,
      isLoading: false,
    }),
}));
