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
    <div className="space-y-8">
      <div className="rounded-[28px] border border-white/10 bg-[#242424] p-8 shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#A0A0A0]">{review.repoName}</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">{review.prTitle}</h1>
            <p className="mt-2 text-sm leading-6 text-[#C1C1C1]">#{review.prNumber} · {review.author} · {review.branch}</p>
          </div>
          <div className="rounded-3xl bg-[#1A1A1A] px-5 py-4 text-right">
            <p className="text-sm uppercase tracking-[0.24em] text-[#A0A0A0]">Total issues</p>
            <p className="mt-2 text-3xl font-semibold text-white">{review.issueCounts.total}</p>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-sm leading-7 text-[#D1D1D1]">{review.summary}</p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          {severityTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedSeverity(tab.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
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
            <div className="rounded-[28px] bg-[#1A1A1A] p-5 text-sm text-[#A0A0A0]">
              Showing all issues grouped by severity. Choose a filter to narrow results.
            </div>
          )}

          {selectedSeverity !== "all" && filteredIssues.length === 0 && (
            <div className="rounded-[28px] border border-white/10 bg-[#242424] p-8 text-center text-sm text-[#A0A0A0]">
              No {selectedSeverity} issues were detected for this review.
            </div>
          )}

          {selectedSeverity === "all" ? (
            (["critical", "warning", "nitpick"] as Severity[]).map((severity) => (
              <section key={severity} className="space-y-4">
                <div className="flex items-center justify-between gap-4 rounded-3xl bg-[#1A1A1A] px-5 py-4">
                  <h2 className="text-lg font-semibold text-white">{severity}</h2>
                  <span className="text-sm text-[#A0A0A0]">{groupedIssues[severity].length} issues</span>
                </div>
                <div className="grid gap-4">
                  {groupedIssues[severity].length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-white/10 bg-[#242424] p-6 text-sm text-[#A0A0A0]">
                      No {severity} issues found.
                    </div>
                  ) : (
                    groupedIssues[severity].map((issue) => <IssueCard key={issue.id} issue={issue} />)
                  )}
                </div>
              </section>
            ))
          ) : filteredIssues.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-[#242424] p-8 text-center text-sm text-[#A0A0A0]">
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
