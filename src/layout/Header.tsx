// src/layout/Header.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { ui } from "../utils/ui";

function titleFromPath(pathname: string) {
  if (pathname === "/") return "홈";
  if (pathname.startsWith("/applications")) return "지원 현황";
  if (pathname.startsWith("/resume")) return "이력서 관리";
  if (pathname.startsWith("/notes")) return "메모장";
  if (pathname.startsWith("/statistics")) return "취업 통계";
  return "J.J JobHunt";
}

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const title = titleFromPath(pathname);

  return (
    <>
      <div className="min-w-[220px]">
        <div className="text-lg font-semibold">{title}</div>
      </div>

      <div className="flex items-center gap-2 w-full max-w-xl">
        <input
          className={ui.input}
          placeholder="회사·직무 검색…"
          onKeyDown={(e) => {
            if (e.key === "Enter") navigate("/applications");
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          className={ui.btnSecondary}
          onClick={() => navigate("/applications")}
        >
          지원 현황
        </button>
        <button
          className={ui.btnPrimary}
          onClick={() => alert("TODO: Open New Application modal")}
        >
          + 추가하기
        </button>
      </div>
    </>
  );
}
