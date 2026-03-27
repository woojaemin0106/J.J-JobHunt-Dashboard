import { describe, expect, it } from "vitest";
import {
  normalizeSupabaseUrl,
  validateSupabaseConfig,
} from "./supabaseConfig";

describe("supabaseConfig", () => {
  it("returns error when env values are missing", () => {
    expect(validateSupabaseConfig(undefined, undefined)).not.toBeNull();
    expect(validateSupabaseConfig("", "anon-key")).not.toBeNull();
    expect(validateSupabaseConfig("https://project.supabase.co", "")).not.toBeNull();
  });

  it("returns error when placeholder values are used", () => {
    expect(
      validateSupabaseConfig("https://your-project.supabase.co", "anon-key")
    ).not.toBeNull();
    expect(
      validateSupabaseConfig("https://project.supabase.co", "your-anon-key")
    ).not.toBeNull();
  });

  it("returns error for malformed or insecure url", () => {
    expect(validateSupabaseConfig("not-a-url", "anon-key")).not.toBeNull();
    expect(validateSupabaseConfig("http://project.supabase.co", "anon-key")).not.toBeNull();
  });

  it("accepts valid configuration", () => {
    expect(
      validateSupabaseConfig(
        "https://project-id.supabase.co/",
        "sb_publishable_dummy_key"
      )
    ).toBeNull();
  });

  it("normalizes url to origin", () => {
    expect(
      normalizeSupabaseUrl("https://project-id.supabase.co/rest/v1")
    ).toBe("https://project-id.supabase.co");
  });
});
