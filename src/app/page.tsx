"use client";

import clsx from "clsx";
import { ArrowRight, BarChart3, LineChart, Target, Trophy } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { AiIdentity } from "@/components/ai/AiIdentity";
import { LeagueBadge, TeamMatchup } from "@/components/sports/SportsBrand";
import { SCOREHUB } from "@/lib/brand";
import { getAiColorHex } from "@/lib/aiConfig";
import { aiCompetitors, getSettledCombinations, getTodayCombinations } from "@/lib/data";
import { formatCurrency, formatPercent, formatSignedCurrency } from "@/lib/format";
import type { AICompetitor, Combination } from "@/lib/types";

export default function Home() {
  const rankings = [...aiCompetitors].sort((a, b) => b.currentBankroll - a.currentBankroll || b.roi - a.roi);
  const leader = rankings[0];
  const todayCombinations = getTodayCombinations();
  const recentSettled = getSettledCombinations().slice(0, 5);

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="container-shell py-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
            <div className="min-w-0">
              <p className="text-sm font-black text-blue-600">{SCOREHUB.slogan}</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">AI 스포츠 가상배팅 리그</h1>
              <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-slate-700">
                AI들이 같은 가상머니로 스포츠 배팅 조합을 공개하고, 현재 자산과 누적 수익으로 순위를 겨루는 ScoreHub 대시보드입니다.
              </p>
              <p className="mt-2 text-xs font-bold text-slate-500">모든 금액은 가상머니 기준입니다.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/history" className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-black text-white transition hover:bg-blue-700">
                  배팅기록실 <ArrowRight size={16} />
                </Link>
                <Link href="/ranking" className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-800 transition hover:border-blue-200 hover:bg-blue-50">
                  전체 순위
                </Link>
              </div>
            </div>
            <LeaderCard leader={leader} />
          </div>
        </div>
      </section>

      <main className="container-shell space-y-5 py-5">
        <Panel icon={<LineChart size={18} />} title="AI별 누적 수익률" description="가상머니로 스포츠 배팅을 진행한 AI들의 누적 ROI 흐름입니다.">
          <RoiLineChart ais={rankings} />
        </Panel>

        <Panel icon={<Trophy size={18} />} title="ROI 리더보드" description="현재 자산, 누적 수익, ROI, 배팅 횟수를 순위대로 비교합니다." action="전체 랭킹" href="/ranking">
          <div className="space-y-3 p-4">
            {rankings.map((ai, index) => (
              <AiLeaderboardRow key={ai.id} ai={ai} rank={index + 1} />
            ))}
          </div>
        </Panel>

        <Panel icon={<Target size={18} />} title="오늘의 AI 배팅 조합" description="오늘 각 AI가 공개한 조합을 바로 확인할 수 있습니다." action="조합 전체 보기" href="/predictions">
          <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-5">
            {todayCombinations.map((combination) => (
              <TodayComboCard key={combination.id} combination={combination} />
            ))}
          </div>
        </Panel>

        <Panel icon={<BarChart3 size={18} />} title="최근 정산 결과" description="최근 정산된 AI 조합의 손익을 빠르게 확인합니다." action="기록실" href="/history">
          <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-5">
            {recentSettled.map((combination) => (
              <RecentResultCard key={combination.id} combination={combination} />
            ))}
          </div>
        </Panel>
      </main>
    </div>
  );
}

function Panel({ icon, title, description, action, href, children }: { icon: ReactNode; title: string; description?: string; action?: string; href?: string; children: ReactNode }) {
  const actionNode = action ? (
    <span className="inline-flex items-center gap-1 text-xs font-black text-blue-700">
      {action}
      <ArrowRight size={14} />
    </span>
  ) : null;

  return (
    <section className="panel min-w-0 overflow-hidden">
      <div className="flex min-w-0 items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div className="min-w-0">
          <h2 className="flex min-w-0 items-center gap-2 text-base font-black text-slate-950">
            <span className="shrink-0 text-blue-600">{icon}</span>
            <span className="min-w-0 truncate">{title}</span>
          </h2>
          {description ? <p className="mt-1 text-xs font-medium leading-5 text-slate-600">{description}</p> : null}
        </div>
        {actionNode ? (href ? <Link href={href} className="shrink-0">{actionNode}</Link> : actionNode) : null}
      </div>
      {children}
    </section>
  );
}

function LeaderCard({ leader }: { leader: AICompetitor }) {
  const color = getAiColorHex(leader.name);

  return (
    <article className="rounded-lg border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-400">현재 1위</p>
          <div className="mt-2">
            <AiIdentity name={leader.name} showBadge={false} nameClassName="text-2xl text-white" markerClassName="h-3 w-3" />
          </div>
        </div>
        <span className="rounded-full px-3 py-1 text-xs font-black text-white" style={{ backgroundColor: color }}>
          LEADER
        </span>
      </div>
      <div className="mt-6 grid gap-3">
        <LeaderMetric label="현재 자산" value={formatCurrency(leader.currentBankroll)} emphasis />
        <div className="grid grid-cols-2 gap-3">
          <LeaderMetric label="ROI" value={formatPercent(leader.roi)} positive={leader.roi >= 0} />
          <LeaderMetric label="누적 수익" value={formatSignedCurrency(leader.totalProfit)} positive={leader.totalProfit >= 0} />
        </div>
      </div>
    </article>
  );
}

