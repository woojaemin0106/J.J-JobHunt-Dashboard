// D-Day 계산: 오늘 날짜 기준 남은 일수 반환
export const calculateDDay = (deadline: string | Date): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(deadline);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'D-Day';
  return diffDays > 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
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

/**
 * 2. LocalStorage 헬퍼 (파트너 작업: 헬퍼 초안)
 */
export const storage = {
  // 데이터 저장 (객체를 JSON 문자열로 변환하여 저장)
  set: <T>(key: string, value: T): void => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`localStorage set error [${key}]:`, error);
    }
  },

  // 데이터 불러오기 (JSON 문자열을 객체로 변환하여 반환)
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`localStorage get error [${key}]:`, error);
      return null;
    }
  },

  // 특정 데이터 삭제
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  // 모든 데이터 초기화
  clear: (): void => {
    localStorage.clear();
  },
};