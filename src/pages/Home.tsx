import { ui } from "../utils/ui";

export default function Home() {
  return (
    <div className="space-y-6">
      <section className={ui.card}>
        <div className={ui.cardTitle}>Quick Summary</div>
        <p className={ui.muted}>
          이번 주 마감, 진행 중 지원, 면접 상태를 한눈에 보는 대시보드(추가
          예정)
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={ui.card}>
          <div className={ui.muted}>Active</div>
          <div className="text-3xl font-bold">0</div>
        </div>
        <div className={ui.card}>
          <div className={ui.muted}>Due this week</div>
          <div className="text-3xl font-bold">0</div>
        </div>
        <div className={ui.card}>
          <div className={ui.muted}>Interviews</div>
          <div className="text-3xl font-bold">0</div>
        </div>
      </section>

      <section className={ui.card}>
        <div className={ui.cardTitle}>This week</div>
        <p className={ui.muted}>할 일 리스트(추가 예정)</p>
      </section>
    </div>
  );
}
