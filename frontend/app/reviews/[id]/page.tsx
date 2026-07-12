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
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-6 lg:px-8">
      <section className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#A0A0A0]">Review detail</p>
            <h1 className="text-4xl font-semibold text-white">{review.prTitle}</h1>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#242424] px-4 py-3 text-sm text-[#A0A0A0]">
            <p className="font-semibold text-white">Repo</p>
            <p className="mt-2">{review.repoName}</p>
          </div>
        </div>
        <p className="max-w-3xl text-sm leading-6 text-[#C1C1C1]">Review generated for PR #{review.prNumber} by {review.author} on branch {review.branch}.</p>
      </section>

      <ReviewDetail review={review} />
    </main>
  );
}
