// src/data/mockApplications.ts
import type { Application } from "../types/application";

const nowISO = new Date().toISOString();

const mockApplications: Application[] = [
  {
    id: "a1",
    companyName: "Naver",
    jobTitle: "Frontend Developer",
    status: "writing",
    deadline: "2026-01-20",
    versions: [
      {
        id: "v1",
        versionName: "신입용 초안",
        content: "초안 내용",
        updatedAt: nowISO,
      },
    ],
    createdAt: nowISO,
  },
  {
    id: "a2",
    companyName: "Kakao",
    jobTitle: "Web Frontend",
    status: "submitted",
    deadline: "2026-01-18",
    versions: [],
    createdAt: nowISO,
  },
  {
    id: "a3",
    companyName: "Coupang",
    jobTitle: "Frontend Engineer",
    status: "passed",
    deadline: "2026-01-16",
    versions: [],
    createdAt: nowISO,
  },
  {
    id: "a4",
    companyName: "Startup A",
    jobTitle: "React Developer",
    status: "failed",
    deadline: "2026-01-25",
    versions: [],
    createdAt: nowISO,
  },
];

export default mockApplications;
