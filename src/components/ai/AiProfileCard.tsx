import type { AICompetitor } from "@/lib/types";
import { formatPercent } from "@/lib/format";

type AiProfileCardProps = {
  ai: AICompetitor;
};

export function AiProfileCard({ ai }: AiProfileCardProps) {
  return (
    <article className="panel p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-black text-accent-green">
          {ai.initials}
        </span>
        <div>
          <h3 className="text-xl font-black text-white">{ai.name}</h3>
          <p className="mt-1 text-sm font-bold text-accent-green">{ai.analysisStyle}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-300">{ai.investmentPhilosophy}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {ai.signatureTraits.map((trait) => (
          <span key={trait} className="rounded-md border border-white/10 bg-black/20 px-2.5 py-1 text-xs font-semibold text-slate-300">
            {trait}
          </span>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-md border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-500">현재 시즌 ROI</p>
          <p className={ai.roi >= 0 ? "mt-1 font-black text-emerald-300" : "mt-1 font-black text-red-300"}>{formatPercent(ai.roi)}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-500">적중률</p>
          <p className="mt-1 font-black text-white">{ai.accuracy.toFixed(1)}%</p>
        </div>
      </div>
    </article>
  );
}
