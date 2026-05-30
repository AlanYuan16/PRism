export type Severity = "critical" | "warning" | "nitpick";

export interface ReviewIssue {
  id: string;
  filePath: string;
  line: number;
  severity: Severity;
  category: string;
  description: string;
  suggestion: string;
}

export interface IssueCounts {
  total: number;
  critical: number;
  warning: number;
  nitpick: number;
}

export interface ReviewSummary {
  id: string;
  repoName: string;
  prTitle: string;
  prNumber: string;
  author: string;
  createdAt: string;
  issueCounts: IssueCounts;
}

export interface ReviewDetail extends ReviewSummary {
  branch: string;
  summary: string;
  issues: ReviewIssue[];
}

export interface Stats {
  totalReviews: number;
  totalIssues: number;
  criticalCount: number;
  openRepos: number;
}

export interface SubmitReviewPayload {
  repoName: string;
  prNumber: string;
  title: string;
  author: string;
  diff: string;
}

export interface SubmitReviewResponse {
  id: string;
}
