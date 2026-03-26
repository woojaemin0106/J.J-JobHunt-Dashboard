import { useState, type FormEvent } from "react";
import { useAuthActions } from "../store/authStore";
import { ERROR_MESSAGES } from "../utils/errorMessages";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuthActions();

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (mode === "login") {
        const success = await login(email, password);
        if (success) {
          onClose();
          setEmail("");
          setPassword("");
        } else {
          setError(ERROR_MESSAGES.auth.invalidCredentials);
        }
      } else {
        const success = await signup(email, password, name);
        if (success) {
          onClose();
          setEmail("");
          setPassword("");
          setName("");
        } else {
          setError(ERROR_MESSAGES.auth.signupFailed);
        }
      }
    } catch {
      setError(ERROR_MESSAGES.auth.retry);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError("");
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#141414] rounded-lg shadow-2xl w-full max-w-md p-8 md:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {mode === "login" ? "로그인" : "회원가입"}
          </h1>
          <p className="text-slate-400 text-sm">
            {mode === "login"
              ? "JOBFLUX에 오신 것을 환영합니다"
              : "JOBFLUX 계정을 만들어 시작하세요"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <input
                type="text"
                placeholder="이름 (선택사항)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-white transition"
              />
            </div>
          )}

          <div>
            <input
              type="email"
              required
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-white transition"
            />
          </div>

          <div>
            <input
              type="password"
              required
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={mode === "signup" ? 6 : 4}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-white transition"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#e50914] hover:bg-[#f40612] text-white font-semibold py-3 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "처리 중..."
              : mode === "login"
              ? "로그인"
              : "회원가입"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            {mode === "login" ? "JOBFLUX가 처음이신가요?" : "이미 계정이 있으신가요?"}
          </p>
          <button
            type="button"
            onClick={switchMode}
            className="text-white hover:underline mt-2 text-sm font-medium"
          >
            {mode === "login" ? "회원가입" : "로그인"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center"
          aria-label="닫기"
        >
          ×
        </button>
      </div>
    </div>
  );
}
