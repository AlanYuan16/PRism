import { getReviews, getStats } from "@/lib/api";
import { ReviewList } from "@/components/reviews/ReviewList";
import { StatCard } from "@/components/ui/StatCard";

export const dynamic = "force-dynamic";

async function loadDashboardData() {
  const [stats, reviews] = await Promise.all([getStats(), getReviews()]);
  return { stats, reviews };
}

export default async function Home() {
  const result = await loadDashboardData();
  const { stats, reviews } = result;

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 font-sans lg:px-8">
      <section className="rounded-xl border border-white/10 bg-[#1F1F1F] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#8C8C8C]">Overview</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">Recent review activity</h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#A0A0A0]">
            A compact view of review volume, issue severity, and the latest pull requests awaiting attention.
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        <StatCard title="PRs reviewed" value={stats.totalReviews} subtitle="Current review history" />
        <StatCard title="Issues found" value={stats.totalIssues} subtitle="Total findings recorded" accentClass="bg-[#4A9EFF]" />
        <StatCard title="Critical" value={stats.criticalCount} subtitle="Needs immediate follow-up" accentClass="bg-[#FF4444]" />
        <StatCard title="Repos tracked" value={stats.openRepos} subtitle="Active review surfaces" accentClass="bg-[#FFB800]" />
      </section>

      <section className="space-y-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Latest reviews</h2>
            <p className="text-sm text-[#8C8C8C]">Open any review to inspect the full issue list.</p>
          </div>
          <p className="text-sm text-[#8C8C8C]">{reviews.length} loaded</p>
        </div>

        <ReviewList reviews={reviews} />
      </section>
    </main>
  );
}
