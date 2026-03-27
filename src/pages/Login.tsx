import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthActions } from "../store/authStore";
import { isSupabaseConfigured } from "../supabase/supabase";
import { ERROR_MESSAGES } from "../utils/errorMessages";
import { ui } from "../utils/ui";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthActions();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isSupabaseConfigured) {
      setError(ERROR_MESSAGES.auth.serviceUnavailable);
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/");
      } else {
        setError(ERROR_MESSAGES.auth.invalidCredentials);
      }
    } catch {
      setError(ERROR_MESSAGES.auth.retry);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={ui.page}>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className={ui.card}>
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                로그인
              </h1>
              <p className="text-slate-500 text-base">
                JOBFLUX에 오신 것을 환영합니다
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  required
                  placeholder="이메일 주소"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={ui.input}
                />
              </div>

              <div>
                <input
                  type="password"
                  required
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={4}
                  className={ui.input}
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl p-3">
                  {error}
                </div>
              )}

              {!isSupabaseConfigured && !error && (
                <div className="text-amber-700 text-sm bg-amber-50 border border-amber-200 rounded-xl p-3">
                  {ERROR_MESSAGES.auth.serviceUnavailable}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !isSupabaseConfigured}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "처리 중..." : "로그인"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-500 text-sm">JOBFLUX가 처음이신가요?</p>
              <Link
                to="/signup"
                className="text-indigo-600 hover:text-indigo-700 hover:underline mt-2 inline-block text-sm font-medium"
              >
                회원가입
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
