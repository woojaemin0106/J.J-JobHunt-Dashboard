import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { EmptyStateCard } from "../components/StateCards";
import { ui } from "../utils/ui";
import { useApplications } from "../store/applicationStore";
import type { Application } from "../types/application";

function statusLabel(status: Application["status"]) {
  if (status === "writing") return "작성 중";
  if (status === "submitted") return "지원 완료";
  if (status === "passed") return "합격";
  return "불합격";
}

function statusColor(status: Application["status"]) {
  if (status === "writing") return "bg-slate-400";
  if (status === "submitted") return "bg-sky-500";
  if (status === "passed") return "bg-emerald-500";
  return "bg-rose-500";
}

function getRecentMonthKeys(size: number) {
  const now = new Date();
  const keys: string[] = [];

  for (let index = size - 1; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    keys.push(key);
  }

  return keys;
}

function monthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  return `${year}.${String(month).padStart(2, "0")}`;
}

export default function Statistics() {
  const navigate = useNavigate();
  const applications = useApplications();

  const stats = useMemo(() => {
    const byStatus: Record<Application["status"], number> = {
      writing: 0,
      submitted: 0,
      passed: 0,
      failed: 0,
    };

    const monthKeys = getRecentMonthKeys(6);
    const monthCountMap = monthKeys.reduce<Record<string, number>>((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});

    for (const application of applications) {
      byStatus[application.status] += 1;

      const createdAt = new Date(application.createdAt);
      const monthKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}`;
      if (monthCountMap[monthKey] !== undefined) {
        monthCountMap[monthKey] += 1;
      }
    }

    const reviewedCount = byStatus.passed + byStatus.failed;
    const inProgressCount = byStatus.writing + byStatus.submitted;
    const passRate =
      reviewedCount === 0 ? 0 : Number(((byStatus.passed / reviewedCount) * 100).toFixed(1));

    const thisMonthKey = monthKeys[monthKeys.length - 1];

    const monthlyRows = monthKeys.map((key) => ({
      monthKey: key,
      label: monthLabel(key),
      count: monthCountMap[key],
    }));

    return {
      total: applications.length,
      byStatus,
      reviewedCount,
      inProgressCount,
      passRate,
      thisMonthCount: monthCountMap[thisMonthKey] ?? 0,
      monthlyRows,
    };
  }, [applications]);

  const distributionRows = [
    { status: "writing" as const, count: stats.byStatus.writing },
    { status: "submitted" as const, count: stats.byStatus.submitted },
    { status: "passed" as const, count: stats.byStatus.passed },
    { status: "failed" as const, count: stats.byStatus.failed },
  ];

  const maxDistribution = Math.max(...distributionRows.map((row) => row.count), 1);
  const maxMonthlyCount = Math.max(...stats.monthlyRows.map((row) => row.count), 1);

  if (stats.total === 0) {
    return (
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-200/70 bg-gradient-to-r from-indigo-900 to-blue-900 p-6 text-white shadow-[var(--jj-shadow-soft)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-200">
                Performance analytics
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                취업 준비 진행률을 숫자로 확인해보세요
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-indigo-100/95">
                지원 데이터가 쌓이면 상태 분포와 월별 추이를 한눈에 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        <EmptyStateCard
          title="아직 통계를 만들 데이터가 없습니다"
          description="지원 현황에서 첫 공고를 추가하면 통계 대시보드가 자동으로 채워집니다."
          actionLabel="지원 현황으로 이동"
          onAction={() => navigate("/applications")}
          testId="statistics-empty-state"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200/70 bg-gradient-to-r from-indigo-900 to-blue-900 p-6 text-white shadow-[var(--jj-shadow-soft)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-200">
              Performance analytics
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              취업 준비 진행률을 숫자로 확인하세요
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-indigo-100/95">
              지원 건수와 결과 전환율을 함께 보면 다음 주 우선순위를 더 정확히 정할 수
              있습니다.
            </p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm">
            <div className="text-[11px] text-indigo-100/80">최근 6개월 집계</div>
            <div className="text-2xl font-black">{stats.total}건</div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <article className={ui.card}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">전체 지원</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{stats.total}</p>
        </article>
        <article className={ui.card}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">합격률</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{stats.passRate}%</p>
        </article>
        <article className={ui.card}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">진행 중</p>
          <p className="mt-2 text-3xl font-black text-sky-700">{stats.inProgressCount}</p>
        </article>
        <article className={ui.card}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">이번 달 지원</p>
          <p className="mt-2 text-3xl font-black text-indigo-700">{stats.thisMonthCount}</p>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <article className={`${ui.card} xl:col-span-6`}>
          <h3 className={ui.cardTitle}>상태별 분포</h3>
          <p className="mt-1 text-sm text-slate-500">지원 단계별 분포를 비교해 병목 구간을 찾습니다.</p>
          <div className="mt-4 space-y-3">
            {distributionRows.map((row) => (
              <div key={row.status}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">{statusLabel(row.status)}</span>
                  <span className="text-slate-500">{row.count}건</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full transition-all ${statusColor(row.status)}`}
                    style={{ width: `${(row.count / maxDistribution) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className={`${ui.card} xl:col-span-6`}>
          <h3 className={ui.cardTitle}>월별 지원 추이</h3>
          <p className="mt-1 text-sm text-slate-500">최근 6개월 기준으로 지원량 변화를 확인합니다.</p>

          <div className="mt-4 space-y-3">
            {stats.monthlyRows.map((row) => (
              <div key={row.monthKey} className="flex items-center gap-3">
                <div className="w-20 shrink-0 text-xs font-semibold text-slate-600">{row.label}</div>
                <div className="h-8 flex-1 rounded-xl bg-slate-100 p-1">
                  <div
                    className="h-full rounded-lg bg-indigo-500/90 px-2 text-right text-xs font-semibold leading-6 text-white"
                    style={{ width: `${Math.max((row.count / maxMonthlyCount) * 100, 8)}%` }}
                  >
                    {row.count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className={ui.card}>
        <h3 className={ui.cardTitle}>상세 지표</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {distributionRows.map((row) => (
            <div key={row.status} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
              <div className="text-2xl font-black text-slate-900">{row.count}</div>
              <div className="mt-1 text-xs font-semibold text-slate-500">{statusLabel(row.status)}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          합격률은 결과가 확정된 건(합격 + 불합격)만 기준으로 계산합니다.
        </p>
      </section>
    </div>
  );
}
