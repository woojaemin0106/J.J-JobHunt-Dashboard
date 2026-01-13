import { ui } from "../utils/ui";

export default function Resume() {
  return (
    <div className="space-y-4">
      <div className={ui.card}>
        <div className={ui.cardTitle}>Resume Hub</div>
        <p className={ui.muted}>이력서 버전/링크 관리(추가 예정)</p>
      </div>

      <div className={ui.card}>
        <p className={ui.muted}>TODO: Resume version list</p>
      </div>
    </div>
  );
}
