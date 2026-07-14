import { Badge } from "@/components/ui/Badge";
import type { ReviewIssue } from "@/lib/types";

interface IssueCardProps {
  issue: ReviewIssue;
}

const borderStyles: Record<ReviewIssue["severity"], string> = {
  critical: "border-l-[#FF4444]",
  warning: "border-l-[#FFB800]",
  nitpick: "border-l-[#4A9EFF]",
};

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <article className={`rounded-xl border border-white/[0.06] border-l-[2px] bg-[#1F1F1F] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.4)] ${borderStyles[issue.severity]}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#555]">
            {issue.filePath}:{issue.line}
          </p>
          <h4 className="text-base font-semibold text-white">{issue.category}</h4>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge severity={issue.severity} />
          <span className="rounded-full border border-white/[0.06] bg-[#161616] px-2.5 py-1 text-[10px] uppercase tracking-widest text-[#7A7A7A]">
            {issue.category}
          </span>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-[#C1C1C1]">{issue.description}</p>
      <div className="mt-3 rounded-md border border-white/[0.06] bg-[#1E1E1E] p-3 text-sm font-mono leading-6 text-[#A0A0A0]">
        {issue.suggestion}
      </div>
    </article>
  );
}
