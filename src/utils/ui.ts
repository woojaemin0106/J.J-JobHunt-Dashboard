/**
 * Shared UI utility classes.
 * PR-C1 scope: design tokens and layout shell refresh.
 */
export const ui = {
  page:
    "min-h-screen text-[var(--jj-color-ink)] bg-[radial-gradient(1200px_580px_at_0%_-15%,rgba(14,165,233,0.20),transparent_70%),radial-gradient(1000px_520px_at_100%_-20%,rgba(16,185,129,0.16),transparent_70%),linear-gradient(180deg,#f8fbff_0%,#eef4fb_100%)]",
  shell: "min-h-screen md:grid md:grid-cols-[272px_minmax(0,1fr)]",
  sidebar:
    "hidden md:block border-r border-[color:var(--jj-color-line)]/70 bg-white/75 backdrop-blur-xl",
  main: "min-w-0",
  header:
    "sticky top-0 z-20 flex h-17 items-center justify-between gap-3 overflow-hidden border-b border-[color:var(--jj-color-line)]/70 bg-white/80 px-3 sm:px-5 lg:px-8 backdrop-blur-xl",
  content: "mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8",

  card:
    "rounded-[var(--jj-radius-xl)] border border-[color:var(--jj-color-line)]/65 bg-white/90 p-4 shadow-[var(--jj-shadow-card)] transition-shadow hover:shadow-[var(--jj-shadow-soft)]",
  cardTitle: "text-base font-semibold tracking-tight text-[var(--jj-color-ink)]",
  muted: "text-sm text-[color:var(--jj-color-muted)]",

  btnPrimary:
    "inline-flex items-center justify-center rounded-[var(--jj-radius-lg)] border border-transparent bg-[color:var(--jj-color-brand)] px-4 py-2 text-sm font-semibold text-white shadow-[var(--jj-shadow-soft)] transition hover:bg-[color:var(--jj-color-brand-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--jj-color-brand)]/35",
  btnSecondary:
    "inline-flex items-center justify-center rounded-[var(--jj-radius-lg)] border border-[color:var(--jj-color-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--jj-color-ink)] transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--jj-color-brand)]/25",
  btnDanger:
    "inline-flex items-center justify-center rounded-[var(--jj-radius-lg)] border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200",

  input:
    "w-full rounded-[var(--jj-radius-lg)] border border-[color:var(--jj-color-line)] bg-white px-3 py-2 text-sm text-[var(--jj-color-ink)] outline-none transition placeholder:text-[color:var(--jj-color-muted)]/80 focus-visible:border-[color:var(--jj-color-brand)] focus-visible:ring-2 focus-visible:ring-[color:var(--jj-color-brand)]/25",
  select:
    "w-full rounded-[var(--jj-radius-lg)] border border-[color:var(--jj-color-line)] bg-white px-3 py-2 text-sm text-[var(--jj-color-ink)] outline-none transition focus-visible:border-[color:var(--jj-color-brand)] focus-visible:ring-2 focus-visible:ring-[color:var(--jj-color-brand)]/25",
  chip:
    "inline-flex items-center rounded-full border border-[color:var(--jj-color-line)] bg-slate-50 px-2.5 py-1 text-xs font-medium text-[var(--jj-color-muted)]",
};
