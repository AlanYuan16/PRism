interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  accentClass?: string;
}

export function StatCard({ title, value, subtitle, accentClass }: StatCardProps) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#1F1F1F] p-5 font-sans shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
      <div className={`h-0 w-full border-t ${accentClass ?? "border-t-[#582688]"}`} />
      <div className="mt-4 flex flex-col gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#555]">{title}</span>
        <h3 className="text-3xl font-semibold text-white">{value}</h3>
        <p className="text-sm leading-5 text-[#8C8C8C]">{subtitle}</p>
      </div>
    </div>
  );
}
