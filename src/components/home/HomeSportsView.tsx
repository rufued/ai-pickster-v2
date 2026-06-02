"use client";

import { useMemo, useState } from "react";
import { BattleCard } from "@/components/battle/BattleCard";
import { CombinationCard } from "@/components/combinations/CombinationCard";
import { DecisionProcessCard } from "@/components/decision/DecisionProcessCard";
import { FeaturedMatches } from "@/components/home/FeaturedMatches";
import { SportsSidebar } from "@/components/sports/SportsSidebar";
import { formatPercent } from "@/lib/format";
import { getSportFromParam } from "@/lib/sports";
import type { AICompetitor, AIDecisionProcess, AnalysisMatch, Combination, FeaturedMatch } from "@/lib/types";

type HomeSportsViewProps = {
  ais: AICompetitor[];
  combinations: Combination[];
  decisionProcesses: AIDecisionProcess[];
  matches: FeaturedMatch[];
  battleMatches: AnalysisMatch[];
  fallbackBattleMatch: AnalysisMatch;
};

export function HomeSportsView({ ais, combinations, decisionProcesses, matches, battleMatches, fallbackBattleMatch }: HomeSportsViewProps) {
  const [selectedSport, setSelectedSport] = useState("all");
  const sport = getSportFromParam(selectedSport);
  const filteredCombinations = useMemo(
    () => (sport ? combinations.filter((combination) => combination.selections.some((selection) => selection.sport === sport)) : combinations),
    [combinations, sport],
  );
  const filteredMatches = useMemo(() => (sport ? matches.filter((match) => match.sport === sport) : matches), [matches, sport]);
  const filteredBattleMatches = useMemo(() => (sport ? battleMatches.filter((match) => match.sport === sport) : battleMatches), [battleMatches, sport]);
  const selectedBattleMatch = filteredBattleMatches[0] ?? fallbackBattleMatch;

  return (
    <div className="container-shell grid gap-6 py-12 lg:grid-cols-[220px_1fr]">
      <SportsSidebar activeSport={selectedSport} onSportChange={setSelectedSport} />
      <main className="space-y-12">
        <section>
          <div className="mb-5">
            <p className="text-sm font-semibold text-accent-green">Today Combinations</p>
            <h2 className="mt-2 text-2xl font-black text-white">오늘의 AI 조합</h2>
            <p className="mt-2 text-sm text-slate-400">선택한 종목이 포함된 AI 조합만 표시합니다.</p>
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            {filteredCombinations.map((combination) => (
              <CombinationCard key={combination.id} combination={combination} compact />
            ))}
          </div>
          {filteredCombinations.length === 0 ? <EmptySportState /> : null}
        </section>

        <section>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-accent-green">ROI Leaderboard</p>
              <h2 className="mt-2 text-2xl font-black text-white">최근 30일 ROI 리더보드</h2>
            </div>
            <p className="text-sm text-slate-400">시즌 성적과 최근 흐름은 별도로 봅니다.</p>
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            {[...ais].sort((a, b) => b.recent30DayRoi - a.recent30DayRoi).map((ai) => (
              <RecentPerformanceCard key={ai.id} ai={ai} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-5">
            <p className="text-sm font-semibold text-accent-green">AI Battle Arena</p>
            <h2 className="mt-2 text-2xl font-black text-white">오늘의 AI 배틀</h2>
            <p className="mt-2 text-sm text-slate-400">선택한 종목의 대표 AI 의견 대결을 확인합니다.</p>
          </div>
          {filteredBattleMatches.length > 0 ? <BattleCard match={selectedBattleMatch} featured /> : <EmptySportState />}
        </section>

        <section>
          <div className="mb-5">
            <p className="text-sm font-semibold text-accent-green">AI Decision Process</p>
            <h2 className="mt-2 text-2xl font-black text-white">AI 의사결정 과정</h2>
            <p className="mt-2 text-sm text-slate-400">분석한 경기에서 후보를 좁히고 최종 조합만 선택합니다.</p>
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            {decisionProcesses.map((process) => (
              <DecisionProcessCard key={process.aiName} process={process} />
            ))}
          </div>
        </section>

        <FeaturedMatches matches={filteredMatches} contained={false} />
        {filteredMatches.length === 0 ? <EmptySportState /> : null}
      </main>
    </div>
  );
}

function EmptySportState() {
  return (
    <div className="panel mt-4 p-5 text-sm text-slate-400">
      현재 더미데이터에는 해당 종목 경기가 없습니다. 실제 API 연동 시 이 영역에 종목별 경기와 AI 분석이 표시됩니다.
    </div>
  );
}

function RecentPerformanceCard({ ai }: { ai: AICompetitor }) {
  const latestTrend = ai.recentRoiTrend.at(-1) ?? ai.recent30DayRoi;
  const previousTrend = ai.recentRoiTrend.at(-2) ?? latestTrend;
  const trendDiff = latestTrend - previousTrend;

  return (
    <article className="panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-500">
            {ai.name} · {ai.analysisStyle}
          </p>
          <p className={ai.recent30DayRoi >= 0 ? "mt-2 text-4xl font-black text-emerald-300" : "mt-2 text-4xl font-black text-red-300"}>
            {formatPercent(ai.recent30DayRoi)}
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-400">최근 30일 ROI</p>
        </div>
        <span className="rounded-md border border-accent-green/30 bg-accent-green/10 px-2.5 py-1 text-xs font-black text-accent-green">
          신뢰도 {ai.reliabilityGrade}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <HeroStat label="적중률" value={`${ai.recent30DayAccuracy}%`} />
        <HeroStat label="승 / 패" value={`${ai.recent30DayWins} / ${ai.recent30DayLosses}`} />
      </div>

      <div className="mt-4 rounded-md border border-white/10 bg-black/20 p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold text-slate-400">최근 10픽</p>
          <p className={trendDiff >= 0 ? "text-xs font-black text-emerald-300" : "text-xs font-black text-red-300"}>
            ROI {trendDiff >= 0 ? "+" : ""}
            {trendDiff.toFixed(1)}%p
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {ai.recent10Results.map((result, index) => (
            <span
              key={`${ai.id}-home-recent-${index}`}
              className={
                result === "적중"
                  ? "flex h-6 w-6 items-center justify-center rounded-md bg-emerald-400/15 text-[11px] font-black text-emerald-300"
                  : "flex h-6 w-6 items-center justify-center rounded-md bg-red-400/15 text-[11px] font-black text-red-300"
              }
            >
              {result === "적중" ? "O" : "X"}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-black text-white sm:text-base">{value}</p>
    </div>
  );
}

