import Link from "next/link";
import type { ReviewSummary } from "@/lib/types";

interface ReviewListProps {
  reviews: ReviewSummary[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-[#242424] p-8 text-center text-sm text-[#A0A0A0]">
        No reviews found yet. Submit a diff to generate your first review.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {reviews.map((review) => (
        <article key={review.id} className="rounded-[28px] border border-white/10 bg-[#242424] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#A0A0A0]">{review.repoName}</p>
              <h3 className="mt-3 text-lg font-semibold text-white">{review.prTitle}</h3>
              <p className="mt-2 text-sm leading-6 text-[#C1C1C1]">#{review.prNumber} · {review.author}</p>
            </div>
            <div className="rounded-3xl bg-[#1A1A1A] px-3 py-2 text-right text-sm text-[#A0A0A0]">
              <p className="text-white">{review.issueCounts.total} issues</p>
              <p className="mt-1 text-xs">{review.createdAt}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-[#1A1A1A] px-4 py-3 text-sm text-[#E4E4E4]">
              <p className="text-xs uppercase tracking-[0.24em] text-[#A0A0A0]">Critical</p>
              <p className="mt-2 text-lg font-semibold text-[#FF4444]">{review.issueCounts.critical}</p>
            </div>
            <div className="rounded-3xl bg-[#1A1A1A] px-4 py-3 text-sm text-[#E4E4E4]">
              <p className="text-xs uppercase tracking-[0.24em] text-[#A0A0A0]">Warning</p>
              <p className="mt-2 text-lg font-semibold text-[#FFB800]">{review.issueCounts.warning}</p>
            </div>
            <div className="rounded-3xl bg-[#1A1A1A] px-4 py-3 text-sm text-[#E4E4E4]">
              <p className="text-xs uppercase tracking-[0.24em] text-[#A0A0A0]">Nitpick</p>
              <p className="mt-2 text-lg font-semibold text-[#4A9EFF]">{review.issueCounts.nitpick}</p>
            </div>
          </div>

          <Link
            href={`/reviews/${review.id}`}
            className="mt-6 inline-flex items-center justify-center rounded-full border border-[#582688]/20 bg-[#582688]/10 px-4 py-3 text-sm font-semibold text-[#E9D9FF] transition hover:bg-[#582688]/20"
          >
            View full review
          </Link>
        </article>
      ))}
    </div>
  );
}
