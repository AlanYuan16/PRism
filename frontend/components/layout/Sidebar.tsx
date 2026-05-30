import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="hidden w-80 shrink-0 flex-col gap-8 border-r border-white/10 bg-[#141414] px-6 py-8 lg:flex">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-[#A0A0A0]">PRism</p>
        <h1 className="text-3xl font-semibold text-white">AI Code Review</h1>
        <p className="max-w-[15rem] text-sm leading-6 text-[#A0A0A0]">
          Review pull requests faster with issue summaries, severity grouping, and premium insights.
        </p>
      </div>

      <nav className="flex flex-col gap-2">
        <Link
          href="/"
          className="rounded-[18px] border border-white/10 bg-[#1B1B1B] px-4 py-3 text-sm font-semibold text-white transition hover:border-[#582688]/40 hover:bg-[#242424]"
        >
          Dashboard
        </Link>
        <Link
          href="/submit"
          className="rounded-[18px] border border-white/10 bg-[#1B1B1B] px-4 py-3 text-sm font-semibold text-white transition hover:border-[#582688]/40 hover:bg-[#242424]"
        >
          Submit a diff
        </Link>
      </nav>

      <div className="mt-auto rounded-[28px] bg-[#191919] p-5 text-sm leading-6 text-[#A0A0A0]">
        <p className="font-semibold text-white">Premium workflow</p>
        <p className="mt-2 text-[#A0A0A0]">Fast issue triage with severity insights and action-focused review summaries.</p>
      </div>
    </aside>
  );
}
