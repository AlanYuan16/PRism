"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard", icon: "▤" },
  { href: "/submit", label: "Submit diff", icon: "↗" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-white/[0.06] bg-[#141414] px-5 py-6 font-sans shadow-[0_1px_3px_rgba(0,0,0,0.4)] lg:flex">
      <div className="flex items-center gap-3 border-b border-white/[0.06] pb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#582688]/30 bg-[#582688]/15 text-sm font-semibold text-[#E9D9FF]">
          ◈
        </div>
        <div>
          <p className="text-sm font-semibold text-white">PRism</p>
          <p className="text-xs text-[#7B7B7B]">Code review workspace</p>
        </div>
      </div>

      <nav className="mt-6 flex flex-col gap-1">
        {links.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "border-[#582688] bg-white/[0.04] pl-[0.8rem] text-white"
                  : "border-transparent text-[#717171] hover:text-white"
              }`}
            >
              <span className={`text-base ${active ? "text-[#A07BD8]" : "text-[#7A7A7A]"}`}>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-white/[0.06] bg-[#191919] p-4 text-sm text-[#8C8C8C] shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
        <p className="font-medium text-white">Review queue</p>
        <p className="mt-1 leading-5">Fast triage, structured findings, and no filler.</p>
        <p className="mt-3 text-[11px] uppercase tracking-widest text-[#444]">v1.0.0</p>
      </div>
    </aside>
  );
}
