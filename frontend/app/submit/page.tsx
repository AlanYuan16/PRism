import { DiffSubmitForm } from "@/components/reviews/DiffSubmitForm";

export default function SubmitPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 lg:px-8">
      <section className="rounded-xl border border-white/10 bg-[#1F1F1F] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#8C8C8C]">Submit review</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">Queue a new review</h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#A0A0A0]">
            Share the diff and PR context. The review engine will return structured findings for inspection.
          </p>
        </div>
      </section>

      <DiffSubmitForm />
    </main>
  );
}
