interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  accentClass?: string;
}

export function StatCard({ title, value, subtitle, accentClass }: StatCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#1F1F1F] p-4">
      <div className={`h-px w-10 ${accentClass ?? "bg-[#582688]"}`} />
      <div className="mt-4 flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#8C8C8C]">{title}</span>
        <h3 className="text-3xl font-semibold tracking-tight text-white">{value}</h3>
        <p className="text-sm leading-5 text-[#8C8C8C]">{subtitle}</p>
      </div>
    </div>
  );
}
