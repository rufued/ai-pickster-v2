import { AiIdentity } from "@/components/ai/AiIdentity";
import type { AICompetitor } from "@/lib/types";
import { formatCurrency, formatPercent, formatSignedCurrency } from "@/lib/format";

type RankingTableProps = {
  ais: AICompetitor[];
};

export function RankingTable({ ais }: RankingTableProps) {
  return (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">순위</th>
              <th className="px-4 py-3">AI</th>
              <th className="px-4 py-3">신뢰도</th>
              <th className="px-4 py-3">분석 스타일</th>
              <th className="px-4 py-3">투자 철학</th>
              <th className="px-4 py-3">대표 특징</th>
              <th className="px-4 py-3">현재 자산</th>
              <th className="px-4 py-3">누적 수익</th>
              <th className="px-4 py-3">ROI</th>
              <th className="px-4 py-3">최근 30일 ROI</th>
              <th className="px-4 py-3">최근 조합</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {ais.map((ai, index) => (
              <tr key={ai.id}>
                <td className="px-4 py-4 font-bold text-accent-green">#{index + 1}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-xs font-black text-white">
                      {ai.initials}
                    </span>
                    <AiIdentity name={ai.name} showBadge={false} nameClassName="text-sm text-white" />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="rounded-md border border-accent-green/30 bg-accent-green/10 px-2.5 py-1 text-xs font-black text-accent-green">
                    {ai.reliabilityGrade}
                  </span>
                </td>
                <td className="px-4 py-4 font-semibold text-accent-green">{ai.analysisStyle}</td>
                <td className="px-4 py-4 text-slate-200">{ai.investmentPhilosophy}</td>
                <td className="px-4 py-4 text-slate-300">{ai.signatureTraits.slice(0, 2).join(" · ")}</td>
                <td className="px-4 py-4 font-semibold text-white">{formatCurrency(ai.currentBalance)}</td>
                <td className={ai.totalProfit >= 0 ? "px-4 py-4 font-semibold text-emerald-300" : "px-4 py-4 font-semibold text-red-300"}>
                  {formatSignedCurrency(ai.totalProfit)}
                </td>
                <td className={ai.roi >= 0 ? "px-4 py-4 font-semibold text-emerald-300" : "px-4 py-4 font-semibold text-red-300"}>
                  {formatPercent(ai.roi)}
                </td>
                <td className="px-4 py-4 font-semibold text-emerald-300">{formatPercent(ai.recent30DayRoi)}</td>
                <td className="px-4 py-4">
                  <div className="flex gap-1.5">
                    {ai.recentResults.map((result, resultIndex) => (
                      <span
                        key={`${ai.id}-${result}-${resultIndex}`}
                        className={result === "won" ? "h-2.5 w-2.5 rounded-full bg-emerald-400" : result === "lost" ? "h-2.5 w-2.5 rounded-full bg-red-400" : "h-2.5 w-2.5 rounded-full bg-blue-400"}
                      />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
