import Link from "next/link";
import type { ReviewSummary } from "@/lib/types";

interface ReviewListProps {
  reviews: ReviewSummary[];
}

function severityAccent(review: ReviewSummary) {
  if (review.issueCounts.critical > 0) {
    return "border-l-[#FF4444]";
  }

  if (review.issueCounts.warning > 0) {
    return "border-l-[#FFB800]";
  }

  if (review.issueCounts.nitpick > 0) {
    return "border-l-[#4A9EFF]";
  }

  return "border-l-[#444]";
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-[#1F1F1F] p-10 text-center shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
        <p className="text-sm text-[#8C8C8C]">No reviews found yet. Submit a diff to generate your first review.</p>
        <Link href="/submit" className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#582688]/30 bg-[#582688]/15 px-3 py-2 text-sm font-medium text-[#E9D9FF] transition hover:bg-[#582688]/25">
          <span className="text-base leading-none">+</span>
          Submit a diff
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 font-sans md:grid-cols-2">
      {reviews.map((review) => (
        <article key={review.id} className={`rounded-xl border border-white/[0.06] border-l-4 bg-[#1F1F1F] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.4)] ${severityAccent(review)}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#555]">{review.repoName}</p>
              <h3 className="mt-2 text-sm font-semibold text-white">{review.prTitle}</h3>
              <p className="mt-2 text-sm leading-6 text-[#7E7E7E]">
                <span className="font-mono text-[#A0A0A0]">#{review.prNumber}</span> · {review.author}
              </p>
            </div>
            <div className="text-right text-sm text-[#8C8C8C]">
              <p className="font-medium text-white">{review.issueCounts.total} issues</p>
              <p className="mt-1">{review.createdAt}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-[#FF4444]/20 bg-[#FF4444]/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-[#FF9A9A]">
              {review.issueCounts.critical} critical
            </span>
            <span className="rounded-full border border-[#FFB800]/20 bg-[#FFB800]/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-[#FFD96B]">
              {review.issueCounts.warning} warning
            </span>
            <span className="rounded-full border border-[#4A9EFF]/20 bg-[#4A9EFF]/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-[#9FC3FF]">
              {review.issueCounts.nitpick} nitpick
            </span>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="text-[11px] uppercase tracking-widest text-[#555]">{review.createdAt}</p>
            <Link
              href={`/reviews/${review.id}`}
              className="text-xs font-medium text-white transition hover:text-[#582688]"
            >
              View review →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
