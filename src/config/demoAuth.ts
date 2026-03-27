type DemoAuthEnv = {
  enabled: string | undefined;
  email: string | undefined;
  password: string | undefined;
};

export type DemoAuthConfig = {
  enabled: boolean;
  email: string;
  password: string;
  isVisible: boolean;
};

export function resolveDemoAuthConfig(env: DemoAuthEnv): DemoAuthConfig {
  const enabled = env.enabled?.trim().toLowerCase() === "true";
  const email = env.email?.trim() ?? "";
  const password = env.password?.trim() ?? "";
  const isVisible = enabled && email.length > 0 && password.length > 0;

  return {
    enabled,
    email,
    password,
    isVisible,
  };
}

export const demoAuthConfig = resolveDemoAuthConfig({
  enabled: import.meta.env.VITE_DEMO_ENABLED,
  email: import.meta.env.VITE_DEMO_EMAIL,
  password: import.meta.env.VITE_DEMO_PASSWORD,
});
