export interface ResumeVersion {
  id: string;
  versionName: string; // 예: "경력 강조형", "신입용 초안"
  content: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  companyName: string;
  jobTitle: string;
  status: "writing" | "submitted" | "passed" | "failed";
  deadline: string; // D-Day 계산을 위한 마감일
  versions: ResumeVersion[];
  createdAt: string;
}
