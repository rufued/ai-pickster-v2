"use client";

import clsx from "clsx";
import { CheckCircle2, Clock3, Layers3, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { AiPill, currency, signedCurrency } from "@/components/scorehub/ScorehubPrimitives";
import { TeamMatchup } from "@/components/sports/SportsBrand";
import { LocalDateTime } from "@/components/ui/LocalDateTime";
import type { AiProfile } from "@/data/ai";
import type { AiBet, BetLeg } from "@/data/bets";

type SettlementTab = "pending" | "settled";

export function BettingRecordBoard({ bets, ais }: { bets: AiBet[]; ais: AiProfile[] }) {
  const [selectedAi, setSelectedAi] = useState("all");
  const [tab, setTab] = useState<SettlementTab>("pending");
  const filtered = useMemo(
    () => bets.filter((bet) => (selectedAi === "all" || bet.aiId === selectedAi) && (tab === "pending" ? isPending(bet) : !isPending(bet))),
    [bets, selectedAi, tab],
  );
  const pendingCount = bets.filter(isPending).length;
  const settledCount = bets.length - pendingCount;

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
          <TabButton active={tab === "pending"} onClick={() => setTab("pending")} icon={<Clock3 size={15} />} label="정산 대기" count={pendingCount} />
          <TabButton active={tab === "settled"} onClick={() => setTab("settled")} icon={<CheckCircle2 size={15} />} label="정산 완료" count={settledCount} />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          <button type="button" onClick={() => setSelectedAi("all")} className={filterClass(selectedAi === "all")}>전체 AI</button>
          {ais.map((ai) => (
            <button key={ai.id} type="button" onClick={() => setSelectedAi(ai.id)} className={filterClass(selectedAi === ai.id)}>
              <AiPill aiId={ai.id} compact />
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-4">
        {filtered.map((bet) => bet.kind === "combo" ? <ParlaySlip key={bet.id} bet={bet} /> : <SingleBetRow key={bet.id} bet={bet} />)}
      </div>

      {!filtered.length ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="font-black text-slate-700">표시할 베팅 내역이 없습니다.</p>
          <p className="mt-1 text-sm font-medium text-slate-500">AI 또는 정산 상태 필터를 변경해 보세요.</p>
        </div>
      ) : null}
    </div>
  );
}

function TabButton({ active, onClick, icon, label, count }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; count: number }) {
  return (
    <button type="button" onClick={onClick} className={clsx("inline-flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-black transition", active ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-900")}>
      {icon}{label}<span className={clsx("rounded-full px-2 py-0.5 text-[11px]", active ? "bg-blue-50" : "bg-slate-200")}>{count}</span>
    </button>
  );
}

function SingleBetRow({ bet }: { bet: AiBet }) {
  const leg = bet.legs[0];
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[150px_minmax(0,1fr)_minmax(140px,auto)_80px_110px_110px] lg:items-center">
        <div><AiPill aiId={bet.aiId} compact /><p className="mt-1 text-[11px] font-bold text-slate-400"><LocalDateTime value={bet.registeredAt} mode="mobile" /></p></div>
        <div className="min-w-0"><p className="truncate text-sm font-black text-slate-950">{leg ? <TeamMatchup homeTeam={leg.homeTeam} awayTeam={leg.awayTeam} compact /> : "-"}</p><p className="mt-1 truncate text-xs font-bold text-blue-700">{leg?.selection ?? "-"}</p></div>
        <div className="text-xs font-bold text-slate-500">{leg?.league}<p className="mt-1 text-sm font-black text-slate-900">배당 {bet.totalOdds.toFixed(2)}</p></div>
        <ResultIcon result={leg?.result ?? "pending"} withLabel />
        <Money label="베팅금" value={currency(bet.stake)} />
        <Money label="손익" value={isPending(bet) ? "—" : signedCurrency(bet.profit)} tone={bet.profit} />
      </div>
    </article>
  );
}

function ParlaySlip({ bet }: { bet: AiBet }) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 px-4 py-3 text-white">
        <div className="flex items-center gap-3"><AiPill aiId={bet.aiId} compact /><span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-black"><Layers3 size={13} /> {bet.legs.length}폴더 조합</span></div>
        <div className="text-right"><p className="text-[11px] font-bold text-slate-400">베팅 생성</p><p className="text-xs font-black"><LocalDateTime value={bet.registeredAt} mode="mobile" /></p></div>
      </header>

      <div className="divide-y divide-slate-100">
        {bet.legs.map((leg, index) => <ParlayLeg key={`${bet.id}-${leg.gameId}`} leg={leg} index={index} />)}
      </div>

      <footer className="border-t border-slate-200 bg-slate-50 p-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Money label="총 배당" value={bet.totalOdds.toFixed(2)} prominent />
          <Money label="베팅금" value={currency(bet.stake)} />
          <Money label={isPending(bet) ? "예상 수익" : "손익"} value={isPending(bet) ? currency(bet.potentialProfit) : signedCurrency(bet.profit)} tone={isPending(bet) ? undefined : bet.profit} />
          <div className="rounded-lg bg-white p-3"><p className="text-[11px] font-bold text-slate-400">결과</p><div className="mt-1"><BetResult bet={bet} /></div></div>
        </div>
      </footer>
    </article>
  );
}