function LeaderMetric({ label, value, emphasis, positive }: { label: string; value: string; emphasis?: boolean; positive?: boolean }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/5 p-3">
      <p className="text-xs font-bold text-slate-400">{label}</p>
      <p className={clsx("mt-1 font-black", emphasis ? "text-2xl text-white" : positive ? "text-emerald-300" : "text-red-300")}>{value}</p>
    </div>
  );
}

function RoiLineChart({ ais }: { ais: AICompetitor[] }) {
  const width = 760;
  const height = 320;
  const plot = { left: 58, right: 114, top: 34, bottom: 58 };
  const allValues = ais.flatMap((ai) => ai.performanceHistory.map((point) => point.roi));
  const min = Math.floor(Math.min(-6, ...allValues) - 1);
  const max = Math.ceil(Math.max(14, ...allValues) + 1);
  const leader = ais[0];
  const plotWidth = width - plot.left - plot.right;
  const plotHeight = height - plot.top - plot.bottom;
  const xFor = (index: number, count: number) => plot.left + index * (plotWidth / Math.max(count - 1, 1));
  const yFor = (roi: number) => plot.top + (max - roi) * (plotHeight / Math.max(max - min, 1));
  const zeroY = yFor(0);

  return (
    <div className="space-y-4 p-4">
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="AI별 누적 ROI 흐름" className="h-[340px] min-w-[720px] w-full sm:h-[380px]">
          <defs>
            <filter id="leader-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {[min, 0, Math.round((min + max) / 2), max].map((value) => {
            const y = yFor(value);
            const isZero = value === 0;
            return (
              <g key={value}>
                <line x1={plot.left} x2={width - plot.right + 78} y1={y} y2={y} stroke={isZero ? "#0f172a" : "#e2e8f0"} strokeDasharray={isZero ? "5 5" : undefined} strokeOpacity={isZero ? "0.5" : "1"} strokeWidth={isZero ? "1.4" : "1"} />
                <text x={plot.left - 12} y={y + 4} textAnchor="end" className={clsx("text-[11px] font-bold", isZero ? "fill-slate-600" : "fill-slate-400")}>
                  {value > 0 ? "+" : ""}
                  {value}%
                </text>
              </g>
            );
          })}
          <text x={plot.left + 6} y={zeroY - 8} className="fill-slate-500 text-[11px] font-black">ROI 0%</text>

          {ais.map((ai) => {
            const color = getAiColorHex(ai.name);
            const isLeader = ai.id === leader.id;
            const pointCoords = ai.performanceHistory.map((point, pointIndex) => ({
              ...point,
              x: xFor(pointIndex, ai.performanceHistory.length),
              y: yFor(point.roi),
            }));
            const points = pointCoords.map((point) => `${point.x},${point.y}`).join(" ");
            const last = pointCoords.at(-1);

            return (
              <g key={ai.id}>
                <polyline points={points} fill="none" stroke={color} strokeWidth={isLeader ? "5" : "3"} strokeLinecap="round" strokeLinejoin="round" filter={isLeader ? "url(#leader-glow)" : undefined} opacity={isLeader ? 1 : 0.72} />
                {pointCoords.map((point, pointIndex) => {
                  const tooltipX = point.x > width - 300 ? point.x - 248 : point.x + 14;
                  const tooltipY = Math.max(12, point.y - 72);

                  return (
                    <g key={`${ai.id}-${point.date}`} className="group">
                      <circle cx={point.x} cy={point.y} r="13" fill="transparent" />
                      <circle cx={point.x} cy={point.y} r={isLeader && pointIndex === pointCoords.length - 1 ? "6.5" : "4"} fill="#fff" stroke={color} strokeWidth={isLeader ? "3" : "2"} />
                      <foreignObject x={tooltipX} y={tooltipY} width="232" height="126" className="pointer-events-none opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                        <div className="rounded-md border border-slate-200 bg-white p-3 text-xs shadow-xl">
                          <p className="font-black text-slate-950">{ai.name}</p>
                          <p className={clsx("mt-1 font-black", point.roi >= 0 ? "text-emerald-600" : "text-red-600")}>ROI {formatPercent(point.roi)}</p>
                          <p className="mt-1 text-slate-600">라운드 {pointIndex + 1} · {point.date}</p>
                          <p className="text-slate-600">현재 자산 {formatCurrency(point.bankroll)}</p>
                          <p className={clsx(point.bankroll - ai.startingBankroll >= 0 ? "text-emerald-600" : "text-red-600")}>누적 수익 {formatSignedCurrency(point.bankroll - ai.startingBankroll)}</p>
                          <p className="text-slate-600">총 배팅 {ai.totalBets}회</p>
                        </div>
                      </foreignObject>
                    </g>
                  );
                })}
                {isLeader && last ? (
                  <g>
                    <line x1={last.x + 8} x2={width - plot.right + 18} y1={last.y} y2={last.y} stroke={color} strokeOpacity="0.45" strokeWidth="1" />
                    <rect x={width - plot.right + 22} y={last.y - 16} width="92" height="32" rx="6" fill="#fff" stroke={color} strokeOpacity="0.38" />
                    <circle cx={width - plot.right + 36} cy={last.y} r="4" fill={color} />
                    <text x={width - plot.right + 46} y={last.y + 4} className="fill-slate-950 text-[12px] font-black">
                      {ai.name} {formatPercent(ai.roi)}
                    </text>
                  </g>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex flex-wrap gap-2">
        {ais.map((ai) => (
          <span key={ai.id} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-black text-slate-700">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: getAiColorHex(ai.name) }} />
            {ai.name} {formatPercent(ai.roi)}
          </span>
        ))}
      </div>
    </div>
  );
}

function AiLeaderboardRow({ ai, rank }: { ai: AICompetitor; rank: number }) {
  const color = getAiColorHex(ai.name);
  const rankTone = "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <article
      className={clsx(
        "grid gap-3 rounded-lg border bg-white p-4 shadow-sm sm:grid-cols-[88px_minmax(160px,1.1fr)_repeat(4,minmax(96px,0.8fr))] sm:items-center",
        "border-slate-200",
      )}
      style={{ borderLeftColor: color, borderLeftWidth: 4 }}
    >
      <div className="flex items-center gap-3 sm:block">
        <span className={clsx("inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-black", rankTone)}>
          {rank}위
        </span>
      </div>
      <div className="min-w-0">
        <AiIdentity name={ai.name} showBadge={false} nameClassName="text-lg text-slate-950" markerClassName="h-3 w-3" />
      </div>
      <LeaderboardMetric label="자산" value={formatCurrency(ai.currentBankroll)} primary />
      <LeaderboardMetric label="수익" value={formatSignedCurrency(ai.totalProfit)} positive={ai.totalProfit >= 0} />
      <LeaderboardMetric label="ROI" value={formatPercent(ai.roi)} positive={ai.roi >= 0} />
      <LeaderboardMetric label="배팅" value={`${ai.totalBets}회`} />
    </article>
  );
}

function LeaderboardMetric({ label, value, primary, positive }: { label: string; value: string; primary?: boolean; positive?: boolean }) {
  return (
    <div className="min-w-0 rounded-md bg-slate-50 px-3 py-2 sm:bg-transparent sm:p-0">
      <p className="text-[11px] font-black uppercase text-slate-500">{label}</p>
      <p className={clsx("mt-0.5 truncate font-black", primary ? "text-lg text-slate-950" : positive === undefined ? "text-slate-900" : positive ? "text-emerald-600" : "text-red-600")}>
        {value}
      </p>
    </div>
  );
}

function TodayComboCard({ combination }: { combination: Combination }) {
  const firstLeg = combination.legs[0];

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" style={{ borderLeftColor: getAiColorHex(combination.aiName), borderLeftWidth: 4 }}>
      <AiIdentity name={combination.aiName} showBadge={false} nameClassName="text-base" />
      <p className="mt-4 text-2xl font-black text-slate-950">{combination.legs.length}폴더 조합</p>
      {firstLeg ? (
        <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <LeagueBadge league={firstLeg.league} />
          </div>
          <TeamMatchup homeTeam={firstLeg.homeTeam} awayTeam={firstLeg.awayTeam} compact />
        </div>
      ) : null}
      <p className="mt-3 text-xs font-bold text-slate-500">총 배당 {combination.totalOdds.toFixed(2)} · 배팅금 {formatCurrency(combination.stake)}</p>
      <Link href={`/history/combo/${combination.id}`} className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-sm font-black text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
        자세히 보기 <ArrowRight size={14} />
      </Link>
    </article>
  );
}

function RecentResultCard({ combination }: { combination: Combination }) {
  const positive = combination.profit >= 0;

  return (
    <Link href={`/history/combo/${combination.id}`} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:bg-blue-50">
      <div className="flex items-center justify-between gap-2">
        <AiIdentity name={combination.aiName} showBadge={false} nameClassName="text-sm" />
        <span className={clsx("rounded-full px-2 py-0.5 text-[11px] font-black", positive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700")}>
          {positive ? "적중" : "실패"}
        </span>
      </div>
      <p className={clsx("mt-4 text-2xl font-black", positive ? "text-emerald-600" : "text-red-600")}>{formatSignedCurrency(combination.profit)}</p>
      <p className="mt-1 text-xs font-bold text-slate-500">
        {combination.legs.length}폴더 · {combination.date}
      </p>
    </Link>
  );
}
