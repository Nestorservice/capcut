import { supabase } from './client';
import { UserProfile } from '@types/user.types';

export const usersService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    return data as UserProfile | null;
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data as UserProfile;
  },

  async updateStorageUsed(userId: string, bytes: number): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ storage_used: bytes, updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (error) throw error;
  },

  async checkUsernameAvailable(username: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle();
    if (error) throw error;
    return data === null;
  },
};
