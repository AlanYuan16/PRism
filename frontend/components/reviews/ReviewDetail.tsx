'use client';

import { useMemo, useState } from "react";
import type { ReviewDetail as ReviewDetailType, Severity } from "@/lib/types";
import { IssueCard } from "@/components/ui/IssueCard";

interface ReviewDetailProps {
  review: ReviewDetailType;
}

const severityTabs: Array<{ key: "all" | Severity; label: string }> = [
  { key: "all", label: "All issues" },
  { key: "critical", label: "Critical" },
  { key: "warning", label: "Warning" },
  { key: "nitpick", label: "Nitpick" },
];

export function ReviewDetail({ review }: ReviewDetailProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<"all" | Severity>("all");

  const filteredIssues = useMemo(() => {
    if (selectedSeverity === "all") {
      return review.issues;
    }

    return review.issues.filter((issue) => issue.severity === selectedSeverity);
  }, [review.issues, selectedSeverity]);

  const groupedIssues = useMemo(() => {
    return filteredIssues.reduce<Record<Severity, ReviewDetailType["issues"]>>(
      (acc, issue) => {
        acc[issue.severity].push(issue);
        return acc;
      },
      { critical: [], warning: [], nitpick: [] },
    );
  }, [filteredIssues]);

  if (review.issues.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-[#242424] p-8 text-center text-sm text-[#A0A0A0] shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
        No issues were detected for this review yet.
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="rounded-xl border border-white/[0.06] bg-[#1F1F1F] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
        <p className="text-sm leading-6 text-[#C1C1C1]">{review.summary}</p>
      </div>

      <div className="space-y-4">
        <div className="inline-flex flex-wrap gap-2 rounded-full border border-white/[0.06] bg-[#1A1A1A] p-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          {severityTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedSeverity(tab.key)}
              className={`rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-widest transition ${
                selectedSeverity === tab.key
                  ? "bg-[#582688] text-white"
                  : "text-[#8C8C8C] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          {selectedSeverity === "all" && (
            <div className="text-sm text-[#8C8C8C]">
              Grouped by severity. Choose a filter to narrow the list.
            </div>
          )}

          {selectedSeverity !== "all" && filteredIssues.length === 0 && (
            <div className="rounded-lg border border-white/[0.06] bg-[#1F1F1F] p-8 text-center text-sm text-[#8C8C8C]">
              No {selectedSeverity} issues were detected for this review.
            </div>
          )}

          {selectedSeverity === "all" ? (
            (["critical", "warning", "nitpick"] as Severity[]).map((severity) => (
              <section key={severity} className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-[10px] font-semibold uppercase tracking-widest text-[#555]">{severity}</h2>
                  <span className="text-sm text-[#8C8C8C]">{groupedIssues[severity].length} issues</span>
                </div>
                <div className="grid gap-3">
                  {groupedIssues[severity].length === 0 ? (
                    <div className="rounded-lg border border-dashed border-white/[0.06] bg-[#1F1F1F] p-6 text-sm text-[#8C8C8C]">
                      No {severity} issues found.
                    </div>
                  ) : (
                    groupedIssues[severity].map((issue) => <IssueCard key={issue.id} issue={issue} />)
                  )}
                </div>
              </section>
            ))
          ) : filteredIssues.length === 0 ? (
            <div className="rounded-lg border border-white/[0.06] bg-[#1F1F1F] p-8 text-center text-sm text-[#8C8C8C]">
              No {selectedSeverity} issues were detected for this review.
            </div>
          ) : (
            filteredIssues.map((issue) => <IssueCard key={issue.id} issue={issue} />)
          )}
        </div>
      </div>
    </div>
  );
}
