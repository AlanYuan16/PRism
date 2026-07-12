'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitReview } from "@/lib/api";
import type { SubmitReviewPayload } from "@/lib/types";

export function DiffSubmitForm() {
  const router = useRouter();
  const [formState, setFormState] = useState<SubmitReviewPayload>({
    repoName: "",
    prNumber: "",
    title: "",
    author: "",
    diff: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof SubmitReviewPayload) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!formState.repoName || !formState.prNumber || !formState.title || !formState.author || !formState.diff) {
      setError("All fields are required before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitReview(formState);
      router.push(`/reviews/${response.id}`);
    } catch {
      setError("Unable to submit diff. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-white/10 bg-[#1F1F1F] p-5 font-sans">
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-2 text-sm text-[#9A9A9A]">
          <span className="font-medium text-white">Repository</span>
          <input
            value={formState.repoName}
            onChange={handleChange("repoName")}
            className="w-full rounded-lg border border-white/10 bg-[#161616] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#582688]/60 focus:ring-1 focus:ring-[#582688]/40"
            placeholder="example/repo"
          />
        </label>
        <label className="space-y-2 text-sm text-[#9A9A9A]">
          <span className="font-medium text-white">PR number</span>
          <input
            value={formState.prNumber}
            onChange={handleChange("prNumber")}
            className="w-full rounded-lg border border-white/10 bg-[#161616] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#582688]/60 focus:ring-1 focus:ring-[#582688]/40"
            placeholder="42"
          />
        </label>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-2 text-sm text-[#9A9A9A]">
          <span className="font-medium text-white">PR title</span>
          <input
            value={formState.title}
            onChange={handleChange("title")}
            className="w-full rounded-lg border border-white/10 bg-[#161616] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#582688]/60 focus:ring-1 focus:ring-[#582688]/40"
            placeholder="Improve CLI diff parsing"
          />
        </label>
        <label className="space-y-2 text-sm text-[#9A9A9A]">
          <span className="font-medium text-white">Author</span>
          <input
            value={formState.author}
            onChange={handleChange("author")}
            className="w-full rounded-lg border border-white/10 bg-[#161616] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#582688]/60 focus:ring-1 focus:ring-[#582688]/40"
            placeholder="Samira K"
          />
        </label>
      </div>
      <label className="space-y-2 text-sm text-[#9A9A9A]">
        <span className="font-medium text-white">Diff payload</span>
        <textarea
          value={formState.diff}
          onChange={handleChange("diff")}
          rows={12}
          className="min-h-[320px] w-full rounded-lg border border-white/10 bg-[#161616] px-3 py-3 font-mono text-sm text-[#E8E8E8] outline-none transition focus:border-[#582688]/60 focus:ring-1 focus:ring-[#582688]/40"
          placeholder="Paste the git diff here..."
        />
      </label>
      {error && <div className="rounded-lg border border-[#FF4444]/25 bg-[#2E1515] px-3 py-2 text-sm text-[#FFB7B7]">{error}</div>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-lg bg-[#582688] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6f3db7] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Submitting review..." : "Submit review"}
      </button>
    </form>
  );
}
