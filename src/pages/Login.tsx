import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthActions } from "../store/authStore";
import { isSupabaseConfigured } from "../supabase/supabase";
import { demoAuthConfig } from "../config/demoAuth";
import { ERROR_MESSAGES } from "../utils/errorMessages";
import { ui } from "../utils/ui";

export default function Login() {
  const navigate = useNavigate();
  const { login, continueAsGuest } = useAuthActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isDemoLoginVisible = isSupabaseConfigured && demoAuthConfig.isVisible;
  const demoSetupHintMessage =
    !isSupabaseConfigured || isDemoLoginVisible
      ? null
      : !demoAuthConfig.enabled
      ? "데모 로그인을 사용하려면 VITE_DEMO_ENABLED=true를 설정하세요."
      : !demoAuthConfig.email
      ? "VITE_DEMO_EMAIL을 설정하면 데모 로그인 버튼이 표시됩니다."
      : !demoAuthConfig.password
      ? "VITE_DEMO_PASSWORD를 설정하면 데모 로그인 버튼이 표시됩니다."
      : "데모 로그인 설정을 확인하세요.";

  const attemptLogin = async (
    nextEmail: string,
    nextPassword: string,
    fallbackMessage: string
  ) => {
    setIsLoading(true);

    try {
      const success = await login(nextEmail, nextPassword);
      if (success) {
        navigate("/");
      } else {
        setError(fallbackMessage);
      }
    } catch {
      setError(ERROR_MESSAGES.auth.retry);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!isSupabaseConfigured) {
      setError(ERROR_MESSAGES.auth.serviceUnavailable);
      return;
    }

    await attemptLogin(
      email.trim(),
      password,
      ERROR_MESSAGES.auth.invalidCredentials
    );
  };

  const handleDemoLogin = async () => {
    setError("");
    if (!isDemoLoginVisible) return;

    await attemptLogin(
      demoAuthConfig.email,
      demoAuthConfig.password,
      ERROR_MESSAGES.auth.demoLoginFailed
    );
  };

  const handleGuestLogin = () => {
    setError("");
    continueAsGuest();
    navigate("/");
  };

  return (
    <div className={ui.page} data-testid="login-page">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <section className="relative overflow-hidden rounded-[32px] border border-slate-200/70 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 p-6 text-white shadow-[var(--jj-shadow-soft)] sm:p-8">
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan-300/20 blur-2xl" />
          <div className="absolute -left-14 bottom-0 h-36 w-36 rounded-full bg-blue-300/20 blur-2xl" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
              Interview demo mode
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              5분 안에 핵심 흐름을 보여주는 취업 준비 대시보드
            </h1>
            <p className="mt-3 max-w-xl text-sm text-cyan-100/95 sm:text-base">
              로그인 후 지원 현황, 이력서 버전, 메모, 통계를 한 번에 탐색할 수
              있습니다. 면접 데모 동선에 맞춰 화면을 최적화했습니다.
            </p>
            <div className="mt-6 grid gap-2 text-sm text-cyan-50/95">
              <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-2">
                1. 로그인 또는 데모 계정으로 즉시 진입
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-2">
                2. 지원 현황 보드에서 진행 상태 확인
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-2">
                3. 이력서/메모/통계 화면으로 관리 역량 증명
              </div>
            </div>
          </div>
        </section>

        <section className={`${ui.card} self-center p-6 sm:p-7`}>
          <div className="mb-6">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              로그인
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              계정 정보로 로그인해 개인 대시보드를 이어서 사용하세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-semibold text-slate-600">
                이메일
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={ui.input}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="text-xs font-semibold text-slate-600"
              >
                비밀번호
              </label>
              <input
                id="login-password"
                type="password"
                required
                minLength={4}
                autoComplete="current-password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={ui.input}
              />
            </div>

            {error ? (
              <div
                role="alert"
                data-testid="login-error-message"
                className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
              >
                {error}
              </div>
            ) : null}

            {!isSupabaseConfigured && !error ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                {ERROR_MESSAGES.auth.serviceUnavailable}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isLoading || !isSupabaseConfigured}
              data-testid="login-submit-button"
              className={`${ui.btnPrimary} w-full disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <div
            className="mt-4 space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4"
            data-testid="guest-login-notice"
          >
            <p className="text-sm text-emerald-700">
              계정 없이도 면접용 화면을 바로 체험할 수 있습니다.
            </p>
            <button
              type="button"
              data-testid="guest-login-button"
              disabled={isLoading}
              onClick={handleGuestLogin}
              className={`${ui.btnSecondary} w-full justify-center disabled:cursor-not-allowed disabled:opacity-60`}
            >
              게스트로 바로 입장
            </button>
          </div>

          {isDemoLoginVisible ? (
            <div
              className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
              data-testid="demo-login-notice"
            >
              <p className="text-sm text-slate-600">
                데모 계정은 면접 시연 전용이며 비민감 샘플 데이터만 포함합니다.
              </p>
              <button
                type="button"
                data-testid="demo-login-button"
                disabled={isLoading}
                onClick={handleDemoLogin}
                className={`${ui.btnSecondary} w-full justify-center disabled:cursor-not-allowed disabled:opacity-60`}
              >
                데모로 바로 보기
              </button>
            </div>
          ) : null}

          {demoSetupHintMessage ? (
            <div
              className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-700"
              data-testid="demo-login-setup-hint"
            >
              {demoSetupHintMessage}
            </div>
          ) : null}

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <p className="text-sm text-slate-500">아직 계정이 없다면 회원가입을 진행하세요.</p>
            <Link
              to="/signup"
              data-testid="go-signup-link"
              className="mt-2 inline-block text-sm font-semibold text-[color:var(--jj-color-brand)] hover:underline"
            >
              회원가입으로 이동
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
