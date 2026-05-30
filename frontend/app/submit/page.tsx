import { DiffSubmitForm } from "@/components/reviews/DiffSubmitForm";

export default function SubmitPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-6 lg:px-8">
      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#A0A0A0]">Submit review</p>
            <h1 className="text-4xl font-semibold text-white">Launch a new code review</h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#C1C1C1]">
            Paste a git diff, provide PR context, and get issue findings from the backend analysis engine.
          </p>
        </div>
      </section>

      <DiffSubmitForm />
    </main>
  );
}
