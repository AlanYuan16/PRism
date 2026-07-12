import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[linear-gradient(90deg,rgba(88,38,136,0.22),rgba(88,38,136,0.08))] px-4 py-4 backdrop-blur lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#A0A0A0]">PRism</p>
          <h2 className="text-lg font-semibold text-white">Review workspace</h2>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="hidden rounded-lg border border-white/10 bg-[#161616] px-3 py-2 text-sm font-medium text-[#D8D8D8] transition hover:border-[#582688]/40 hover:text-white lg:inline-flex">
            Dashboard
          </Link>
          <Link href="/submit" className="rounded-lg border border-[#582688]/30 bg-[#582688]/15 px-3 py-2 text-sm font-medium text-[#E9D9FF] transition hover:bg-[#582688]/25">
            Submit diff
          </Link>
        </div>
      </div>
    </header>
  );
}
