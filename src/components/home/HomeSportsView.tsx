"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import { ConsensusBadge } from "@/components/analysis/ConsensusBadge";
import { BattleCard } from "@/components/battle/BattleCard";
import { CombinationCard } from "@/components/combinations/CombinationCard";
import { DecisionProcessCard } from "@/components/decision/DecisionProcessCard";
import { FeaturedMatches } from "@/components/home/FeaturedMatches";
import { formatDateTime, formatPercent } from "@/lib/format";
import { getSportFromParam, normalizeSportCategoryId, sportCategories } from "@/lib/sports";
import type { AICompetitor, AIDecisionProcess, AnalysisMatch, Combination, FeaturedMatch, Match } from "@/lib/types";

type HomeSportsViewProps = {
  ais: AICompetitor[];
  combinations: Combination[];
  decisionProcesses: AIDecisionProcess[];
  matches: FeaturedMatch[];
  battleMatches: AnalysisMatch[];
  fallbackBattleMatch: AnalysisMatch;
  initialSport?: string;
  baseballApiMatches?: Match[];
};

export function HomeSportsView({ ais, combinations, decisionProcesses, matches, battleMatches, fallbackBattleMatch, initialSport = "all", baseballApiMatches }: HomeSportsViewProps) {
  const router = useRouter();
  const [selectedSport, setSelectedSport] = useState(() => normalizeSportCategoryId(initialSport));
  const sport = getSportFromParam(selectedSport);
  const selectedCategory = sportCategories.find((category) => category.id === selectedSport);
  const filteredMatches = useMemo(() => (sport ? matches.filter((match) => match.sport === sport) : matches), [matches, sport]);
  const filteredBattleMatches = useMemo(() => (sport ? battleMatches.filter((match) => match.sport === sport) : battleMatches), [battleMatches, sport]);
  const selectedBattleMatch = filteredBattleMatches[0] ?? fallbackBattleMatch;
  const isAllSports = selectedSport === "all";
  const shouldShowBaseballApiMatches = selectedSport === "baseball" && baseballApiMatches && baseballApiMatches.length > 0;
  const homeFeaturedMatches = filteredMatches.slice(0, 6);
  const handleSportSelect = (sportId: string) => {
    const normalizedSportId = normalizeSportCategoryId(sportId);
    setSelectedSport(normalizedSportId);
    router.push(normalizedSportId === "all" ? "/" : `/?sport=${normalizedSportId}`, { scroll: false });
  };

  useEffect(() => {
    setSelectedSport(normalizeSportCategoryId(initialSport));
  }, [initialSport]);

  return (
    <div className="container-shell grid min-w-0 gap-4 overflow-hidden py-6 lg:grid-cols-[220px_1fr] lg:gap-6 lg:overflow-visible lg:py-12">
      <HomeSportsTabs selectedSport={selectedSport} onSelect={handleSportSelect} />
      <main className="min-w-0 space-y-8 lg:space-y-12">
        {shouldShowBaseballApiMatches ? (
          <ApiUpcomingMatchList title="Baseball 예정 경기" matches={baseballApiMatches} />
        ) : !isAllSports ? (
          <UpcomingMatchList title={`${selectedCategory?.label ?? "Sports"} 예정 경기`} matches={filteredBattleMatches} />
        ) : (
          <>
        <section>
          <div className="mb-4 lg:mb-5">
            <p className="text-xs font-semibold text-accent-green sm:text-sm">오늘의 AI 조합</p>
            <h2 className="mt-1 text-xl font-black text-white sm:mt-2 sm:text-2xl">AI별 조합 상세</h2>
            <p className="mt-1 text-xs text-slate-400 sm:mt-2 sm:text-sm">All Sports에서는 AI 조합과 리그 흐름을 함께 확인합니다.</p>
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            {combinations.map((combination) => (
              <CombinationCard key={combination.id} combination={combination} compact />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-accent-green">최근 30일 ROI 순위</p>
              <h2 className="mt-2 text-2xl font-black text-white">최근 30일 ROI 순위</h2>
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
            <p className="text-sm font-semibold text-accent-green">오늘의 AI 배틀</p>
            <h2 className="mt-2 text-2xl font-black text-white">오늘의 AI 배틀</h2>
            <p className="mt-2 text-sm text-slate-400">선택한 종목의 대표 AI 의견 대결을 확인합니다.</p>
          </div>
          {filteredBattleMatches.length > 0 ? <BattleCard match={selectedBattleMatch} featured /> : <EmptySportState />}
        </section>

        <section>
          <div className="mb-5">
            <p className="text-sm font-semibold text-accent-green">AI 조합 선정 과정</p>
            <h2 className="mt-2 text-2xl font-black text-white">AI 조합 선정 과정</h2>
            <p className="mt-2 text-sm text-slate-400">분석한 경기에서 후보를 좁히고 최종 조합만 선택합니다.</p>
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            {decisionProcesses.map((process) => (
              <DecisionProcessCard key={process.aiName} process={process} />
            ))}
          </div>
        </section>

        <FeaturedMatches matches={homeFeaturedMatches} contained={false} />
        {homeFeaturedMatches.length === 0 ? <EmptySportState /> : null}
          </>
        )}
      </main>
    </div>
  );
}

function ApiUpcomingMatchList({ title, matches }: { title: string; matches: Match[] }) {
  return (
    <section>
      <div className="mb-4 lg:mb-5">
        <p className="text-xs font-semibold text-accent-green sm:text-sm">The Odds API 테스트</p>
        <h2 className="mt-1 text-xl font-black text-white sm:mt-2 sm:text-2xl">{title}</h2>
        <p className="mt-1 text-xs text-slate-400 sm:mt-2 sm:text-sm">Baseball 카테고리에서만 실제 upcoming odds 데이터를 우선 표시합니다.</p>
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        {matches.map((match) => (
          <Link key={match.id} href={`/analysis/${match.id}`} className="panel block min-w-0 overflow-hidden p-5 transition hover:border-accent-green/40 hover:bg-white/[0.03]">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
              <span>{match.sport}</span>
              <span className="h-1 w-1 rounded-full bg-slate-600" />
              <span>{match.league}</span>
              <span className="h-1 w-1 rounded-full bg-slate-600" />
              <span className="hidden sm:inline">{formatDateTime(match.startTime)}</span>
              <span className="sm:hidden">{formatDateTime(match.startTime, "mobile")}</span>
            </div>

            <div className="mt-4 grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-500">홈팀</p>
                <h3 className="mt-1 truncate text-lg font-black text-white">{match.homeTeam}</h3>
              </div>
              <span className="shrink-0 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-black text-slate-400">VS</span>
              <div className="min-w-0 text-right">
                <p className="text-xs font-semibold text-slate-500">원정팀</p>
                <h3 className="mt-1 truncate text-lg font-black text-white">{match.awayTeam}</h3>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <OddsStat label="홈 배당" value={match.odds?.home} />
              <OddsStat label="원정 배당" value={match.odds?.away} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function OddsStat({ label, value }: { label: string; value?: number }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-black text-accent-green">{value ? value.toFixed(2) : "정보 없음"}</p>
    </div>
  );
}

function HomeSportsTabs({ selectedSport, onSelect }: { selectedSport: string; onSelect: (sportId: string) => void }) {
  return (
    <aside className="min-w-0 max-w-full lg:sticky lg:top-24 lg:self-start">
      <div className="panel max-w-full overflow-hidden border-accent-green/20 p-3 lg:overflow-visible">
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">Sports</p>
          <span className="hidden rounded-full border border-accent-green/30 bg-accent-green/10 px-2 py-0.5 text-[10px] font-black text-accent-green lg:inline-flex">
            FILTER
          </span>
        </div>
        <div className="scrollbar-hide flex max-w-full gap-2 overflow-x-auto overflow-y-hidden whitespace-nowrap pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {sportCategories.map((category) => {
            const active = selectedSport === category.id;
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={active}
                onClick={() => onSelect(category.id)}
                className={clsx(
                  "inline-flex h-10 flex-none cursor-pointer touch-manipulation items-center gap-2 whitespace-nowrap rounded-md border px-3 text-sm font-bold transition lg:flex lg:w-full lg:min-w-0 lg:justify-start",
                  active
                    ? "border-accent-green bg-accent-green text-black shadow-[0_0_18px_rgba(34,197,94,0.18)]"
                    : "border-white/10 bg-black/20 text-slate-300 hover:border-accent-green/40 hover:text-white",
                )}
              >
                <span aria-hidden>{category.icon}</span>
                <span>{category.label}</span>
                {category.isNew ? (
                  <span className={active ? "rounded bg-black/20 px-1.5 py-0.5 text-[10px] text-black" : "rounded bg-accent-green/15 px-1.5 py-0.5 text-[10px] text-accent-green"}>
                    NEW
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function UpcomingMatchList({ title, matches }: { title: string; matches: AnalysisMatch[] }) {
  return (
    <section>
      <div className="mb-4 lg:mb-5">
        <p className="text-xs font-semibold text-accent-green sm:text-sm">예정 경기 목록</p>
        <h2 className="mt-1 text-xl font-black text-white sm:mt-2 sm:text-2xl">{title}</h2>
        <p className="mt-1 text-xs text-slate-400 sm:mt-2 sm:text-sm">경기를 선택하면 GPT, Gemini, DeepSeek의 분석 비교 페이지로 이동합니다.</p>
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        {matches.map((match) => (
          <Link key={match.id} href={`/analysis/${match.id}`} className="panel block min-w-0 overflow-hidden p-5 transition hover:border-accent-green/40 hover:bg-white/[0.03]">
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
                  <span>{match.sport}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-600" />
                  <span>{match.league}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-600" />
                  <span className="hidden sm:inline">{formatDateTime(match.startTime)}</span>
                  <span className="sm:hidden">{formatDateTime(match.startTime, "mobile")}</span>
                </div>
                <h3 className="mt-2 break-words text-xl font-black text-white">{match.match}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{match.headline}</p>
              </div>
              <ConsensusBadge score={match.consensusScore} label={match.consensusLabel} />
            </div>

            <div className="mt-5 flex flex-col gap-3 rounded-md border border-white/10 bg-black/20 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm">
                <p className="font-bold text-accent-green">AI 분석 완료</p>
                <p className="mt-1 text-slate-500">AI 의견 일치도 {match.consensusScore}%</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-md bg-accent-green px-3 py-2 text-sm font-bold text-black">
                분석 보기 <ArrowUpRight size={16} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {matches.length === 0 ? <EmptySportState /> : null}
    </section>
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
