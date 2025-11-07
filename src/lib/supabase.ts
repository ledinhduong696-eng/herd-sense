import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const supabaseHeartUrl = import.meta.env.VITE_SUPABASE_URL_HEART
const supabaseHeartAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY_HEART
export const supabaseHeart = createClient(supabaseHeartUrl, supabaseHeartAnonKey)