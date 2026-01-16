/**
 * UI 스타일 유틸리티
 * 재사용 가능한 Tailwind CSS 클래스 모음
 */
export const ui = {
  page: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 text-slate-900",
  shell: "flex min-h-screen",
  sidebar: "w-64 border-r border-slate-200/60 bg-white/80 backdrop-blur-sm",
  main: "flex-1",
  header:
    "h-16 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm flex items-center justify-between px-3 sm:px-6 gap-2 overflow-hidden",
  content: "p-6 max-w-6xl mx-auto w-full",

  card: "rounded-2xl border border-slate-200/60 bg-white/90 backdrop-blur-sm p-4 shadow-sm hover:shadow-md transition-shadow duration-200",
  cardTitle: "text-base font-semibold text-slate-900",
  muted: "text-sm text-slate-500",

  btnPrimary:
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md",
  btnSecondary:
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50 transition-all duration-200",
  btnDanger:
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium border border-rose-200 bg-gradient-to-r from-rose-50 to-rose-100/50 text-rose-700 hover:from-rose-100 hover:to-rose-200/50 transition-all duration-200",

  input:
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all duration-200",
  select:
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all duration-200",
  chip: "inline-flex items-center rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/50 px-2 py-1 text-xs text-slate-700",
};
