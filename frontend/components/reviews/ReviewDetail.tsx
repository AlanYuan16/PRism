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
      <div className="rounded-[28px] border border-white/10 bg-[#242424] p-8 text-center text-sm text-[#A0A0A0]">
        No issues were detected for this review yet.
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="rounded-xl border border-white/10 bg-[#1F1F1F] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#8C8C8C]">Summary</p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#C1C1C1]">{review.summary}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#151515] px-3 py-2 text-sm text-[#A0A0A0]">
            <p className="font-medium text-white">{review.issueCounts.total} issues</p>
            <p className="mt-1">Across this review</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {severityTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedSeverity(tab.key)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                selectedSeverity === tab.key
                  ? "bg-[#582688] text-white"
                  : "border border-white/10 bg-[#1A1A1A] text-[#A0A0A0] hover:border-[#582688]/40 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          {selectedSeverity === "all" && (
            <div className="rounded-lg border border-white/10 bg-[#1A1A1A] p-3 text-sm text-[#8C8C8C]">
              Grouped by severity. Choose a filter to narrow the list.
            </div>
          )}

          {selectedSeverity !== "all" && filteredIssues.length === 0 && (
            <div className="rounded-lg border border-white/10 bg-[#1F1F1F] p-8 text-center text-sm text-[#8C8C8C]">
              No {selectedSeverity} issues were detected for this review.
            </div>
          )}

          {selectedSeverity === "all" ? (
            (["critical", "warning", "nitpick"] as Severity[]).map((severity) => (
              <section key={severity} className="space-y-3">
                <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#1A1A1A] px-3 py-2.5">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#D8D8D8]">{severity}</h2>
                  <span className="text-sm text-[#8C8C8C]">{groupedIssues[severity].length} issues</span>
                </div>
                <div className="grid gap-3">
                  {groupedIssues[severity].length === 0 ? (
                    <div className="rounded-lg border border-dashed border-white/10 bg-[#1F1F1F] p-6 text-sm text-[#8C8C8C]">
                      No {severity} issues found.
                    </div>
                  ) : (
                    groupedIssues[severity].map((issue) => <IssueCard key={issue.id} issue={issue} />)
                  )}
                </div>
              </section>
            ))
          ) : filteredIssues.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-[#1F1F1F] p-8 text-center text-sm text-[#8C8C8C]">
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
