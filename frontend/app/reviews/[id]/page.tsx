import { getReviewById } from "@/lib/api";
import { ReviewDetail } from "@/components/reviews/ReviewDetail";

interface ReviewPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { id } = await params;
  const review = await getReviewById(id);

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 lg:px-8">
      <section className="rounded-xl border border-white/10 bg-[#1F1F1F] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#8C8C8C]">Review detail</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">{review.prTitle}</h1>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#151515] px-3 py-2 text-sm text-[#A0A0A0]">
            <p className="font-medium text-white">{review.repoName}</p>
            <p className="mt-1">PR #{review.prNumber} · {review.author}</p>
          </div>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#A0A0A0]">Generated on branch {review.branch} with the review summary and issue list below.</p>
      </section>

      <ReviewDetail review={review} />
    </main>
  );
}
