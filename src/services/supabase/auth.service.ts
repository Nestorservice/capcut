import { Session, User } from '@supabase/supabase-js';
import { supabase } from './client';

const noClient = (): never => { throw new Error('Supabase not configured — fill SUPABASE_URL and SUPABASE_ANON_KEY in .env'); };
const db = () => supabase ?? noClient();

export const authService = {
  async signInAnonymously(): Promise<{ user: User; session: Session }> {
    const { data, error } = await db().auth.signInAnonymously();
    if (error) throw error;
    if (!data.user || !data.session) throw new Error('Anonymous sign in returned no user');
    return { user: data.user, session: data.session };
  },

  async signOut(): Promise<void> {
    const { error } = await db().auth.signOut();
    if (error) throw error;
  },

  async getSession(): Promise<Session | null> {
    const { data, error } = await db().auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await db().auth.getUser();
    if (error) return null;
    return data.user;
  },

  onAuthStateChange(callback: (session: Session | null) => void): () => void {
    const { data } = db().auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  },
};
