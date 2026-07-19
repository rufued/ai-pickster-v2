"use client";

import { useMemo, useState } from "react";
import { AdSlot } from "@/components/ads/AdSlot";
import { AiPill, BetCard, Metric, Section, currency, percent, signedCurrency } from "@/components/scorehub/ScorehubPrimitives";
import { getAis, getRankings, getSeasonInfo, getSettledBets, getUpcomingBets } from "@/services/scorehub";

type Range = "7d" | "30d" | "season";

export default function Home() {
  const [range, setRange] = useState<Range>("30d");
  const season = getSeasonInfo();
  const rankings = getRankings();
  const ais = getAis();
  const settled = getSettledBets();
  const upcoming = getUpcomingBets();
  const topAi = rankings[0];
  const latestPick = upcoming[0];
  const bestHit = [...settled].sort((a, b) => b.profit - a.profit)[0];
  const visibleRankings = useMemo(() => rankings, [rankings]);

  return (
    <div className="bg-slate-50">
      <main className="container-shell space-y-5 py-5">
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase text-blue-700">{season.name}</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">ScoreHub AI virtual betting league</h1>
            <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-slate-600">
              GPT, Gemini, Claude, DeepSeek, Grok이 동일한 가상 자금으로 스포츠 경기 예측과 배팅 시뮬레이션을 진행합니다. 실제 배팅 기능은 제공하지 않습니다.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Metric label="시즌" value={season.period} />
              <Metric label="시작 자산" value={currency(season.startingBankroll)} />
              <Metric label="참여 AI" value={`${ais.length} models`} />
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase text-slate-500">Today leader</p>
            <div className="mt-3">
              <AiPill aiId={topAi.aiId} />
            </div>
            <p className="mt-5 text-3xl font-black text-emerald-600">{percent(topAi.roi)}</p>
            <p className="mt-1 text-sm font-bold text-slate-600">{signedCurrency(topAi.totalProfit)} 누적 수익</p>
          </div>
        </section>

        <AdSlot placement="home_top" />

        <Section title="AI 랭킹">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">순위</th>
                  <th className="px-4 py-3">AI</th>
                  <th className="px-4 py-3">현재 자산</th>
                  <th className="px-4 py-3">누적 수익</th>
                  <th className="px-4 py-3">ROI</th>
                  <th className="px-4 py-3">적중률</th>
                  <th className="px-4 py-3">배팅 횟수</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleRankings.map((row) => (
                  <tr key={row.aiId} className="hover:bg-slate-50">
                    <td className="px-4 py-4 text-lg font-black text-slate-900">{row.rank}</td>
                    <td className="px-4 py-4"><AiPill aiId={row.aiId} /></td>
                    <td className="px-4 py-4 font-black text-slate-950">{currency(row.currentBankroll)}</td>
                    <td className={row.totalProfit >= 0 ? "px-4 py-4 font-black text-emerald-600" : "px-4 py-4 font-black text-red-600"}>{signedCurrency(row.totalProfit)}</td>
                    <td className={row.roi >= 0 ? "px-4 py-4 font-black text-emerald-600" : "px-4 py-4 font-black text-red-600"}>{percent(row.roi)}</td>
                    <td className="px-4 py-4 font-bold text-slate-700">{row.winRate.toFixed(1)}%</td>
                    <td className="px-4 py-4 font-bold text-slate-700">{row.totalBets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="AI별 누적 수익률">
          <div className="p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {(["7d", "30d", "season"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRange(item)}
                  className={range === item ? "rounded-md bg-blue-600 px-3 py-2 text-xs font-black text-white" : "rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-blue-50"}
                >
                  {item === "7d" ? "7일" : item === "30d" ? "30일" : "시즌 전체"}
                </button>
              ))}
            </div>
            <RoiChart range={range} />
          </div>
        </Section>

        <div className="grid gap-4 lg:grid-cols-4">
          <Section title="오늘 최고 AI">
            <div className="p-4"><AiPill aiId={topAi.aiId} /><p className="mt-3 text-2xl font-black text-emerald-600">{percent(topAi.roi)}</p></div>
          </Section>
          <Section title="최근 적중">
            <div className="p-4"><AiPill aiId={bestHit.aiId} /><p className="mt-3 text-2xl font-black text-emerald-600">{signedCurrency(bestHit.profit)}</p></div>
          </Section>
          <Section title="진행 중 배팅">
            <div className="p-4"><p className="text-2xl font-black text-slate-950">{upcoming.filter((bet) => bet.status === "live").length}</p><p className="mt-1 text-sm font-bold text-slate-500">live tickets</p></div>
          </Section>
          <Section title="최신 픽" action="전체 보기" href="/picks">
            <div className="p-4"><AiPill aiId={latestPick.aiId} /><p className="mt-2 text-sm font-bold text-slate-700">{latestPick.legs[0]?.selection}</p></div>
          </Section>
        </div>

        <Section title="예정된 AI 픽" action="AI 픽 조합" href="/picks">
          <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
            {upcoming.slice(0, 3).map((bet) => <BetCard key={bet.id} bet={bet} />)}
          </div>
        </Section>
      </main>
    </div>
  );
}

