import { Badge } from "@/components/ui/Badge";
import type { ReviewIssue } from "@/lib/types";

interface IssueCardProps {
  issue: ReviewIssue;
}

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-[#242424] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.16em] text-[#A0A0A0]">
            {issue.filePath}:{issue.line}
          </p>
          <h4 className="text-lg font-semibold text-white">{issue.category}</h4>
        </div>
        <Badge severity={issue.severity} />
      </div>
      <div className="mt-4 rounded-3xl bg-[#1F1F1F] p-4 text-sm leading-6 text-[#D1D1D1]">
        <p>{issue.description}</p>
      </div>
      <div className="mt-4 rounded-3xl border border-white/10 bg-[#141414] p-4 text-sm leading-6 text-[#E6E6E6]">
        <p className="font-semibold text-[#FFFFFF]">Suggested fix</p>
        <p className="mt-2 text-[#A0A0A0]">{issue.suggestion}</p>
      </div>
    </article>
  );
}
