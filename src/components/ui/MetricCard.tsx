import clsx from "clsx";

type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
  tone?: "neutral" | "positive" | "negative" | "accent";
};

const toneStyles = {
  neutral: "text-slate-100",
  positive: "text-emerald-300",
  negative: "text-red-300",
  accent: "text-accent-green",
};

export function MetricCard({ label, value, detail, tone = "neutral" }: MetricCardProps) {
  return (
    <div className="panel p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={clsx("mt-3 text-2xl font-bold tracking-tight", toneStyles[tone])}>{value}</p>
      {detail ? <p className="mt-2 text-xs text-slate-500">{detail}</p> : null}
    </div>
  );
}
