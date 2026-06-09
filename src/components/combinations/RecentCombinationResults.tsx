import { AiIdentity } from "@/components/ai/AiIdentity";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatSignedCurrency } from "@/lib/format";
import type { Combination } from "@/lib/types";

type RecentCombinationResultsProps = {
  combinations: Combination[];
};

export function RecentCombinationResults({ combinations }: RecentCombinationResultsProps) {
  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-4">
        <p className="text-sm font-semibold text-blue-600">Settled Combinations</p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">최근 조합 결과</h2>
      </div>
      <div className="divide-y divide-slate-100">
        {combinations.map((combination) => (
          <div key={combination.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1.2fr_1fr_auto_auto] md:items-center">
            <div>
              <p className="inline-flex items-center gap-2 font-semibold text-slate-900">
                <AiIdentity name={combination.aiName} showBadge={false} /> · {combination.selections.length}폴더
              </p>
              <p className="mt-1 text-sm text-slate-600">
                조합 지수 {combination.totalOdds.toFixed(1)} · {combination.result}
              </p>
            </div>
            <p className="text-sm text-slate-700">{combination.selections.map((selection) => selection.prediction).join(" / ")}</p>
            <StatusBadge status={combination.status} />
            <p className={combination.profit >= 0 ? "font-bold text-emerald-600" : "font-bold text-red-600"}>{formatSignedCurrency(combination.profit)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
