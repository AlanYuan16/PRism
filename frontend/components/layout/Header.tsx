"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const pageLabel = pathname === "/submit" ? "Submit" : pathname.startsWith("/reviews/") ? "Review" : "Dashboard";
  const pageTitle = pathname === "/submit" ? "Submit a diff" : pathname.startsWith("/reviews/") ? "Review details" : "Review workspace";

  return (
    <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[linear-gradient(90deg,rgba(88,38,136,0.22),rgba(88,38,136,0.08))] px-4 py-4 font-sans backdrop-blur lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#555]">PRism / {pageLabel}</p>
          <h2 className="text-lg font-semibold text-white">{pageTitle}</h2>
        </div>
        <Link
          href="/submit"
          className="inline-flex items-center gap-2 rounded-full border border-[#582688]/30 bg-[#582688] px-4 py-2 text-sm font-medium text-white shadow-[0_1px_3px_rgba(0,0,0,0.4)] transition hover:bg-[#6b31a0]"
        >
          <span className="text-base leading-none">+</span>
          <span>Submit diff</span>
        </Link>
      </div>
    </header>
  );
}
