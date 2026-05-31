import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Config from 'react-native-config';

const SUPABASE_URL = Config.SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = Config.SUPABASE_ANON_KEY ?? '';

const hasConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

if (!hasConfig) {
  console.warn('[Supabase] Missing SUPABASE_URL or SUPABASE_ANON_KEY — backend features disabled. Fill .env and restart Metro.');
}

export const supabase = hasConfig
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

export type SupabaseClient = typeof supabase;
