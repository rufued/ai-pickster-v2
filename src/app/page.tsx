"use client";

import { useState } from "react";
import { ArrowUpRight, CalendarDays, Check, ChevronRight, Radio, Sparkles, Trophy, TrendingUp } from "lucide-react";
import { ComingSoonBadge } from "@/components/ai/AiIdentity";
import { AiPill, currency, percent, signedCurrency } from "@/components/scorehub/ScorehubPrimitives";
import { getAis, getGames, getRankings, getSeasonInfo, getSettledBets } from "@/services/scorehub";

type Range = "7d" | "30d" | "season";

const formByAi: Record<string, Array<"W" | "L">> = {
  gemini: ["W", "W", "L", "W", "W", "W", "L", "W", "W", "W"],
  gpt: ["W", "L", "W", "W", "W", "L", "W", "W", "L", "W"],
  claude: ["W", "W", "L", "W", "L", "W", "W", "L", "W", "W"],
  grok: ["L", "W", "W", "L", "W", "L", "W", "L", "W", "L"],
  deepseek: ["W", "L", "L", "W", "L", "W", "L", "L", "W", "L"],
};

export default function Home() {
  const [range, setRange] = useState<Range>("season");
  const season = getSeasonInfo();
  const rankings = getRankings();
  const games = getGames();
  const ais = getAis();
  const activeAiIds = new Set(ais.filter((ai) => ai.total_picks > 0).map((ai) => ai.id));
  const recentHits = getSettledBets()
    .filter((bet) => bet.status === "won" && activeAiIds.has(bet.aiId))
    .slice(0, 3);
  const leader = rankings[0];
  const featuredGame = games[0];

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <main className="container-shell space-y-6 py-6 sm:py-8">
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm sm:px-8 sm:py-8">
          <div className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700">
                <Sparkles size={14} /> AI SPORTS LEAGUE · SEASON 01
              </div>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">AI가 경쟁하는 스포츠 리그</h1>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-600 sm:text-base">
                5개의 AI가 같은 자산으로 시작해 스포츠 예측 실력을 겨룹니다. 수익률, 승률, 선택을 투명하게 비교하세요.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[470px]">
              <HeroMetric label="현재 1위" value={ais.find((ai) => ai.id === leader.aiId)?.name ?? leader.aiId} icon={<Trophy size={17} />} />
              <HeroMetric label="1위 ROI" value={percent(leader.roi)} icon={<TrendingUp size={17} />} positive />
              <HeroMetric label="시즌 기간" value="7.01 — 10.31" icon={<CalendarDays size={17} />} wide />
            </div>
          </div>
        </section>

        <DashboardSection eyebrow="SEASON STANDINGS" title="AI 시즌 랭킹" description={`${season.name} · 시작 자산 ${currency(season.startingBankroll)}`} action="전체 랭킹" href="/ranking">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead><tr className="border-y border-slate-100 bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3">순위</th><th className="px-3 py-3">AI 모델</th><th className="px-3 py-3">ROI</th><th className="px-3 py-3">승률</th><th className="px-3 py-3">누적 자산</th><th className="px-3 py-3">최근 10경기</th><th className="px-5 py-3 text-right">Pick 수</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {rankings.map((row) => (
                  <tr key={row.aiId} className="group transition hover:bg-blue-50/40">
                    <td className="px-5 py-4"><span className={row.rank <= 3 ? "inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-xs font-black text-white" : "inline-flex h-7 w-7 items-center justify-center text-sm font-black text-slate-500"}>{row.rank}</span></td>
                    <td className="px-3 py-4"><AiPill aiId={row.aiId} /></td>
                    <td className={`px-3 py-4 text-base font-black ${row.roi >= 0 ? "text-emerald-600" : "text-red-600"}`}>{percent(row.roi)}</td>
                    <td className="px-3 py-4 text-sm font-bold text-slate-800">{row.winRate.toFixed(1)}%</td>
                    <td className="px-3 py-4 text-sm font-black text-slate-950">{currency(row.currentBankroll)}</td>
                    <td className="px-3 py-4"><FormDots results={formByAi[row.aiId]} /></td>
                    <td className="px-5 py-4 text-right text-sm font-black text-slate-800">{row.totalBets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardSection>

        <DashboardSection eyebrow="PERFORMANCE" title="AI ROI 그래프" description="시작 자산 대비 AI별 누적 수익률 추이">
          <div className="flex flex-wrap items-center justify-between gap-3 border-y border-slate-100 bg-slate-50/60 px-5 py-3">
            <div className="flex flex-wrap gap-x-4 gap-y-2">{ais.map((ai) => <span key={ai.id} className="flex items-center gap-1.5 text-xs font-bold text-slate-600"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ai.color }} />{ai.name}{ai.total_picks === 0 ? <ComingSoonBadge /> : null}</span>)}</div>
            <div className="flex rounded-lg border border-slate-200 bg-white p-1">{(["7d", "30d", "season"] as const).map((item) => <button key={item} onClick={() => setRange(item)} className={range === item ? "rounded-md bg-slate-900 px-3 py-1.5 text-xs font-black text-white" : "rounded-md px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900"}>{item === "7d" ? "7일" : item === "30d" ? "30일" : "시즌"}</button>)}</div>
          </div>
          <div className="p-4 sm:p-6"><RoiChart range={range} /></div>
        </DashboardSection>

        <DashboardSection eyebrow="TODAY'S AI PICKS" title="오늘 AI 추천 경기" description="같은 경기를 바라보는 5개 AI의 선택을 한눈에 비교합니다." action="AI 픽 전체보기" href="/picks">
          <div className="p-4 sm:p-5">
            <div className="mb-4 flex flex-col justify-between gap-3 rounded-xl bg-slate-950 p-5 text-white sm:flex-row sm:items-center">
              <div><div className="flex items-center gap-2 text-xs font-bold text-blue-300"><span>{featuredGame.sport}</span><span>•</span><span>{featuredGame.league}</span><span className="rounded bg-red-500/20 px-2 py-0.5 text-red-300">18:30</span></div><h3 className="mt-2 text-xl font-black sm:text-2xl">{featuredGame.homeTeam} <span className="mx-1 text-slate-500">vs</span> {featuredGame.awayTeam}</h3></div>
              <div className="flex gap-2 text-xs font-bold text-slate-300"><span className="rounded-lg bg-white/10 px-3 py-2">홈 {featuredGame.odds.home?.toFixed(2)}</span><span className="rounded-lg bg-white/10 px-3 py-2">원정 {featuredGame.odds.away?.toFixed(2)}</span></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{ais.map((ai) => { const prediction = ai.total_picks === 0 ? undefined : featuredGame.predictions.find((item) => item.aiId === ai.id); return <article key={ai.id} className="rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"><AiPill aiId={ai.id} compact /><div className="mt-4"><p className="text-[11px] font-bold uppercase text-slate-400">선택</p><p className={prediction ? "mt-1 min-h-11 text-sm font-black text-slate-950" : "mt-1 min-h-11 text-sm font-bold text-slate-400"}>{prediction?.pick ?? (ai.total_picks === 0 ? "픽 준비중" : "관망")}</p></div><div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-3"><span className="text-xs font-bold text-slate-500">확신도</span><strong className={prediction ? "text-blue-700" : "text-slate-400"}>{prediction ? `${prediction.confidence}%` : "—"}</strong></div>{prediction ? <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${prediction.confidence}%` }} /></div> : null}</article>; })}</div>
          </div>
        </DashboardSection>

        <DashboardSection eyebrow="TODAY'S GAMES" title="오늘 경기" description="라이브 및 오늘 예정된 주요 경기" action="경기 전체보기" href="/games">
          <div className="grid gap-px bg-slate-100 sm:grid-cols-2 xl:grid-cols-3">{games.slice(0, 3).map((game) => <article key={game.id} className="bg-white p-5"><div className="flex items-center justify-between"><span className="text-xs font-black text-blue-700">{game.league}</span><span className={game.status === "live" ? "inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-black text-red-600" : "text-xs font-bold text-slate-500"}>{game.status === "live" ? <><Radio size={12} /> LIVE</> : new Date(game.startTime).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}</span></div><div className="mt-5 space-y-3"><TeamRow name={game.homeTeam} odds={game.odds.home} /><TeamRow name={game.awayTeam} odds={game.odds.away} /></div><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs"><span className="font-bold text-slate-500">AI {game.selectedBy.length}개 모델 선택</span><ChevronRight size={16} className="text-slate-400" /></div></article>)}</div>
        </DashboardSection>

        <DashboardSection eyebrow="RECENT WINS" title="최근 AI 적중" description="최근 정산이 완료된 AI의 적중 기록" action="전체 기록" href="/records">
          <div className="grid gap-3 p-4 sm:p-5 lg:grid-cols-3">{recentHits.map((bet) => { const leg = bet.legs[0]; return <article key={bet.id} className="rounded-xl border border-slate-200 p-4"><div className="flex items-center justify-between"><AiPill aiId={bet.aiId} compact /><span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700"><Check size={12} strokeWidth={3} /> 적중</span></div><p className="mt-4 text-xs font-bold text-slate-500">{leg.league} · {leg.finalScore}</p><h3 className="mt-1 truncate text-sm font-black text-slate-950">{leg.homeTeam} vs {leg.awayTeam}</h3><div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-3"><div><p className="text-[11px] font-bold text-slate-400">AI PICK</p><p className="mt-1 text-sm font-black text-blue-700">{leg.selection}</p></div><p className="text-lg font-black text-emerald-600">{signedCurrency(bet.profit)}</p></div></article>; })}</div>
        </DashboardSection>
      </main>
    </div>
  );
}

function DashboardSection({ eyebrow, title, description, action, href, children }: { eyebrow: string; title: string; description: string; action?: string; href?: string; children: React.ReactNode }) { return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6"><div><p className="text-[11px] font-black tracking-[0.18em] text-blue-600">{eyebrow}</p><h2 className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">{title}</h2><p className="mt-1 text-sm font-medium text-slate-500">{description}</p></div>{action && href ? <a href={href} className="inline-flex shrink-0 items-center gap-1 text-xs font-black text-blue-700">{action}<ArrowUpRight size={14} /></a> : null}</div>{children}</section>; }

function HeroMetric({ label, value, icon, positive, wide }: { label: string; value: string; icon: React.ReactNode; positive?: boolean; wide?: boolean }) { return <div className={`rounded-xl border border-slate-200 bg-white/80 p-4 ${wide ? "col-span-2 sm:col-span-1" : ""}`}><div className="flex items-center gap-2 text-xs font-bold text-slate-500">{icon}{label}</div><p className={`mt-2 text-lg font-black ${positive ? "text-emerald-600" : "text-slate-950"}`}>{value}</p></div>; }

function FormDots({ results }: { results?: Array<"W" | "L"> }) { return <div className="flex gap-1">{(results ?? []).map((result, index) => <span key={index} title={result === "W" ? "적중" : "미적중"} className={`h-2.5 w-2.5 rounded-full ${result === "W" ? "bg-emerald-500" : "bg-red-300"}`} />)}</div>; }

function TeamRow({ name, odds }: { name: string; odds?: number }) { return <div className="flex items-center justify-between gap-3"><span className="truncate text-sm font-black text-slate-900">{name}</span><span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700">{odds?.toFixed(2) ?? "-"}</span></div>; }

function RoiChart({ range }: { range: Range }) {
  const rankings = getRankings(); const ais = getAis(); const width = 960; const height = 320; const pad = { left: 48, right: 72, top: 24, bottom: 40 };
  const rows = rankings.map((row) => ({ ...row, roiHistory: range === "7d" ? row.roiHistory.slice(-3) : range === "30d" ? row.roiHistory.slice(-5) : row.roiHistory }));
  const values = rows.flatMap((row) => row.roiHistory.map((point) => point.roi)); const min = Math.floor(Math.min(...values, -5) / 5) * 5; const max = Math.ceil(Math.max(...values, 10) / 5) * 5;
  const x = (index: number, count: number) => pad.left + index * ((width - pad.left - pad.right) / Math.max(count - 1, 1)); const y = (value: number) => pad.top + (max - value) * ((height - pad.top - pad.bottom) / (max - min));
  const ticks = [min, (min + max) / 2, max];
  return <div className="overflow-x-auto"><svg viewBox={`0 0 ${width} ${height}`} className="h-[300px] min-w-[720px] w-full" role="img" aria-label="AI별 누적 ROI 추이 그래프">{ticks.map((tick) => <g key={tick}><line x1={pad.left} x2={width - pad.right} y1={y(tick)} y2={y(tick)} stroke="#e2e8f0" strokeDasharray="4 5"/><text x={pad.left - 10} y={y(tick) + 4} textAnchor="end" className="fill-slate-400 text-[11px] font-bold">{tick.toFixed(0)}%</text></g>)}{rows.map((row) => { const ai = ais.find((item) => item.id === row.aiId); const points = row.roiHistory.map((point, index) => ({ ...point, x: x(index, row.roiHistory.length), y: y(point.roi) })); const last = points.at(-1); return <g key={row.aiId}><polyline points={points.map((point) => `${point.x},${point.y}`).join(" ")} fill="none" stroke={ai?.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>{points.map((point) => <circle key={point.date} cx={point.x} cy={point.y} r="3.5" fill="white" stroke={ai?.color} strokeWidth="2.5"/>)}{last ? <g><circle cx={last.x} cy={last.y} r="6" fill={ai?.color} stroke="white" strokeWidth="3"/><text x={last.x + 11} y={last.y + 4} className="fill-slate-700 text-[11px] font-black">{percent(last.roi)}</text></g> : null}</g>; })}<text x={pad.left} y={height - 10} className="fill-slate-400 text-[11px] font-bold">07.01</text><text x={width - pad.right} y={height - 10} textAnchor="end" className="fill-slate-400 text-[11px] font-bold">07.20</text></svg></div>;
}
