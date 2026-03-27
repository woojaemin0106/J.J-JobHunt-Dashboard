import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  normalizeSupabaseUrl,
  validateSupabaseConfig,
} from "./supabaseConfig";

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigError = validateSupabaseConfig(
  rawSupabaseUrl,
  rawSupabaseAnonKey
);
export const isSupabaseConfigured = supabaseConfigError === null;

const normalizedSupabaseUrl = isSupabaseConfigured
  ? normalizeSupabaseUrl(rawSupabaseUrl!)
  : null;
const normalizedSupabaseAnonKey = isSupabaseConfigured
  ? rawSupabaseAnonKey!.trim()
  : null;

if (supabaseConfigError) {
  console.error(`[supabase] ${supabaseConfigError}`);
}

export const supabase: SupabaseClient | null =
  normalizedSupabaseUrl && normalizedSupabaseAnonKey
    ? createClient(normalizedSupabaseUrl, normalizedSupabaseAnonKey)
    : null;
