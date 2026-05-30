import { Session, User } from '@supabase/supabase-js';
import { supabase } from './client';
import { SignUpCredentials, AuthCredentials } from '@types/user.types';

export const authService = {
  async signInWithEmail(credentials: AuthCredentials): Promise<{ user: User; session: Session }> {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw error;
    if (!data.user || !data.session) throw new Error('Sign in returned no user');
    return { user: data.user, session: data.session };
  },

  async signUpWithEmail(credentials: SignUpCredentials): Promise<{ user: User | null; session: Session | null }> {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          username: credentials.username,
          full_name: credentials.display_name ?? credentials.username,
        },
      },
    });
    if (error) throw error;
    return { user: data.user, session: data.session };
  },

  async signInWithGoogle(idToken: string): Promise<{ user: User; session: Session }> {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });
    if (error) throw error;
    if (!data.user || !data.session) throw new Error('Google sign in returned no user');
    return { user: data.user, session: data.session };
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data.user;
  },

  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  onAuthStateChange(callback: (session: Session | null) => void): () => void {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  },
};
