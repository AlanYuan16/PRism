import Link from "next/link";
import type { ReviewSummary } from "@/lib/types";

interface ReviewListProps {
  reviews: ReviewSummary[];
}

function severityAccent(review: ReviewSummary) {
  if (review.issueCounts.critical > 0) {
    return "border-[#FF4444]";
  }

  if (review.issueCounts.warning > 0) {
    return "border-[#FFB800]";
  }

  return "border-[#4A9EFF]";
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#1F1F1F] p-8 text-center text-sm text-[#8C8C8C]">
        No reviews found yet. Submit a diff to generate your first review.
      </div>
    );
  }

  return (
    <div className="grid gap-4 font-sans md:grid-cols-2">
      {reviews.map((review) => (
        <article key={review.id} className={`rounded-xl border border-white/10 bg-[#1F1F1F] p-5 pl-4 ${severityAccent(review)}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#8C8C8C]">{review.repoName}</p>
              <h3 className="mt-2 text-lg font-semibold text-white">{review.prTitle}</h3>
              <p className="mt-1 text-sm leading-6 text-[#A0A0A0]">
                <span className="font-mono">#{review.prNumber}</span> · {review.author}
              </p>
            </div>
            <div className="text-right text-sm text-[#8C8C8C]">
              <p className="font-medium text-white">{review.issueCounts.total} issues</p>
              <p className="mt-1">{review.createdAt}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-[#FF4444]/20 bg-[#FF4444]/10 px-2.5 py-1 text-[11px] font-medium text-[#FF9A9A]">
              {review.issueCounts.critical} critical
            </span>
            <span className="rounded-full border border-[#FFB800]/20 bg-[#FFB800]/10 px-2.5 py-1 text-[11px] font-medium text-[#FFD96B]">
              {review.issueCounts.warning} warning
            </span>
            <span className="rounded-full border border-[#4A9EFF]/20 bg-[#4A9EFF]/10 px-2.5 py-1 text-[11px] font-medium text-[#9FC3FF]">
              {review.issueCounts.nitpick} nitpick
            </span>
          </div>

          <Link href={`/reviews/${review.id}`} className="mt-5 inline-flex items-center text-sm font-medium text-[#D8C1F7] transition hover:text-white">
            Open review →
          </Link>
        </article>
      ))}
    </div>
  );
}
