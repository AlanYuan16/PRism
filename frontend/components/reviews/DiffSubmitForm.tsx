'use client';

import { useState, type ChangeEvent, type FormEvent } from "react";
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

  const handleChange = (field: keyof SubmitReviewPayload) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-white/[0.06] bg-[#1F1F1F] p-6 font-sans shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-white">Submit a diff for review</h2>
        <p className="text-sm text-[#8C8C8C]">Share the PR diff and context to generate a streamlined review.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-2 text-sm text-[#9A9A9A]">
          <span className="font-medium text-white">Repository</span>
          <input
            value={formState.repoName}
            onChange={handleChange("repoName")}
            className="w-full rounded-lg border border-white/[0.08] bg-[#141414] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#582688]/50 focus:ring-1 focus:ring-[#582688]/20"
            placeholder="example/repo"
          />
        </label>
        <label className="space-y-2 text-sm text-[#9A9A9A]">
          <span className="font-medium text-white">PR number</span>
          <input
            value={formState.prNumber}
            onChange={handleChange("prNumber")}
            className="w-full rounded-lg border border-white/[0.08] bg-[#141414] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#582688]/50 focus:ring-1 focus:ring-[#582688]/20"
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
            className="w-full rounded-lg border border-white/[0.08] bg-[#141414] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#582688]/50 focus:ring-1 focus:ring-[#582688]/20"
            placeholder="Improve CLI diff parsing"
          />
        </label>
        <label className="space-y-2 text-sm text-[#9A9A9A]">
          <span className="font-medium text-white">Author</span>
          <input
            value={formState.author}
            onChange={handleChange("author")}
            className="w-full rounded-lg border border-white/[0.08] bg-[#141414] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#582688]/50 focus:ring-1 focus:ring-[#582688]/20"
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
          className="min-h-[320px] w-full rounded-lg border border-white/[0.08] bg-[#0D0D0D] px-3 py-3 font-mono text-xs text-[#E8E8E8] outline-none transition focus:border-[#582688]/50 focus:ring-1 focus:ring-[#582688]/20"
          placeholder="Paste the git diff here..."
        />
      </label>
      {error && <div className="rounded-lg border border-[#FF4444]/25 bg-[#2E1515] px-3 py-2 text-sm text-[#FFB7B7]">{error}</div>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-lg bg-[#582688] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6b31a0] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Submitting review...
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <span className="text-base leading-none">+</span>
            Submit review
          </span>
        )}
      </button>
    </form>
  );
}
