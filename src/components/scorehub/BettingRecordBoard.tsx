"use client";

import clsx from "clsx";
import { useMemo, useState } from "react";
import type { AiBet, BetLeg } from "@/data/bets";
import type { AiProfile } from "@/data/ai";
import { ComingSoonBadge } from "@/components/ai/AiIdentity";
import { TeamName as SportsTeamName } from "@/components/sports/SportsBrand";
import { LocalDateTime } from "@/components/ui/LocalDateTime";
import { AiPill, StatusBadge, currency, signedCurrency } from "./ScorehubPrimitives";

export function BettingRecordBoard({ bets, ais }: { bets: AiBet[]; ais: AiProfile[] }) {
  const [selectedAi, setSelectedAi] = useState("all");
  const rows = useMemo(() => bets.filter((bet) => selectedAi === "all" || bet.aiId === selectedAi), [bets, selectedAi]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <button type="button" onClick={() => setSelectedAi("all")} className={filterClass(selectedAi === "all")}>전체</button>
        {ais.map((ai) => (
          <button key={ai.id} type="button" onClick={() => setSelectedAi(ai.id)} className={filterClass(selectedAi === ai.id)}>
            {ai.name}
            {ai.total_picks === 0 ? <ComingSoonBadge className="ml-1.5" /> : null}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {rows.map((bet) => (
          <RecordCard key={bet.id} bet={bet} />
        ))}
      </div>
    </div>
  );
}

function RecordCard({ bet }: { bet: AiBet }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-3 border-b border-slate-100 p-4 lg:grid-cols-[minmax(0,1fr)_repeat(4,auto)] lg:items-center">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <AiPill aiId={bet.aiId} />
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700">{bet.kind === "combo" ? "조합" : "단일"}</span>
        </div>
        <Meta label="베팅시간" value={<LocalDateTime value={bet.registeredAt} mode="mobile" />} />
        <Meta label="총배당" value={bet.totalOdds.toFixed(2)} strong />
        <StatusBadge status={bet.status} />
      </div>

      <div className="divide-y divide-slate-100">
        {bet.legs.map((leg) => (
          <LegRow key={`${bet.id}-${leg.gameId}-${leg.selection}`} leg={leg} />
        ))}
      </div>

      <div className="grid gap-2 border-t border-slate-100 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <FooterMetric label="베팅금액" value={currency(bet.stake)} />
        <FooterMetric label="총배당" value={bet.totalOdds.toFixed(2)} />
        <FooterMetric label="반환금" value={currency(bet.returnAmount)} />
        <FooterMetric label="손익" value={signedCurrency(bet.profit)} tone={bet.profit >= 0 ? "positive" : "negative"} />
        <FooterMetric label="베팅 후 자산" value={currency(bet.bankrollAfter)} />
      </div>
    </article>
  );
}

function LegRow({ leg }: { leg: BetLeg }) {
  return (
    <div className="grid gap-3 p-4 text-sm lg:grid-cols-[86px_120px_minmax(0,1fr)_160px_90px_100px_90px] lg:items-center">
      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700">{leg.sport}</span>
      <span className="font-bold text-slate-500">{leg.league}</span>
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_24px_minmax(0,1fr)] sm:items-center">
        <TeamName name={leg.homeTeam} active={leg.selectedSide === "home"} />
        <span className="text-center text-xs font-black text-slate-400">vs</span>
        <TeamName name={leg.awayTeam} active={leg.selectedSide === "away"} />
      </div>
      <span className={clsx("rounded-md px-3 py-2 font-black", leg.selectedSide === "draw" || leg.selectedSide === "total" || leg.selectedSide === "handicap" ? "bg-blue-50 text-blue-700" : "bg-slate-50 text-slate-900")}>{leg.selection}</span>
      <span className="font-black text-blue-700">{leg.odds.toFixed(2)}</span>
      <span className="font-bold text-slate-700">{leg.finalScore ?? "-"}</span>
      <span className={clsx("font-black", leg.result === "won" ? "text-emerald-600" : leg.result === "lost" ? "text-red-600" : "text-slate-500")}>{resultLabel(leg.result)}</span>
    </div>
  );
}

function TeamName({ name, active }: { name: string; active: boolean }) {
  return <SportsTeamName team={name} size="sm" className={clsx("rounded-md px-3 py-2 font-black", active ? "bg-blue-50 text-blue-800" : "bg-white text-slate-950")} />;
}

function Meta({ label, value, strong }: { label: string; value: React.ReactNode; strong?: boolean }) {
  return <div><p className="text-[11px] font-black uppercase text-slate-500">{label}</p><p className={clsx("mt-0.5", strong ? "text-lg font-black text-blue-700" : "text-sm font-bold text-slate-700")}>{value}</p></div>;
}

function FooterMetric({ label, value, tone }: { label: string; value: string; tone?: "positive" | "negative" }) {
  return <div className="rounded-md bg-white px-3 py-2"><p className="text-[11px] font-black uppercase text-slate-500">{label}</p><p className={clsx("mt-0.5 font-black", tone === "positive" ? "text-emerald-600" : tone === "negative" ? "text-red-600" : "text-slate-950")}>{value}</p></div>;
}

function filterClass(active: boolean) {
  return clsx("shrink-0 rounded-md border px-3 py-2 text-sm font-black transition", active ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-blue-50");
}

function resultLabel(result: BetLeg["result"]) {
  return result === "won" ? "적중" : result === "lost" ? "미적중" : result === "void" ? "무효" : "진행중";
}
