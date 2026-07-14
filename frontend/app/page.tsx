import Link from "next/link";
import { getReviews, getStats } from "@/lib/api";
import { ReviewList } from "@/components/reviews/ReviewList";
import { StatCard } from "@/components/ui/StatCard";
import type { ReviewSummary, Stats } from "@/lib/types";

export const dynamic = "force-dynamic";

const emptyStats: Stats = {
  totalReviews: 0,
  totalIssues: 0,
  criticalCount: 0,
  openRepos: 0,
};

async function loadDashboardData(): Promise<{ stats: Stats; reviews: ReviewSummary[]; error: string | null }> {
  try {
    const [stats, reviews] = await Promise.all([getStats(), getReviews()]);
    return { stats, reviews, error: null };
  } catch (error) {
    console.error("Failed to load dashboard data", error);
    return { stats: emptyStats, reviews: [], error: "Unable to load review activity right now. Please try again in a moment." };
  }
}

export default async function Home() {
  const result = await loadDashboardData();
  const { stats, reviews, error } = result;

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 font-sans lg:px-8">
      <section className="rounded-xl border border-white/[0.06] bg-[#1F1F1F] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#555]">Overview</p>
            <h1 className="mt-1 text-2xl font-semibold text-white">Recent review activity</h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#A0A0A0]">
            A compact view of review volume, issue severity, and the latest pull requests awaiting attention.
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        <StatCard title="PRs reviewed" value={stats.totalReviews} subtitle="Current review history" accentClass="border-t-[#582688]" />
        <StatCard title="Issues found" value={stats.totalIssues} subtitle="Total findings recorded" accentClass="border-t-[#4A9EFF]" />
        <StatCard title="Critical" value={stats.criticalCount} subtitle="Needs immediate follow-up" accentClass="border-t-[#FF4444]" />
        <StatCard title="Repos tracked" value={stats.openRepos} subtitle="Active review surfaces" accentClass="border-t-[#FFB800]" />
      </section>

      <div className="h-px w-full bg-white/[0.06]" />

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Recent reviews</h2>
            <p className="text-sm text-[#8C8C8C]">Open any review to inspect the full issue list.</p>
          </div>
          <p className="text-sm text-[#8C8C8C]">{reviews.length} loaded</p>
        </div>

        {error ? (
          <div className="rounded-xl border border-[#FF4444]/20 bg-[#2E1515] p-5 text-sm text-[#FFB7B7] shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
            <p className="font-medium">We could not reach the review API.</p>
            <p className="mt-1">{error}</p>
            <Link href="/submit" className="mt-3 inline-flex items-center rounded-full border border-[#FF4444]/20 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-[#FFB7B7] transition hover:bg-[#FF4444]/10">
              Submit a diff anyway
            </Link>
          </div>
        ) : null}

        <ReviewList reviews={reviews} />
      </section>
    </main>
  );
}
