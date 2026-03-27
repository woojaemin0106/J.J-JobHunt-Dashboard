const PLACEHOLDER_SUPABASE_URL = "https://your-project.supabase.co";
const PLACEHOLDER_SUPABASE_ANON_KEY = "your-anon-key";

export function validateSupabaseConfig(
  supabaseUrl: string | undefined,
  supabaseAnonKey: string | undefined
): string | null {
  const normalizedUrl = supabaseUrl?.trim();
  const normalizedAnonKey = supabaseAnonKey?.trim();

  if (!normalizedUrl || !normalizedAnonKey) {
    return "Supabase URL 또는 Anon Key가 설정되지 않았습니다. .env 파일을 확인해주세요.";
  }

  if (
    normalizedUrl === PLACEHOLDER_SUPABASE_URL ||
    normalizedAnonKey === PLACEHOLDER_SUPABASE_ANON_KEY
  ) {
    return "Supabase 환경 변수가 예시 값입니다. 실제 프로젝트 값을 설정해주세요.";
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(normalizedUrl);
  } catch {
    return "Supabase URL 형식이 올바르지 않습니다. https://<project>.supabase.co 형식인지 확인해주세요.";
  }

  if (parsedUrl.protocol !== "https:") {
    return "Supabase URL은 https 프로토콜이어야 합니다.";
  }

  if (!parsedUrl.hostname) {
    return "Supabase URL 호스트가 비어 있습니다.";
  }

  return null;
}

export function normalizeSupabaseUrl(supabaseUrl: string): string {
  return new URL(supabaseUrl.trim()).origin;
}
