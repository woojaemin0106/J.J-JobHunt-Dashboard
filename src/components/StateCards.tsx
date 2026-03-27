import type { ReactNode } from "react";
import { ui } from "../utils/ui";

type BannerTone = "info" | "warning" | "error";

function bannerToneClass(tone: BannerTone) {
  if (tone === "error") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }
  if (tone === "warning") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  return "border-sky-200 bg-sky-50 text-sky-700";
}

export function StatusBanner({
  tone,
  children,
  testId,
}: {
  tone: BannerTone;
  children: ReactNode;
  testId?: string;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "polite" : "off"}
      data-testid={testId}
      className={`rounded-xl border p-3 text-sm transition-colors duration-200 ${bannerToneClass(tone)}`}
    >
      {children}
    </div>
  );
}

export function EmptyStateCard({
  title,
  description,
  actionLabel,
  onAction,
  testId,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  testId?: string;
}) {
  return (
    <section className={ui.card} data-testid={testId}>
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center transition-colors duration-200">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-500">{description}</p>
        {actionLabel && onAction ? (
          <button type="button" className={`${ui.btnPrimary} mt-4`} onClick={onAction}>
            {actionLabel}
          </button>
        ) : null}
      </div>
    </section>
  );
}

export function LoadingScreen({
  title,
  description,
  testId,
}: {
  title: string;
  description: string;
  testId?: string;
}) {
  return (
    <div
      data-testid={testId}
      className="min-h-screen flex items-center justify-center px-4 text-center"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-[var(--jj-shadow-card)]">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[color:var(--jj-color-brand)]" />
        <h2 className="mt-4 text-base font-bold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}
