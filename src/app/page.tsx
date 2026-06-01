import Link from "next/link";
import { ArrowRight, Layers3, Trophy } from "lucide-react";
import { ConsensusBadge } from "@/components/analysis/ConsensusBadge";
import { AiProfileCard } from "@/components/ai/AiProfileCard";
import { AiRankingCard } from "@/components/ai/AiRankingCard";
import { BattleCard } from "@/components/battle/BattleCard";
import { CombinationCard } from "@/components/combinations/CombinationCard";
import { DecisionProcessCard } from "@/components/decision/DecisionProcessCard";
import { RecentCombinationResults } from "@/components/combinations/RecentCombinationResults";
import { FeaturedMatches } from "@/components/home/FeaturedMatches";
import { MetricCard } from "@/components/ui/MetricCard";
import { formatCurrency, formatPercent } from "@/lib/format";
import {
  aiCompetitors,
  decisionProcesses,
  featuredMatches,
  getAverageRoi,
  getMostDivisiveMatch,
  getRankedAis,
  getSettledCombinations,
  getStrongConsensusMatch,
  getTodayCombinations,
} from "@/lib/data";
import type { AnalysisMatch, Combination } from "@/lib/types";

export default function Home() {
  const rankedAis = getRankedAis();
  const todayCombinations = getTodayCombinations();
  const recentResults = getSettledCombinations().slice(0, 5);
  const leader = rankedAis[0];
  const totalStake = todayCombinations.reduce((total, combination) => total + combination.stake, 0);
  const highestOdds = Math.max(...todayCombinations.map((combination) => combination.totalOdds));
  const divisiveMatch = getMostDivisiveMatch();
  const strongConsensusMatch = getStrongConsensusMatch();

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
                href="/analysis"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                AI 의견 일치도 보기 <Trophy size={18} />
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

      <section className="container-shell py-12">
        <div className="mb-5">
          <p className="text-sm font-semibold text-accent-green">Today Combinations</p>
          <h2 className="mt-2 text-2xl font-black text-white">오늘의 AI 조합</h2>
          <p className="mt-2 text-sm text-slate-400">AI별 선택 경기 수, 조합 배당률, 투자금, 예상 수익을 비교합니다.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {todayCombinations.map((combination) => (
            <CombinationCard key={combination.id} combination={combination} compact />
          ))}
        </div>
      </section>

      <section className="container-shell pb-12">
        <div className="mb-5">
          <p className="text-sm font-semibold text-accent-green">AI Decision Process</p>
          <h2 className="mt-2 text-2xl font-black text-white">오늘 AI는 어떻게 조합을 만들었을까?</h2>
          <p className="mt-2 text-sm text-slate-400">
            AI는 오늘 경기 전체를 검토한 뒤 후보를 좁히고, 최종 선택만 조합으로 생성합니다.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {decisionProcesses.map((process) => (
            <DecisionProcessCard key={process.aiName} process={process} />
          ))}
        </div>
      </section>

      <section className="container-shell pb-12">
        <div className="mb-5">
          <p className="text-sm font-semibold text-accent-green">AI Battle Arena</p>
          <h2 className="mt-2 text-2xl font-black text-white">오늘의 AI 배틀</h2>
          <p className="mt-2 text-sm text-slate-400">오늘 가장 뜨거운 의견 대결을 한 경기 기준으로 확인합니다.</p>
        </div>
        <BattleCard match={divisiveMatch} featured />
      </section>

      <section className="container-shell pb-12">
        <div className="grid gap-4 lg:grid-cols-2">
          <ConsensusMatchPanel
            eyebrow="Most Divisive Match"
            title="오늘 가장 의견이 갈리는 경기"
            description="AI들이 서로 다른 방향을 보는 경기입니다. 왜 판단이 갈렸는지 분석 비교에서 확인해보세요."
            match={divisiveMatch}
          />
          <ConsensusMatchPanel
            eyebrow="Strong Consensus"
            title="오늘 AI들이 모두 동의한 경기"
            description="GPT, Gemini, DeepSeek가 같은 방향을 보는 경기입니다. AI 전원이 같은 판단을 낸 이유를 비교해보세요."
            match={strongConsensusMatch}
          />
        </div>
      </section>

      <section className="container-shell pb-12">
        <div className="mb-5">
          <p className="text-sm font-semibold text-accent-green">AI Style Matchup</p>
          <h2 className="mt-2 text-2xl font-black text-white">AI 스타일 비교</h2>
          <p className="mt-2 text-sm text-slate-400">같은 경기도 AI마다 다른 논리로 해석합니다.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {aiCompetitors.map((ai) => (
            <AiProfileCard key={ai.id} ai={ai} />
          ))}
        </div>
      </section>

      <FeaturedMatches matches={featuredMatches} />

      <section className="container-shell pb-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="오늘 조합 수" value={`${todayCombinations.length}개`} detail="AI별 1개 조합 생성" />
          <MetricCard label="오늘 총 폴더 수" value={`${todayCombinations.reduce((total, item) => total + item.selections.length, 0)}폴더`} tone="accent" />
          <MetricCard label="현재 1위 AI" value={leader.name} detail={`${leader.strategy} · ${formatCurrency(leader.currentBalance)}`} />
          <MetricCard label="전체 평균 ROI" value={formatPercent(getAverageRoi())} tone="positive" />
        </div>
      </section>

      <section className="container-shell pb-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-accent-green">AI Asset League</p>
            <h2 className="mt-2 text-2xl font-black text-white">AI 자산 랭킹</h2>
          </div>
          <Link href="/ranking" className="text-sm font-semibold text-slate-300 hover:text-white">
            전체 보기
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {rankedAis.map((ai, index) => (
            <AiRankingCard key={ai.id} ai={ai} rank={index + 1} />
          ))}
        </div>
      </section>

      <section className="container-shell pb-16">
        <RecentCombinationResults combinations={recentResults} />
      </section>
    </div>
  );
}

function ConsensusMatchPanel({
  eyebrow,
  title,
  description,
  match,
}: {
  eyebrow: string;
  title: string;
  description: string;
  match: AnalysisMatch;
}) {
  return (
    <div className="panel p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-accent-blue">{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-black text-white">{title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
        </div>
        <ConsensusBadge score={match.consensusScore} label={match.consensusLabel} size="lg" />
      </div>

      <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-5">
        <p className="text-xs font-semibold text-slate-500">
          {match.league} · {match.sport}
        </p>
        <h3 className="mt-2 text-xl font-black text-white">{match.match}</h3>
        <div className="mt-5 grid gap-3">
          {match.analyses.map((analysis) => (
            <div key={analysis.aiName} className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2">
              <span className="font-bold text-white">{analysis.aiName}</span>
              <span className="text-sm font-semibold text-accent-green">{analysis.prediction}</span>
            </div>
          ))}
        </div>
        <Link
          href={`/analysis/${match.id}`}
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-accent-green px-4 py-2 text-sm font-bold text-black"
        >
          분석 비교 보기 <ArrowRight size={16} />
        </Link>
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
