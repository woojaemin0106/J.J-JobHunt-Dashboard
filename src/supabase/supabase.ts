// src/utils/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Vite 환경 변수에서 값을 가져옵니다.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL 또는 Anon Key가 설정되지 않았습니다. .env 파일을 확인해주세요.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);