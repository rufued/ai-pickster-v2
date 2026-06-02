import Link from "next/link";
import { ArrowRight, Layers3, Trophy } from "lucide-react";
import { BattleCard } from "@/components/battle/BattleCard";
import { CombinationCard } from "@/components/combinations/CombinationCard";
import { DecisionProcessCard } from "@/components/decision/DecisionProcessCard";
import { FeaturedMatches } from "@/components/home/FeaturedMatches";
import { SportsSidebar } from "@/components/sports/SportsSidebar";
import { formatCurrency, formatPercent } from "@/lib/format";
import {
  analysisMatches,
  decisionProcesses,
  featuredMatches,
  getMostDivisiveMatch,
  getRankedAis,
  getTodayCombinations,
} from "@/lib/data";
import { getSportFromParam } from "@/lib/sports";
import type { AICompetitor, Combination } from "@/lib/types";

type HomeProps = {
  searchParams: Promise<{ sport?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { sport } = await searchParams;
  const selectedSport = getSportFromParam(sport);
  const rankedAis = getRankedAis();
  const todayCombinations = selectedSport
    ? getTodayCombinations().filter((combination) => combination.selections.some((selection) => selection.sport === selectedSport))
    : getTodayCombinations();
  const filteredMatches = selectedSport ? featuredMatches.filter((match) => match.sport === selectedSport) : featuredMatches;
  const filteredBattleMatches = selectedSport ? analysisMatches.filter((match) => match.sport === selectedSport) : analysisMatches;
  const leader = rankedAis[0];
  const totalStake = todayCombinations.reduce((total, combination) => total + combination.stake, 0);
  const highestOdds = todayCombinations.length > 0 ? Math.max(...todayCombinations.map((combination) => combination.totalOdds)) : 0;
  const divisiveMatch = filteredBattleMatches[0] ?? getMostDivisiveMatch();

  return (
    <div>
      <section className="border-b border-white/10">
        <div className="container-shell grid min-h-[560px] items-center gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-accent-green">AI Consensus League</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
              AI들은 오늘 어디에 베팅했을까?
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              AI 조합, AI 배틀, 의견 일치도, 수익률을 한 화면에서 확인하는 가상 머니 기반 AI 스포츠 예측 리그입니다.
            </p>
            <p className="mt-3 max-w-2xl rounded-md border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm font-semibold text-red-200">
              실제 베팅 사이트가 아니며, 가상 머니 기반의 AI 예측 콘텐츠 플랫폼입니다.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/predictions"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-accent-green px-5 py-3 text-sm font-bold text-black transition hover:bg-emerald-300"
              >
                오늘의 조합 보기 <ArrowRight size={18} />
              </Link>
              <Link
                href="/battle"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                AI 배틀 보기 <Trophy size={18} />
              </Link>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              <HeroStat label="오늘 총 투자" value={formatCurrency(totalStake)} />
              <HeroStat label="최고 조합 배당" value={highestOdds.toFixed(2)} />
              <HeroStat label="리그 리더" value={leader.name} />
            </div>
          </div>

          <HeroCombinationBoard combinations={todayCombinations} />
        </div>
      </section>

      <div className="container-shell grid gap-6 py-12 lg:grid-cols-[220px_1fr]">
        <SportsSidebar basePath="/" activeSport={sport} />
        <main className="space-y-12">
          <section>
            <div className="mb-5">
              <p className="text-sm font-semibold text-accent-green">Today Combinations</p>
              <h2 className="mt-2 text-2xl font-black text-white">오늘의 AI 조합</h2>
              <p className="mt-2 text-sm text-slate-400">오늘 각 AI가 실제로 선택한 조합과 투자금을 먼저 확인합니다.</p>
            </div>
            <div className="grid gap-4 xl:grid-cols-3">
              {todayCombinations.map((combination) => (
                <CombinationCard key={combination.id} combination={combination} compact />
              ))}
            </div>
            {todayCombinations.length === 0 ? <EmptySportState /> : null}
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
              {[...rankedAis].sort((a, b) => b.recent30DayRoi - a.recent30DayRoi).map((ai) => (
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
            <BattleCard match={divisiveMatch} featured />
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
    </div>
  );
}

function HeroCombinationBoard({ combinations }: { combinations: Combination[] }) {
  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-accent-green">오늘의 AI 조합</p>
          <h2 className="mt-1 text-2xl font-black text-white">AI 판단 티켓</h2>
        </div>
        <span className="rounded-full border border-accent-green/30 bg-accent-green/10 px-3 py-1 text-xs font-bold text-accent-green">
          3~5 FOLDERS
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {combinations.map((combination) => (
          <div key={combination.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-black text-white">{combination.aiName}</p>
                <p className="mt-1 text-xs font-semibold text-accent-green">{combination.style}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">조합 배당</p>
                <p className="font-black text-accent-green">{combination.totalOdds.toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <Layers3 size={14} />
              <span>오늘 선택한 조합 수: {combination.selections.length}폴더</span>
              <span className="h-1 w-1 rounded-full bg-slate-600" />
              <span>투자 {formatCurrency(combination.stake)}</span>
              <span className="h-1 w-1 rounded-full bg-slate-600" />
              <span>예상 {formatCurrency(combination.potentialReturn)}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {combination.selections.map((selection, index) => (
                <span key={`${combination.id}-${selection.prediction}-${index}`} className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold text-slate-200">
                  {selection.prediction}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
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
          <p className="text-xs font-semibold text-slate-500">{ai.name} · {ai.analysisStyle}</p>
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
