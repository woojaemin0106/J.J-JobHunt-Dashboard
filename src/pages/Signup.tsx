import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StatusBanner } from "../components/StateCards";
import { useAuthActions } from "../store/authStore";
import { isSupabaseConfigured } from "../supabase/supabase";
import { ERROR_MESSAGES } from "../utils/errorMessages";
import { ui } from "../utils/ui";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuthActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!isSupabaseConfigured) {
      setError(ERROR_MESSAGES.auth.serviceUnavailable);
      return;
    }

    setIsLoading(true);

    try {
      const success = await signup(email.trim(), password, name.trim());
      if (success) {
        navigate("/");
      } else {
        setError(ERROR_MESSAGES.auth.signupFailed);
      }
    } catch {
      setError(ERROR_MESSAGES.auth.retry);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={ui.page} data-testid="signup-page">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <section className={`${ui.card} self-center p-6 sm:p-7`}>
          <div className="mb-6">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              회원가입
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              이메일 계정을 만들고 취업 준비 데이터를 개인 스코프로 관리하세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" data-testid="signup-form">
            <div className="space-y-1.5">
              <label htmlFor="signup-name" className="text-xs font-semibold text-slate-600">
                이름 (선택)
              </label>
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                placeholder="홍길동"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={ui.input}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="text-xs font-semibold text-slate-600">
                이메일
              </label>
              <input
                id="signup-email"
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
                htmlFor="signup-password"
                className="text-xs font-semibold text-slate-600"
              >
                비밀번호
              </label>
              <input
                id="signup-password"
                data-testid="signup-password-input"
                type={isPasswordVisible ? "text" : "password"}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="6자 이상 입력하세요"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={ui.input}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  data-testid="signup-toggle-password"
                  aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                  className="text-xs font-semibold text-slate-500 transition hover:text-slate-900"
                >
                  {isPasswordVisible ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error ? (
              <StatusBanner tone="error" testId="signup-error-message">
                {error}
              </StatusBanner>
            ) : null}

            {!isSupabaseConfigured && !error ? (
              <StatusBanner tone="warning">
                {ERROR_MESSAGES.auth.serviceUnavailable}
              </StatusBanner>
            ) : null}

            <button
              type="submit"
              data-testid="signup-submit-button"
              disabled={isLoading || !isSupabaseConfigured}
              className={`${ui.btnPrimary} w-full disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {isLoading ? "가입 처리 중..." : "회원가입"}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <p className="text-sm text-slate-500">이미 계정이 있다면 로그인으로 이동하세요.</p>
            <Link
              to="/login"
              data-testid="go-login-link"
              className="mt-2 inline-block text-sm font-semibold text-[color:var(--jj-color-brand)] hover:underline"
            >
              로그인으로 이동
            </Link>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[32px] border border-slate-200/70 bg-gradient-to-br from-emerald-900 via-cyan-900 to-blue-900 p-6 text-white shadow-[var(--jj-shadow-soft)] sm:p-8">
          <div className="absolute -right-16 top-10 h-40 w-40 rounded-full bg-emerald-300/20 blur-2xl" />
          <div className="absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-blue-300/20 blur-2xl" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
              Portfolio-ready onboarding
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              계정 생성 후 바로 데모 가능한 구조
            </h2>
            <p className="mt-3 text-sm text-emerald-100/95 sm:text-base">
              회원가입 후 즉시 로그인되어 지원 관리/메모/통계 흐름을 연속으로 검증할 수
              있습니다.
            </p>
            <div className="mt-6 space-y-2 text-sm text-emerald-50/95">
              <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-2">
                사용자별 저장 키 스코프로 데이터 자동 분리
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-2">
                보호 라우트 정책으로 인증 경계 일관성 유지
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-2">
                실패 시 복구 행동 중심 오류 메시지 제공
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
