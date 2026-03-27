import { describe, expect, it } from "vitest";
import { resolveDemoAuthConfig } from "./demoAuth";

describe("demoAuth config", () => {
  it("stays hidden when demo mode is disabled", () => {
    const config = resolveDemoAuthConfig({
      enabled: "false",
      email: "demo@example.com",
      password: "password",
    });

    expect(config.enabled).toBe(false);
    expect(config.isVisible).toBe(false);
  });

  it("stays hidden when required credentials are missing", () => {
    const missingEmail = resolveDemoAuthConfig({
      enabled: "true",
      email: "",
      password: "password",
    });

    const missingPassword = resolveDemoAuthConfig({
      enabled: "true",
      email: "demo@example.com",
      password: "",
    });

    expect(missingEmail.isVisible).toBe(false);
    expect(missingPassword.isVisible).toBe(false);
  });

  it("shows demo login when enabled and credentials exist", () => {
    const config = resolveDemoAuthConfig({
      enabled: "true",
      email: "  demo@example.com  ",
      password: "  pass1234  ",
    });

    expect(config.enabled).toBe(true);
    expect(config.email).toBe("demo@example.com");
    expect(config.password).toBe("pass1234");
    expect(config.isVisible).toBe(true);
  });
});
