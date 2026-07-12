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
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-6 lg:px-8">
      <section className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#A0A0A0]">Dashboard</p>
            <h1 className="text-4xl font-semibold text-white">Your latest code reviews</h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#C1C1C1]">
            Track review performance across repositories, spot critical regressions, and inspect recent suggestions in one premium workspace.
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        <StatCard title="Total PRs reviewed" value={stats.totalReviews} subtitle="All reviewed pull requests." />
        <StatCard title="Total issues" value={stats.totalIssues} subtitle="Issues found across reviews." accentClass="bg-[#4A9EFF]" />
        <StatCard title="Critical issues" value={stats.criticalCount} subtitle="High-risk findings needing fast attention." accentClass="bg-[#FF4444]" />
        <StatCard title="Open repos" value={stats.openRepos} subtitle="Repositories with active review history." accentClass="bg-[#FFB800]" />
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Recent reviews</h2>
            <p className="mt-1 text-sm text-[#A0A0A0]">Review summaries with issue counts and quick access to detail pages.</p>
          </div>
          <p className="text-sm text-[#A0A0A0]">{reviews.length} reviews loaded</p>
        </div>

        <ReviewList reviews={reviews} />
      </section>
    </main>
  );
}
