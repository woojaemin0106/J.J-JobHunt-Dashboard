// mockApplications.ts
import { type Application } from '../types/application';

/**
 * 1. 테스트용 Mock 데이터
 */
export const mockApplications: Application[] = [
  {
    id: '1',
    companyName: '구글 코리아',
    jobTitle: 'Frontend Engineer',
    status: 'writing',
    deadline: '2026-02-01',
    createdAt: '2026-01-10',
    versions: [{ id: 'v1', versionName: '초안', content: '내용...', updatedAt: '2026-01-11' }],
  },
  {
    id: '2',
    companyName: '네이버',
    jobTitle: 'React Developer',
    status: 'submitted',
    deadline: '2026-01-15',
    createdAt: '2026-01-05',
    versions: [{ id: 'v1', versionName: '최종본', content: '내용...', updatedAt: '2026-01-12' }],
  }
];

