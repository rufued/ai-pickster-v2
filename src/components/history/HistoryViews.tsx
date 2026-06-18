import Link from "next/link";
import { AiIdentity } from "@/components/ai/AiIdentity";
import { aiModels } from "@/lib/data";
import { formatCurrency, formatSignedCurrency } from "@/lib/format";
import type { AICompetitor, Combination } from "@/lib/types";

export function HistoryHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <p className="text-sm font-bold text-blue-700">배팅기록실</p>
      <h1 className="mt-1 text-3xl font-black text-slate-950">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

export function SummaryGrid({ ais }: { ais: AICompetitor[] }) {
  const totalProfit = ais.reduce((sum, ai) => sum + ai.totalProfit, 0);
  const totalBets = ais.reduce((sum, ai) => sum + ai.totalBets, 0);
  const averageRoi = ais.reduce((sum, ai) => sum + ai.roi, 0) / Math.max(ais.length, 1);

  return (
    <div className="mb-5 grid gap-3 md:grid-cols-4">
      <SummaryCard label="현재 자산 합계" value={formatCurrency(ais.reduce((sum, ai) => sum + ai.currentBankroll, 0))} />
      <SummaryCard label="누적 수익" value={formatSignedCurrency(totalProfit)} tone={totalProfit >= 0 ? "positive" : "negative"} />
      <SummaryCard label="평균 ROI" value={`${averageRoi > 0 ? "+" : ""}${averageRoi.toFixed(1)}%`} tone={averageRoi >= 0 ? "positive" : "negative"} />
      <SummaryCard label="총 배팅 횟수" value={`${totalBets}회`} />
    </div>
  );
}

export function AiFilterLinks({ active }: { active: string }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-3">
      <Link href="/history" className={active === "all" ? activeClass : inactiveClass}>전체</Link>
      {aiModels.map((ai) => (
        <Link key={ai.id} href={`/history/${ai.id}`} className={active === ai.id ? activeClass : inactiveClass}>
          <AiIdentity name={ai.name} showBadge={false} nameClassName={active === ai.id ? "text-white" : "text-inherit"} />
        </Link>
      ))}
    </div>
  );
}

export function HistoryTable({ combinations: rows }: { combinations: Combination[] }) {
  return (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">AI</th>
              <th className="px-4 py-3">배팅일</th>
              <th className="px-4 py-3">조합 수</th>
              <th className="px-4 py-3">배팅금</th>
              <th className="px-4 py-3">총 배당</th>
              <th className="px-4 py-3">결과</th>
              <th className="px-4 py-3">수익</th>
              <th className="px-4 py-3">상세</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((combination) => (
              <tr key={combination.id} className="hover:bg-slate-50">
                <td className="px-4 py-4 font-black text-slate-950"><AiIdentity name={combination.aiName} showBadge={false} nameClassName="text-sm" /></td>
                <td className="px-4 py-4 text-slate-600">{combination.date}</td>
                <td className="px-4 py-4 font-bold text-slate-800">{combination.legs.length}폴더</td>
                <td className="px-4 py-4 text-slate-700">{formatCurrency(combination.stake)}</td>
                <td className="px-4 py-4 font-black text-blue-700">{combination.totalOdds.toFixed(2)}</td>
                <td className="px-4 py-4"><StatusBadge status={combination.status} result={combination.result} /></td>
                <td className={combination.profit >= 0 ? "px-4 py-4 font-black text-emerald-600" : "px-4 py-4 font-black text-red-600"}>{formatSignedCurrency(combination.profit)}</td>
                <td className="px-4 py-4">
                  <Link href={`/history/combo/${combination.id}`} className="rounded-md border border-blue-200 px-2.5 py-1 text-xs font-black text-blue-700 transition hover:bg-blue-600 hover:text-white">
                    보기
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, tone }: { label: string; value: string; tone?: "positive" | "negative" }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className={tone === "positive" ? "mt-2 text-2xl font-black text-emerald-600" : tone === "negative" ? "mt-2 text-2xl font-black text-red-600" : "mt-2 text-2xl font-black text-slate-950"}>{value}</p>
    </article>
  );
}

function StatusBadge({ status, result }: { status: Combination["status"]; result: string }) {
  const className =
    status === "won"
      ? "bg-emerald-50 text-emerald-700"
      : status === "lost"
        ? "bg-rose-50 text-rose-700"
        : "bg-blue-50 text-blue-700";

  return <span className={`rounded-full px-2.5 py-1 text-xs font-black ${className}`}>{result}</span>;
}

const activeClass = "inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-black text-white";
const inactiveClass = "inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700";
