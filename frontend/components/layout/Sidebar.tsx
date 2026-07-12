import Link from "next/link";

const links = [
  { href: "/", label: "Dashboard", icon: "▤" },
  { href: "/submit", label: "Submit diff", icon: "↗" },
];

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-white/10 bg-[#141414] px-5 py-6 font-sans lg:flex">
      <div className="flex items-center gap-3 border-b border-white/10 pb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#582688]/30 bg-[#582688]/15 text-sm font-semibold text-[#E9D9FF]">
          PR
        </div>
        <div>
          <p className="text-sm font-semibold text-white">PRism</p>
          <p className="text-xs text-[#7B7B7B]">Code review workspace</p>
        </div>
      </div>

      <nav className="mt-6 flex flex-col gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#B8B8B8] transition hover:bg-[#1E1E1E] hover:text-white"
          >
            <span className="text-base text-[#8C61B5]">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto rounded-lg border border-white/10 bg-[#191919] p-4 text-sm text-[#8C8C8C]">
        <p className="font-medium text-white">Review queue</p>
        <p className="mt-1 leading-5">Fast triage, structured findings, and no filler.</p>
      </div>
    </aside>
  );
}
