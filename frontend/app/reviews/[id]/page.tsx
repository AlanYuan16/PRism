import Link from "next/link";
import { getReviewById } from "@/lib/api";
import { ReviewDetail } from "@/components/reviews/ReviewDetail";
import type { ReviewDetail as ReviewDetailType } from "@/lib/types";

interface ReviewPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

async function loadReview(id: string): Promise<{ review: ReviewDetailType | null; error: string | null }> {
  try {
    const review = await getReviewById(id);
    return { review, error: null };
  } catch (error) {
    console.error(`Failed to load review ${id}`, error);
    return { review: null, error: "We could not load this review right now. Please try again in a moment." };
  }
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { id } = await params;
  const { review, error } = await loadReview(id);

  if (error || !review) {
    return (
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 font-sans lg:px-8">
        <section className="rounded-xl border border-[#FF4444]/20 bg-[#2E1515] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#FF9A9A]">Review unavailable</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">We could not load this review.</h1>
          <p className="mt-3 text-sm text-[#FFB7B7]">{error ?? "The requested review could not be found."}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/" className="rounded-full bg-[#582688] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#6b31a0]">
              Back to dashboard
            </Link>
            <Link href="/submit" className="rounded-full border border-white/[0.06] bg-[#1F1F1F] px-4 py-2 text-sm font-semibold text-[#DADADA] transition hover:bg-[#242424]">
              Submit another diff
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 font-sans lg:px-8">
      <section className="sticky top-4 z-20 rounded-xl border border-white/[0.06] bg-[#1F1F1F]/95 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.4)] backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#555]">Review detail</p>
            <h1 className="mt-1 text-xl font-semibold text-white">{review.prTitle}</h1>
            <p className="mt-2 text-sm text-[#8C8C8C]">{review.repoName} · PR #{review.prNumber} · {review.author}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/[0.06] bg-[#161616] px-3 py-1 text-[10px] uppercase tracking-widest text-[#A0A0A0]">
              {review.branch}
            </span>
            <span className="rounded-full bg-[#582688] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
              {review.issueCounts.total} issues
            </span>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-[#A0A0A0]">Generated on branch {review.branch} with the review summary and issue list below.</p>
      </section>

      <ReviewDetail review={review} />
    </main>
  );
}
