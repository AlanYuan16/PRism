interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  accentClass?: string;
}

export function StatCard({ title, value, subtitle, accentClass }: StatCardProps) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#242424] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.18)]">
      <div className={`h-1 w-16 rounded-full ${accentClass ?? "bg-[#582688]"}`} />
      <div className="mt-5 flex flex-col gap-3">
        <span className="text-sm uppercase tracking-[0.24em] text-[#A0A0A0]">{title}</span>
        <h3 className="text-3xl font-semibold text-white">{value}</h3>
        <p className="text-sm leading-6 text-[#A0A0A0]">{subtitle}</p>
      </div>
    </div>
  );
}
