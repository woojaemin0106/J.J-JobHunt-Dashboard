// src/pages/Statistics.tsx
import { useMemo } from "react";
import { ui } from "../utils/ui";
import { useApplications } from "../store/applicationStore";

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    writing: "작성 중",
    submitted: "제출 완료",
    passed: "합격",
    failed: "불합격",
  };
  return labels[status] || status;
}

export default function Statistics() {
  const applications = useApplications();

  const stats = useMemo(() => {
    const total = applications.length;
    const byStatus = {
      writing: applications.filter((a) => a.status === "writing").length,
      submitted: applications.filter((a) => a.status === "submitted").length,
      passed: applications.filter((a) => a.status === "passed").length,
      failed: applications.filter((a) => a.status === "failed").length,
    };

    const passRate =
      byStatus.passed + byStatus.failed > 0
        ? ((byStatus.passed / (byStatus.passed + byStatus.failed)) * 100).toFixed(1)
        : "0";

    const statusDistribution = [
      { label: "작성 중", count: byStatus.writing, color: "bg-slate-400" },
      { label: "제출 완료", count: byStatus.submitted, color: "bg-blue-400" },
      { label: "합격", count: byStatus.passed, color: "bg-green-400" },
      { label: "불합격", count: byStatus.failed, color: "bg-rose-400" },
    ];

    const monthlyStats = applications.reduce((acc, app) => {
      const month = new Date(app.createdAt).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      byStatus,
      passRate,
      statusDistribution,
      monthlyStats: Object.entries(monthlyStats)
        .map(([month, count]) => ({ month, count }))
        .slice(-6),
    };
  }, [applications]);

  const maxCount = Math.max(...stats.statusDistribution.map((s) => s.count), 1);

  return (
    <div className="space-y-6">
      <div className={ui.card}>
        <div className={ui.cardTitle}>취업 통계</div>
        <div className={ui.muted}>지원 현황과 성과를 한눈에 확인하세요</div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={ui.card}>
          <div className={ui.muted}>전체 지원</div>
          <div className="text-3xl font-bold mt-1">{stats.total}</div>
        </div>
        <div className={ui.card}>
          <div className={ui.muted}>합격률</div>
          <div className="text-3xl font-bold mt-1">{stats.passRate}%</div>
        </div>
        <div className={ui.card}>
          <div className={ui.muted}>합격</div>
          <div className="text-3xl font-bold mt-1 text-green-600">
            {stats.byStatus.passed}
          </div>
        </div>
        <div className={ui.card}>
          <div className={ui.muted}>진행 중</div>
          <div className="text-3xl font-bold mt-1 text-blue-600">
            {stats.byStatus.writing + stats.byStatus.submitted}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={ui.card}>
          <div className={ui.cardTitle}>상태별 분포</div>
          <div className="mt-4 space-y-3">
            {stats.statusDistribution.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm text-slate-500">{item.count}개</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all`}
                    style={{
                      width: `${(item.count / maxCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={ui.card}>
          <div className={ui.cardTitle}>월별 지원 추이</div>
          <div className="mt-4 space-y-3">
            {stats.monthlyStats.length === 0 ? (
              <div className={ui.muted}>데이터가 없습니다.</div>
            ) : (
              stats.monthlyStats.map(({ month, count }) => (
                <div key={month} className="flex items-center justify-between">
                  <span className="text-sm">{month}</span>
                  <span className="text-sm font-semibold">{count}개</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className={ui.card}>
        <div className={ui.cardTitle}>상태별 상세 현황</div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.byStatus).map(([status, count]) => (
            <div key={status} className="text-center p-4 rounded-xl bg-slate-50">
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm text-slate-500 mt-1">
                {statusLabel(status)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
