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
    } catch  {
      setError("Unable to submit diff. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-[28px] border border-white/10 bg-[#242424] p-8 shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
      <div className="grid gap-6 lg:grid-cols-2">
        <label className="space-y-2 text-sm text-[#A0A0A0]">
          <span className="font-semibold text-white">Repository name</span>
          <input
            value={formState.repoName}
            onChange={handleChange("repoName")}
            className="w-full rounded-3xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none transition focus:border-[#582688]/60"
            placeholder="example/repo"
          />
        </label>
        <label className="space-y-2 text-sm text-[#A0A0A0]">
          <span className="font-semibold text-white">PR number</span>
          <input
            value={formState.prNumber}
            onChange={handleChange("prNumber")}
            className="w-full rounded-3xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none transition focus:border-[#582688]/60"
            placeholder="42"
          />
        </label>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <label className="space-y-2 text-sm text-[#A0A0A0]">
          <span className="font-semibold text-white">PR title</span>
          <input
            value={formState.title}
            onChange={handleChange("title")}
            className="w-full rounded-3xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none transition focus:border-[#582688]/60"
            placeholder="Improve CLI diff parsing"
          />
        </label>
        <label className="space-y-2 text-sm text-[#A0A0A0]">
          <span className="font-semibold text-white">Author</span>
          <input
            value={formState.author}
            onChange={handleChange("author")}
            className="w-full rounded-3xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none transition focus:border-[#582688]/60"
            placeholder="Samira K" 
          />
        </label>
      </div>
      <label className="space-y-2 text-sm text-[#A0A0A0]">
        <span className="font-semibold text-white">Git diff</span>
        <textarea
          value={formState.diff}
          onChange={handleChange("diff")}
          rows={12}
          className="min-h-[320px] w-full rounded-[28px] border border-white/10 bg-[#1A1A1A] px-4 py-4 text-sm text-white outline-none transition focus:border-[#582688]/60"
          placeholder="Paste the git diff here..."
        />
      </label>
      {error && <div className="rounded-3xl border border-[#FF4444]/30 bg-[#3D1515] px-4 py-3 text-sm text-[#FFCCCC]">{error}</div>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-full bg-[#582688] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6f3db7] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Submitting review..." : "Submit review"}
      </button>
    </form>
  );
}
