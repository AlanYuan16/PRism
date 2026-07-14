import type { Severity } from "@/lib/types";

interface BadgeProps {
  severity: Severity;
}

const severityStyles: Record<Severity, string> = {
  critical: "bg-[#FF4444]/15 text-[#FF4444] border border-[#FF4444]/20",
  warning: "bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/20",
  nitpick: "bg-[#4A9EFF]/15 text-[#4A9EFF] border border-[#4A9EFF]/20",
};

const severityLabels: Record<Severity, string> = {
  critical: "Critical",
  warning: "Warning",
  nitpick: "Nitpick",
};

export function Badge({ severity }: BadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${severityStyles[severity]}`}>
      {severityLabels[severity]}
    </span>
  );
}
