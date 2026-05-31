import { Session, User } from '@supabase/supabase-js';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import { supabase } from './client';
import { SignUpCredentials, AuthCredentials } from '@types/user.types';

GoogleSignin.configure({
  webClientId: Config.GOOGLE_WEB_CLIENT_ID ?? '',
  scopes: ['email', 'profile'],
});

const noClient = (): never => { throw new Error('Supabase not configured — fill SUPABASE_URL and SUPABASE_ANON_KEY in .env'); };
const db = () => supabase ?? noClient();

export const authService = {
  async signInWithEmail(credentials: AuthCredentials): Promise<{ user: User; session: Session }> {
    const { data, error } = await db().auth.signInWithPassword(credentials);
    if (error) throw error;
    if (!data.user || !data.session) throw new Error('Sign in returned no user');
    return { user: data.user, session: data.session };
  },

  async signUpWithEmail(credentials: SignUpCredentials): Promise<{ user: User | null; session: Session | null }> {
    const { data, error } = await db().auth.signUp({
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

  async signInWithGoogle(): Promise<{ user: User; session: Session }> {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const signInResult = await GoogleSignin.signIn();
    const idToken = signInResult.data?.idToken;
    if (!idToken) throw new Error('No ID token from Google');
    const { data, error } = await db().auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });
    if (error) throw error;
    if (!data.user || !data.session) throw new Error('Google sign in returned no user');
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

  async resetPassword(email: string): Promise<void> {
    const { error } = await db().auth.resetPasswordForEmail(email);
    if (error) throw error;
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
