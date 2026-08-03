"use client";

import clsx from "clsx";
import { CheckCircle2, Clock3, Layers3, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { AiPill, currency, signedCurrency } from "@/components/scorehub/ScorehubPrimitives";
import { TeamMatchup } from "@/components/sports/SportsBrand";
import { LocalDateTime } from "@/components/ui/LocalDateTime";
import type { AiProfile } from "@/data/ai";
import type { AiBet, BetLeg } from "@/data/bets";

export function BettingRecordBoard({ bets, ais }: { bets: AiBet[]; ais: AiProfile[] }) {
  const [selectedAi, setSelectedAi] = useState("all");
  const filtered = useMemo(
    () => bets.filter((bet) => selectedAi === "all" || bet.aiId === selectedAi),
    [bets, selectedAi],
  );

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <p className="mb-3 text-xs font-black uppercase tracking-wide text-slate-500">정산 완료 기록 · AI 필터</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
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
          <p className="mt-1 text-sm font-medium text-slate-500">선택한 AI의 정산 완료 기록이 아직 없습니다.</p>
        </div>
      ) : null}
    </div>
  );
}

function SingleBetRow({ bet }: { bet: AiBet }) {
  const leg = bet.legs[0];
  return (
    <article className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[150px_minmax(0,1fr)_minmax(140px,auto)_80px_110px_110px] lg:items-center">
        <div><AiPill aiId={bet.aiId} compact /><p className="mt-1 text-[11px] font-bold text-slate-400"><LocalDateTime value={bet.registeredAt} mode="mobile" /></p></div>
        <div className="min-w-0"><p className="text-sm font-black text-slate-950">{leg ? <TeamMatchup homeTeam={leg.homeTeam} awayTeam={leg.awayTeam} selectedSide={leg.selectedSide} compact /> : "-"}</p><p className="mt-1 whitespace-normal text-xs font-bold text-blue-700 [overflow-wrap:anywhere]">{leg?.selection ?? "-"}</p></div>
        <div className="text-xs font-bold text-slate-500"><p>{leg?.league}</p><p className="mt-1 text-[11px] font-black text-blue-700">{leg?.market}</p><p className="mt-1 text-sm font-black text-slate-900">배당 {bet.totalOdds.toFixed(2)}</p></div>
        <ResultIcon result={leg?.result ?? "pending"} withLabel />
        <Money label="베팅금" value={currency(bet.stake)} />
        <Money label="손익" value={isPending(bet) ? "—" : signedCurrency(bet.profit)} tone={bet.profit} />
      </div>
    </article>
  );
}

function ParlaySlip({ bet }: { bet: AiBet }) {
  return (
    <article className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
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
      <div className="min-w-0"><p className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-slate-400"><span>{leg.league}</span><span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">{leg.market}</span></p><p className="mt-1 text-sm font-black text-slate-950"><TeamMatchup homeTeam={leg.homeTeam} awayTeam={leg.awayTeam} selectedSide={leg.selectedSide} compact /></p><p className="mt-1 whitespace-normal text-xs font-black text-blue-700 [overflow-wrap:anywhere]">픽: {leg.selection}</p></div>
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
