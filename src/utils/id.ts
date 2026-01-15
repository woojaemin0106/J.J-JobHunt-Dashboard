/**
 * 고유 ID 생성 유틸리티
 * 브라우저의 crypto API를 사용하며, 지원하지 않는 경우 fallback 제공
 */
export function generateId(): string {
  // 브라우저의 crypto API 사용 (최신 브라우저)
  if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  
  // Fallback: 타임스탬프 + 랜덤 문자열
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
