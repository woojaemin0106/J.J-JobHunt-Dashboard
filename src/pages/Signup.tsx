// src/pages/Signup.tsx
import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthActions } from "../store/authStore";
import { ui } from "../utils/ui";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuthActions();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await signup(email, password, name);
      if (success) {
        navigate("/");
      } else {
        setError("이미 등록된 이메일입니다.");
      }
    } catch (err) {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={ui.page}>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* 회원가입 카드 */}
          <div className={ui.card}>
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                회원가입
              </h1>
              <p className="text-slate-500 text-base">
                JOBFLUX 계정을 만들어 시작하세요
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="이름 (선택사항)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={ui.input}
                />
              </div>

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
                  placeholder="비밀번호 (최소 6자 이상)"
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "처리 중..." : "회원가입"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-500 text-sm">이미 계정이 있으신가요?</p>
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-700 hover:underline mt-2 inline-block text-sm font-medium"
              >
                로그인
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
