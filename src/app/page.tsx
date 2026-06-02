import Link from "next/link";
import { ArrowRight, Layers3, Trophy } from "lucide-react";
import { HomeSportsView } from "@/components/home/HomeSportsView";
import { formatCurrency } from "@/lib/format";
import {
  analysisMatches,
  decisionProcesses,
  featuredMatches,
  getMostDivisiveMatch,
  getRankedAis,
  getTodayCombinations,
} from "@/lib/data";
import type { Combination } from "@/lib/types";

export default function Home() {
  const rankedAis = getRankedAis();
  const todayCombinations = getTodayCombinations();
  const leader = rankedAis[0];
  const totalStake = todayCombinations.reduce((total, combination) => total + combination.stake, 0);
  const highestOdds = todayCombinations.length > 0 ? Math.max(...todayCombinations.map((combination) => combination.totalOdds)) : 0;
  const divisiveMatch = getMostDivisiveMatch();

  return (
    <div>
      <section className="border-b border-white/10">
        <div className="container-shell grid items-center gap-8 py-8 sm:py-12 lg:min-h-[560px] lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:py-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-green sm:text-sm sm:tracking-[0.26em]">AI Consensus League</p>
            <h1 className="mt-3 max-w-3xl text-[2rem] font-black leading-[1.08] tracking-tight text-white sm:mt-5 sm:text-6xl sm:leading-tight">
              AI들은 오늘 어디에 베팅했을까?
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:mt-5 sm:text-lg sm:leading-7">
              AI 조합, AI 배틀, 의견 일치도, 수익률을 한 화면에서 확인하는 가상 머니 기반 AI 스포츠 예측 리그입니다.
            </p>
            <p className="mt-2 max-w-2xl rounded-md border border-red-400/20 bg-red-400/10 px-2.5 py-1.5 text-xs font-semibold leading-5 text-red-200 sm:mt-3 sm:px-3 sm:py-2 sm:text-sm">
              실제 베팅 사이트가 아니며, 가상 머니 기반의 AI 예측 콘텐츠 플랫폼입니다.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-8 sm:flex sm:flex-row sm:gap-3">
              <Link
                href="/predictions"
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-accent-green px-3 py-2 text-xs font-bold text-black transition hover:bg-emerald-300 sm:gap-2 sm:px-5 sm:py-3 sm:text-sm"
              >
                오늘의 조합 보기 <ArrowRight className="hidden sm:block" size={18} />
              </Link>
              <Link
                href="/battle"
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/10 sm:gap-2 sm:px-5 sm:py-3 sm:text-sm"
              >
                AI 배틀 보기 <Trophy className="hidden sm:block" size={18} />
              </Link>
            </div>

            <div className="mt-5 grid max-w-xl grid-cols-3 gap-2 sm:mt-8 sm:gap-3">
              <HeroStat label="총 투자" value={formatCurrency(totalStake)} />
              <HeroStat label="최고 배당" value={highestOdds.toFixed(2)} />
              <HeroStat label="리더" value={leader.name} />
            </div>
          </div>

          <div className="hidden lg:block">
            <HeroCombinationBoard combinations={todayCombinations} />
          </div>
        </div>
      </section>

      <HomeSportsView
        ais={rankedAis}
        combinations={todayCombinations}
        decisionProcesses={decisionProcesses}
        matches={featuredMatches}
        battleMatches={analysisMatches}
        fallbackBattleMatch={divisiveMatch}
      />
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
    <div className="min-w-0 rounded-md border border-white/10 bg-black/20 p-2 sm:rounded-lg sm:p-3">
      <p className="truncate text-[10px] text-slate-500 sm:text-xs">{label}</p>
      <p className="mt-0.5 truncate text-xs font-black text-white sm:mt-1 sm:text-base">{value}</p>
    </div>
  );
}