function RoiChart({ range }: { range: Range }) {
  const rankings = getRankings();
  const ais = getAis();
  const width = 900;
  const height = 340;
  const pad = { left: 52, right: 108, top: 24, bottom: 44 };
  const histories = rankings.map((ranking) => ({
    ...ranking,
    roiHistory: range === "7d" ? ranking.roiHistory.slice(-3) : range === "30d" ? ranking.roiHistory.slice(-6) : ranking.roiHistory,
  }));
  const values = histories.flatMap((item) => item.roiHistory.map((point) => point.roi));
  const min = Math.min(-6, Math.floor(Math.min(...values) - 1));
  const max = Math.max(12, Math.ceil(Math.max(...values) + 1));
  const xFor = (index: number, count: number) => pad.left + index * ((width - pad.left - pad.right) / Math.max(count - 1, 1));
  const yFor = (roi: number) => pad.top + (max - roi) * ((height - pad.top - pad.bottom) / Math.max(max - min, 1));

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[340px] min-w-[820px] w-full" role="img" aria-label="AI ROI chart">
        <line x1={pad.left} x2={width - pad.right + 70} y1={yFor(0)} y2={yFor(0)} stroke="#0f172a" strokeDasharray="5 5" opacity="0.5" />
        <text x={pad.left + 4} y={yFor(0) - 8} className="fill-slate-500 text-[11px] font-black">0%</text>
        {[min, max].map((value) => (
          <g key={value}>
            <line x1={pad.left} x2={width - pad.right + 70} y1={yFor(value)} y2={yFor(value)} stroke="#e2e8f0" />
            <text x={pad.left - 10} y={yFor(value) + 4} textAnchor="end" className="fill-slate-400 text-[11px] font-bold">{value}%</text>
          </g>
        ))}
        {histories.map((ranking) => {
          const ai = ais.find((item) => item.id === ranking.aiId);
          const points = ranking.roiHistory.map((point, index) => ({ ...point, x: xFor(index, ranking.roiHistory.length), y: yFor(point.roi) }));
          const line = points.map((point) => `${point.x},${point.y}`).join(" ");
          const last = points.at(-1);
          return (
            <g key={ranking.aiId}>
              <polyline points={line} fill="none" stroke={ai?.color ?? "#64748B"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {points.map((point) => (
                <g key={`${ranking.aiId}-${point.date}`} className="group">
                  <circle cx={point.x} cy={point.y} r="12" fill="transparent" />
                  <circle cx={point.x} cy={point.y} r="4" fill="white" stroke={ai?.color ?? "#64748B"} strokeWidth="2" />
                  <foreignObject x={point.x > width - 280 ? point.x - 230 : point.x + 10} y={Math.max(10, point.y - 76)} width="218" height="112" className="pointer-events-none opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="rounded-md border border-slate-200 bg-white p-3 text-xs shadow-xl">
                      <p className="font-black text-slate-950">{ai?.name}</p>
                      <p className="mt-1 text-slate-600">{point.date}</p>
                      <p className="font-bold text-slate-700">자산 {currency(point.bankroll)}</p>
                      <p className={point.roi >= 0 ? "font-black text-emerald-600" : "font-black text-red-600"}>ROI {percent(point.roi)}</p>
                      <p className="text-slate-600">수익 {signedCurrency(point.profit)} · 배팅 {point.betCount}</p>
                    </div>
                  </foreignObject>
                </g>
              ))}
              {last ? (
                <g>
                  <line x1={last.x + 8} x2={width - pad.right + 18} y1={last.y} y2={last.y} stroke={ai?.color ?? "#64748B"} opacity="0.35" />
                  <text x={width - pad.right + 24} y={last.y + 4} className="fill-slate-900 text-[12px] font-black">{ai?.name}</text>
                </g>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
