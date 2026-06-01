import type { Combination } from "@/lib/types";
import { formatSignedCurrency } from "@/lib/format";
import { StatusBadge } from "@/components/ui/StatusBadge";

type RecentCombinationResultsProps = {
  combinations: Combination[];
};

export function RecentCombinationResults({ combinations }: RecentCombinationResultsProps) {
  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-sm font-semibold text-accent-blue">Settled Combinations</p>
        <h2 className="mt-1 text-xl font-bold text-white">최근 조합 결과</h2>
      </div>
      <div className="divide-y divide-white/10">
        {combinations.map((combination) => (
          <div key={combination.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1.2fr_1fr_auto_auto] md:items-center">
            <div>
              <p className="font-semibold text-white">
                {combination.aiName} · {combination.selections.length}폴더
              </p>
              <p className="mt-1 text-sm text-slate-500">
                배당 {combination.totalOdds.toFixed(2)} · {combination.result}
              </p>
            </div>
            <p className="text-sm text-slate-300">
              {combination.selections.map((selection) => selection.prediction).join(" / ")}
            </p>
            <StatusBadge status={combination.status} />
            <p className={combination.profit >= 0 ? "font-bold text-emerald-300" : "font-bold text-red-300"}>
              {formatSignedCurrency(combination.profit)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
