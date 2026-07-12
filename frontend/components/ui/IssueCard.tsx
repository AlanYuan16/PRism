import { Badge } from "@/components/ui/Badge";
import type { ReviewIssue } from "@/lib/types";

interface IssueCardProps {
  issue: ReviewIssue;
}

const borderStyles: Record<ReviewIssue["severity"], string> = {
  critical: "border-[#FF4444]",
  warning: "border-[#FFB800]",
  nitpick: "border-[#4A9EFF]",
};

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <article className={`rounded-xl border border-white/10 bg-[#1F1F1F] p-4 pl-3 ${borderStyles[issue.severity]}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="font-mono text-xs tracking-[0.12em] text-[#8C8C8C]">
            {issue.filePath}:{issue.line}
          </p>
          <h4 className="text-base font-semibold text-white">{issue.category}</h4>
        </div>
        <Badge severity={issue.severity} />
      </div>
      <div className="mt-3 rounded-lg bg-[#181818] p-3 text-sm leading-6 text-[#C9C9C9]">
        <p>{issue.description}</p>
      </div>
      <div className="mt-3 rounded-lg border border-white/10 bg-[#151515] p-3 text-sm leading-6 text-[#A0A0A0]">
        <p className="font-medium text-white">Suggested fix</p>
        <p className="mt-1">{issue.suggestion}</p>
      </div>
    </article>
  );
}