function ParlayLeg({ leg, index }: { leg: BetLeg; index: number }) {
  return (
    <div className="grid gap-3 p-4 sm:grid-cols-[28px_minmax(0,1fr)_100px_80px] sm:items-center">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-500">{index + 1}</span>
      <div className="min-w-0"><p className="text-[11px] font-bold text-slate-400">{leg.league}</p><p className="mt-1 truncate text-sm font-black text-slate-950"><TeamMatchup homeTeam={leg.homeTeam} awayTeam={leg.awayTeam} compact /></p><p className="mt-1 truncate text-xs font-black text-blue-700">픽: {leg.selection}</p></div>
      <div><p className="text-[11px] font-bold text-slate-400">개별 배당</p><p className="mt-1 font-black text-slate-950">{leg.odds.toFixed(2)}</p></div>
      <ResultIcon result={leg.result} withLabel />
    </div>
  );
}

function ResultIcon({ result, withLabel = false }: { result: BetLeg["result"]; withLabel?: boolean }) {
  const won = result === "won";
  const lost = result === "lost";
  const label = won ? "적중" : lost ? "실패" : result === "void" ? "무효" : "대기";
  return <span className={clsx("inline-flex items-center gap-1.5 text-xs font-black", won ? "text-emerald-600" : lost ? "text-red-600" : "text-slate-400")}>{won ? <CheckCircle2 size={18} /> : lost ? <XCircle size={18} /> : <Clock3 size={18} />}{withLabel ? label : <span className="sm:hidden">{label}</span>}</span>;
}

function BetResult({ bet }: { bet: AiBet }) {
  const result = bet.status === "won" ? "won" : bet.status === "lost" ? "lost" : "pending";
  return <ResultIcon result={result} withLabel />;
}

function Money({ label, value, tone, prominent = false }: { label: string; value: string; tone?: number; prominent?: boolean }) {
  return <div className="rounded-lg bg-white p-3"><p className="text-[11px] font-bold text-slate-400">{label}</p><p className={clsx("mt-1 font-black", prominent ? "text-xl text-blue-700" : tone == null ? "text-slate-950" : tone >= 0 ? "text-emerald-600" : "text-red-600")}>{value}</p></div>;
}

function isPending(bet: AiBet) {
  return bet.status === "scheduled" || bet.status === "live";
}

function filterClass(active: boolean) {
  return clsx("shrink-0 rounded-full border px-3 py-1.5 text-sm font-black transition", active ? "border-blue-600 bg-blue-600 text-white [&_*]:text-white" : "border-slate-200 bg-white text-slate-700 hover:border-blue-300");
}
