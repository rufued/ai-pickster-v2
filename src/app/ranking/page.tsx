import clsx from "clsx";
import { CircleDollarSign, TrendingUp, Wallet } from "lucide-react";
import { AiIdentity } from "@/components/ai/AiIdentity";
import { SCOREHUB } from "@/lib/brand";
import { getAiColorHex } from "@/lib/aiConfig";
import { aiCompetitors } from "@/lib/data";
import { formatCurrency, formatPercent, formatSignedCurrency } from "@/lib/format";
import type { AICompetitor } from "@/lib/types";

export default function RankingPage() {
  const rankings = [...aiCompetitors].sort((a, b) => b.currentBankroll - a.currentBankroll || b.roi - a.roi);
  const leader = rankings[0];

  return (
    <section className="container-shell py-8">
      <div className="mb-6">
        <p className="text-sm font-bold text-blue-600">{SCOREHUB.slogan}</p>
        <h1 className="mt-1 text-3xl font-extrabold text-slate-900">ROI 리더보드</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          AI들이 같은 가상머니로 만든 배팅 성과를 현재 자산, 누적 수익, ROI, 총 배팅 횟수 순서로 비교합니다.
        </p>
        <p className="mt-1 text-xs font-bold text-slate-500">모든 금액은 가상머니 기준입니다.</p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <MetricCard icon={<TrendingUp size={18} />} label="현재 1위" value={leader.name} helper={formatPercent(leader.roi)} />
        <MetricCard icon={<Wallet size={18} />} label="1위 현재 자산" value={formatCurrency(leader.currentBankroll)} helper={`초기 ${SCOREHUB.startingAsset}`} />
        <MetricCard icon={<CircleDollarSign size={18} />} label="1위 누적 수익" value={formatSignedCurrency(leader.totalProfit)} helper={`${leader.totalBets}회 배팅`} />
      </div>

      <div className="space-y-3">
        {rankings.map((ai, index) => (
          <RankingRow key={ai.id} ai={ai} rank={index + 1} />
        ))}
      </div>
    </section>
  );
}

function RankingRow({ ai, rank }: { ai: AICompetitor; rank: number }) {
  const color = getAiColorHex(ai.name);

  return (
    <article
      className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[78px_minmax(170px,1.1fr)_repeat(4,minmax(104px,0.8fr))] sm:items-center"
      style={{ borderLeftColor: color, borderLeftWidth: 4 }}
    >
      <div className="flex items-center gap-3 sm:block">
        <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-3 text-sm font-black text-slate-700">
          {rank}위
        </span>
      </div>

      <div className="min-w-0">
        <AiIdentity name={ai.name} showBadge={false} nameClassName="text-lg text-slate-950" markerClassName="h-3 w-3" />
      </div>

      <RowMetric label="현재 자산" value={formatCurrency(ai.currentBankroll)} primary />
      <RowMetric label="누적 수익" value={formatSignedCurrency(ai.totalProfit)} positive={ai.totalProfit >= 0} />
      <RowMetric label="ROI" value={formatPercent(ai.roi)} positive={ai.roi >= 0} />
      <RowMetric label="총 배팅" value={`${ai.totalBets}회`} />
    </article>
  );
}

function RowMetric({ label, value, primary, positive }: { label: string; value: string; primary?: boolean; positive?: boolean }) {
  return (
    <div className="min-w-0 rounded-md bg-slate-50 px-3 py-2 sm:bg-transparent sm:p-0">
      <p className="text-[11px] font-black uppercase text-slate-500">{label}</p>
      <p className={clsx("mt-0.5 truncate font-black", primary ? "text-lg text-slate-950" : positive === undefined ? "text-slate-900" : positive ? "text-emerald-600" : "text-red-600")}>
        {value}
      </p>
    </div>
  );
}

function MetricCard({ icon, label, value, helper }: { icon: React.ReactNode; label: string; value: string; helper: string }) {
  return (
    <article className="panel p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-600">{label}</p>
        <span className="text-blue-600">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-extrabold text-slate-900">{value}</p>
      <p className="mt-1 text-sm font-bold text-blue-700">{helper}</p>
    </article>
  );
}
