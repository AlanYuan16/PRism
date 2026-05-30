import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#1B1B1B]/95 backdrop-blur-xl px-4 py-4 shadow-[0_1px_0_rgba(255,255,255,0.04)] lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#A0A0A0]">PRism</p>
          <h2 className="text-xl font-semibold text-white">Review dashboard</h2>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden rounded-full border border-white/10 bg-[#242424] px-4 py-2 text-sm font-semibold text-white transition hover:border-[#582688]/40 lg:inline-flex"
          >
            Dashboard
          </Link>
          <Link
            href="/submit"
            className="rounded-full border border-[#582688] bg-[#582688]/10 px-4 py-2 text-sm font-semibold text-[#E9D9FF] transition hover:bg-[#582688]/20"
          >
            Submit diff
          </Link>
        </div>
      </div>
    </header>
  );
}
