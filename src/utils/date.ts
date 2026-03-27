// D-Day 계산: 오늘 날짜 기준 남은 일수 반환
export const calculateDDay = (deadline: string | Date): string | null => {
  if (!deadline) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(deadline);
  target.setHours(23, 59, 59, 999);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'D-DAY';
  return diffDays > 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
};

// D-Day까지 남은 일수 계산 (숫자로 반환)
export const getDaysUntil = (deadline: string | Date): number | null => {
  if (!deadline) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(deadline);
  target.setHours(23, 59, 59, 999);

  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Week Range: 특정 날짜가 포함된 주의 시작일(일)과 종료일(토) 반환
export const getWeekRange = (date: Date = new Date()) => {
  const current = new Date(date);
  const day = current.getDay(); // 0(일) ~ 6(토)
  
  const start = new Date(current);
  start.setDate(current.getDate() - day);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  };
};