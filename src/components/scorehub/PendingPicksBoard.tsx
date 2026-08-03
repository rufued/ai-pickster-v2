"use client";

import clsx from "clsx";
import Link from "next/link";
import { Clock3, Layers3 } from "lucide-react";
import { useMemo, useState } from "react";
import { AiPill, currency } from "@/components/scorehub/ScorehubPrimitives";
import { TeamMatchup } from "@/components/sports/SportsBrand";
import { LocalDateTime } from "@/components/ui/LocalDateTime";
import type { AiProfile } from "@/data/ai";
import type { AiBet, BetLeg } from "@/data/bets";

export function PendingPicksBoard({ bets, ais }: { bets: AiBet[]; ais: AiProfile[] }) {
  const [selectedAi, setSelectedAi] = useState("all");
  const filtered = useMemo(
    () => bets.filter((bet) => selectedAi === "all" || bet.aiId === selectedAi),
    [bets, selectedAi],
  );

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <p className="mb-3 text-xs font-black uppercase tracking-wide text-slate-500">예정 베팅 · AI 필터</p>
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
        {filtered.map((bet) => bet.kind === "combo" ? <PendingParlay key={bet.id} bet={bet} /> : <PendingSingle key={bet.id} bet={bet} />)}
      </div>

      {!filtered.length ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="font-black text-slate-700">예정된 베팅이 없습니다.</p>
          <p className="mt-1 text-sm font-medium text-slate-500">선택한 AI의 미정산 픽이나 조합이 아직 없습니다.</p>
        </div>
      ) : null}
    </div>
  );
}

function PendingSingle({ bet }: { bet: AiBet }) {
  const leg = bet.legs[0];
  return (
    <article className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[140px_minmax(0,1fr)_80px_110px_120px_145px_70px] lg:items-center">
        <div><AiPill aiId={bet.aiId} compact /><p className="mt-1 text-[11px] font-bold text-slate-400"><LocalDateTime value={bet.registeredAt} mode="mobile" /></p></div>
        <LegMatchup leg={leg} />
        <Value label="총 배당" value={bet.totalOdds.toFixed(2)} />
        <Value label="베팅금액" value={currency(bet.stake)} />
        <Value label="예상수익" value={currency(bet.potentialProfit)} tone="positive" />
        <Value label="등록시간" value={<LocalDateTime value={bet.registeredAt} mode="mobile" />} />
        <div className="flex items-center justify-between gap-3 lg:block">
          <PendingBadge />
          <Link href={`/picks/${bet.id}`} className="text-xs font-black text-blue-700 hover:text-blue-900 lg:mt-2 lg:block">상세</Link>
        </div>
      </div>
    </article>
  );
}

function PendingParlay({ bet }: { bet: AiBet }) {
  return (
    <article className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 px-4 py-3 text-white">
        <div className="flex flex-wrap items-center gap-3 [&>span]:text-white"><AiPill aiId={bet.aiId} compact /><span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-black"><Layers3 size={13} /> {bet.legs.length}폴더 조합</span></div>
        <div className="flex items-center gap-3"><PendingBadge dark /><Link href={`/picks/${bet.id}`} className="text-xs font-black text-blue-300 hover:text-white">상세</Link></div>
      </header>

      <div className="divide-y divide-slate-100">
        {bet.legs.map((leg, index) => (
          <div key={`${bet.id}-${leg.gameId}`} className="grid gap-3 p-4 sm:grid-cols-[28px_minmax(0,1fr)_100px] sm:items-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-500">{index + 1}</span>
            <LegMatchup leg={leg} />
            <Value label="개별 배당" value={leg.odds.toFixed(2)} />
          </div>
        ))}
      </div>

      <footer className="border-t border-slate-200 bg-slate-50 p-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ValueBox label="총 배당" value={bet.totalOdds.toFixed(2)} prominent />
          <ValueBox label="베팅금액" value={currency(bet.stake)} />
          <ValueBox label="예상수익" value={currency(bet.potentialProfit)} tone="positive" />
          <ValueBox label="등록시간" value={<LocalDateTime value={bet.registeredAt} mode="mobile" />} />
        </div>
      </footer>
    </article>
  );
}

function LegMatchup({ leg }: { leg?: BetLeg }) {
  if (!leg) return <div className="text-sm font-bold text-slate-400">경기 정보 없음</div>;
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-bold text-slate-400">{leg.league}</p>
      <p className="mt-1 text-sm font-black text-slate-950"><TeamMatchup homeTeam={leg.homeTeam} awayTeam={leg.awayTeam} selectedSide={leg.selectedSide} compact /></p>
      <p className="mt-1 whitespace-normal text-xs font-black text-blue-700 [overflow-wrap:anywhere]">픽: {leg.selection}</p>
    </div>
  );
}

function PendingBadge({ dark = false }: { dark?: boolean }) {
  return <span className={clsx("inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black", dark ? "bg-blue-500/20 text-blue-200" : "bg-blue-50 text-blue-700")}><Clock3 size={13} /> 예정</span>;
}

function Value({ label, value, tone }: { label: string; value: React.ReactNode; tone?: "positive" }) {
  return <div><p className="text-[11px] font-bold text-slate-400">{label}</p><p className={clsx("mt-1 text-sm font-black", tone === "positive" ? "text-emerald-600" : "text-slate-950")}>{value}</p></div>;
}

function ValueBox({ label, value, tone, prominent = false }: { label: string; value: React.ReactNode; tone?: "positive"; prominent?: boolean }) {
  return <div className="rounded-lg bg-white p-3"><p className="text-[11px] font-bold text-slate-400">{label}</p><p className={clsx("mt-1 font-black", prominent ? "text-xl text-blue-700" : tone === "positive" ? "text-emerald-600" : "text-slate-950")}>{value}</p></div>;
}

function filterClass(active: boolean) {
  return clsx("shrink-0 rounded-full border px-3 py-1.5 text-sm font-black transition", active ? "border-blue-600 bg-blue-600 text-white [&_*]:text-white" : "border-slate-200 bg-white text-slate-700 hover:border-blue-300");
}
