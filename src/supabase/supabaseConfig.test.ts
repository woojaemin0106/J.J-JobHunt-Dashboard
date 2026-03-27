import { describe, expect, it } from "vitest";
import {
  normalizeSupabaseUrl,
  validateSupabaseConfig,
} from "./supabaseConfig";

describe("supabaseConfig", () => {
  it("값이 누락되었을 때 에러를 반환해야 함", () => {
    expect(validateSupabaseConfig(undefined, undefined)).not.toBeNull();
    expect(validateSupabaseConfig("", "some-key")).not.toBeNull();
    expect(validateSupabaseConfig("https://project.supabase.co", "")).not.toBeNull();
  });

  it("플레이스홀더(기본값)를 그대로 사용하면 에러를 반환해야 함", () => {
    // 실제 .env에 적힌 예시 값들이 들어오면 거부해야 합니다.
    expect(
      validateSupabaseConfig("https://your-project.supabase.co", "your-anon-key")
    ).not.toBeNull();
  });

  it("잘못된 형식이나 보안에 취약한(http) URL은 에러를 반환해야 함", () => {
    expect(validateSupabaseConfig("not-a-url", "eyJhbGci...")).not.toBeNull();
    expect(validateSupabaseConfig("http://project.supabase.co", "eyJhbGci...")).not.toBeNull();
  });

  it("올바른 설정(실제 JWT 형식의 키)을 수용해야 함", () => {
    expect(
      validateSupabaseConfig(
        "https://seqwntckorouwjjimquq.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.signature" // 실제 JWT 형식
      )
    ).toBeNull(); // 에러가 없어야(null) 통과
  });

  it("URL을 origin 형태로 정규화해야 함", () => {
    expect(
      normalizeSupabaseUrl("https://project-id.supabase.co/rest/v1")
    ).toBe("https://project-id.supabase.co");
  });
});