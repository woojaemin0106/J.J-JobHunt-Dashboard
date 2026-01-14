/**
 * LocalStorage 헬퍼
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
