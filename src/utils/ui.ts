// src/utils/ui.ts
export const ui = {
  page: "min-h-screen bg-slate-50 text-slate-900",
  shell: "flex min-h-screen",
  sidebar: "w-64 border-r border-slate-200 bg-white",
  main: "flex-1",
  header:
    "h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6",
  content: "p-6 max-w-6xl mx-auto w-full",

  card: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm",
  cardTitle: "text-base font-semibold text-slate-900",
  muted: "text-sm text-slate-500",

  btnPrimary:
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition",
  btnSecondary:
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50 transition",
  btnDanger:
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition",

  input:
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200",
  select:
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200",
  chip: "inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700",
};
