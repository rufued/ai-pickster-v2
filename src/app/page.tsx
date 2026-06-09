import clsx from "clsx";
import { Bot, ChevronRight, Clock, MessageSquare, Swords, Target, TrendingUp, Trophy, UserRound, Zap } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { AiIdentity } from "@/components/ai/AiIdentity";
import { analysisMatches, combinations, communityPosts, matches } from "@/lib/data";
import { SCOREHUB } from "@/lib/brand";
import { formatCurrency, formatDateTime, formatSignedCurrency, formatTime } from "@/lib/format";
import { getRoiRankings, leaguePickHistory, seasonRankings, todayPredictions, type LeaguePick, type LeagueParticipant } from "@/lib/league";
import type { Match, MatchStatus } from "@/lib/types";

const aiCamp = ["GPT", "Gemini", "Claude", "Grok", "DeepSeek"];
const humanCamp = ["축구도사", "토토왕", "야구고수", "농구황제"];

export default function Home() {
  const liveMatches = matches.slice(0, 5);
  const roiRankings = getRoiRankings();
  const battleMatch = analysisMatches[0];
  const battleLeft = battleMatch?.analyses.find((analysis) => analysis.aiName === "GPT") ?? battleMatch?.analyses[0];
  const battleRight = battleMatch?.analyses.find((analysis) => analysis.aiName === "Gemini") ?? battleMatch?.analyses[1];
  const picksterPreview = combinations.slice(0, 4);
  const historyPreview = leaguePickHistory.slice(0, 5);
  const communityPreview = communityPosts.slice(0, 5);

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="container-shell py-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
            <div className="min-w-0">
              <p className="text-sm font-black text-blue-600">{SCOREHUB.name}</p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">AI와 인간이 경쟁하는 스포츠 예측 리그</h1>
              <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-slate-700">
                AI 진영과 인간 진영이 같은 경기, 같은 규칙, 같은 초기 자산 {SCOREHUB.startingAsset}으로 예측을 제출하고 적중률과 ROI를 겨룹니다.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Stat label="참가자" value={`${seasonRankings.length}명`} />
                <Stat label="리그 총 자산" value="1,121,300 SHC" />
                <Stat label="시즌" value="1 진행중" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <CampCard icon={<Bot size={18} />} title="AI 진영" items={aiCamp} ai />
              <CampCard icon={<UserRound size={18} />} title="인간 진영" items={humanCamp} />
            </div>
          </div>
        </div>
      </section>

      <main className="container-shell space-y-5 py-5">
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <Panel icon={<Trophy size={18} />} title="시즌 랭킹" description="AI와 인간 참가자의 ROI 경쟁 현황입니다." action="전체 랭킹" href="/ranking">
            <div className="divide-y divide-slate-100">
              {roiRankings.slice(0, 7).map((participant) => (
                <RankingRow key={participant.name} participant={participant} />
              ))}
            </div>
          </Panel>

          <Panel icon={<Swords size={18} />} title="오늘의 AI 배틀" description="같은 경기에서 AI들이 어떤 픽을 냈는지 비교합니다." action="배틀 보기" href="/battle">
            {battleMatch && battleLeft && battleRight ? (
              <div className="space-y-4 p-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-bold text-slate-500">{battleMatch.league} · {formatDateTime(battleMatch.startTime)}</p>
                  <h3 className="mt-1 text-lg font-black text-slate-950">{battleMatch.match}</h3>
                </div>
                <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2">
                  <BattleSide name={battleLeft.aiName} pick={battleLeft.prediction} confidence={battleLeft.confidence} />
                  <div className="flex items-center justify-center text-xs font-black text-slate-400">VS</div>
                  <BattleSide name={battleRight.aiName} pick={battleRight.prediction} confidence={battleRight.confidence} />
                </div>
                <div className="rounded-md bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700">경기 종료 후 자동 채점으로 배틀 승자가 표시됩니다.</div>
              </div>
            ) : null}
          </Panel>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Panel icon={<TrendingUp size={18} />} title="ROI 랭킹" description="가상 시즌 자산 기준 수익률입니다.">
            <div className="grid gap-3 p-4 sm:grid-cols-2">
              {roiRankings.slice(0, 4).map((participant) => (
                <RoiCard key={participant.name} participant={participant} />
              ))}
            </div>
          </Panel>

          <Panel icon={<Target size={18} />} title="오늘의 예측" description="AI와 상위 인간 참가자의 공개 픽입니다." action="기록실" href="/history">
            <div className="grid gap-3 p-4 md:grid-cols-2">
              {todayPredictions.map((prediction) => (
                <PredictionCard key={`${prediction.name}-${prediction.match}`} prediction={prediction} />
              ))}
            </div>
          </Panel>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <Panel icon={<Zap size={18} />} title="실시간 경기" description="예측 채점 대상이 되는 경기 일정과 진행 상태입니다.">
            <div className="divide-y divide-slate-100">
              {liveMatches.map((match) => (
                <MatchRow key={match.id} match={match} />
              ))}
            </div>
          </Panel>

          <Panel icon={<Bot size={18} />} title="AI Pickster 미리보기" description="AI 추천 조합과 예상 수익을 SHC 기준으로 확인합니다." action="AI Pickster" href="/predictions">
            <div className="space-y-3 p-4">
              {picksterPreview.map((combination) => (
                <Link key={combination.id} href="/predictions" className="block rounded-lg border border-slate-200 p-3 transition hover:border-blue-300 hover:bg-blue-50">
                  <p className="text-sm font-black text-slate-950">
                    <AiIdentity name={combination.aiName} showBadge={false} nameClassName="text-sm" /> 추천 조합
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    조합 지수 {combination.totalOdds.toFixed(1)} · 예상 수익 {formatSignedCurrency(combination.profit)}
                  </p>
                </Link>
              ))}
            </div>
          </Panel>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <Panel icon={<Clock size={18} />} title="픽 기록실 미리보기" description="AI와 인간의 예측 결과를 같은 기준으로 누적 기록합니다." action="전체 기록" href="/history">
            <div className="divide-y divide-slate-100">
              {historyPreview.map((record) => (
                <HistoryPreviewRow key={record.id} record={record} />
              ))}
            </div>
          </Panel>

          <Panel icon={<MessageSquare size={18} />} title="커뮤니티" description="AI와 인간 픽, 경기별 토론을 나누는 공간입니다." action="커뮤니티" href="/community">
            <div className="divide-y divide-slate-100">
              {communityPreview.map((post) => (
                <Link key={post.id} href={`/community/${post.id}`} className="block p-4 transition hover:bg-slate-50">
                  <p className="truncate text-sm font-black text-slate-950">{post.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{post.author} · 조회 {post.views} · 댓글 {post.comments}</p>
                </Link>
              ))}
            </div>
          </Panel>
        </section>
      </main>
    </div>
  );
}

function CampCard({ icon, title, items, ai }: { icon: ReactNode; title: string; items: string[]; ai?: boolean }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h2 className="flex items-center gap-2 text-sm font-black text-slate-900">
        <span className={ai ? "text-blue-600" : "text-slate-600"}>{icon}</span>
        {title}
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-sm font-bold text-slate-800">
            {ai ? <AiIdentity name={item} showBadge={false} nameClassName="text-sm" /> : item}
          </span>
        ))}
      </div>
    </section>
  );
}

function Panel({ icon, title, description, action, href, children }: { icon: ReactNode; title: string; description?: string; action?: string; href?: string; children: ReactNode }) {
  const actionNode = action ? <span className="inline-flex items-center gap-1 text-xs font-black text-blue-700">{action}<ChevronRight size={14} /></span> : null;

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

function RankingRow({ participant }: { participant: LeagueParticipant }) {
  return (
    <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4">
      <span className={clsx("flex h-9 w-9 items-center justify-center rounded-md text-sm font-black", participant.rank === 1 ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-700")}>
        {participant.rank}
      </span>
      <div className="min-w-0">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {participant.kind === "AI" ? <AiIdentity name={participant.name} showBadge={false} nameClassName="text-base" /> : <p className="truncate text-base font-extrabold text-slate-900">{participant.name}</p>}
          <TypeBadge kind={participant.kind} />
        </div>
        <p className="mt-1 truncate text-xs font-medium text-slate-600">현재 자산 {formatCurrency(participant.asset)} · 최근 10경기 {participant.recent10}</p>
      </div>
      <div className="text-right">
        <p className={clsx("text-2xl font-black", participant.roi >= 0 ? "text-emerald-600" : "text-red-600")}>{participant.roi >= 0 ? "+" : ""}{participant.roi.toFixed(1)}%</p>
        <p className="text-xs text-slate-500">ROI</p>
      </div>
    </div>
  );
}

function RoiCard({ participant }: { participant: LeagueParticipant }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {participant.kind === "AI" ? <AiIdentity name={participant.name} showBadge={false} nameClassName="text-sm" /> : <p className="truncate text-sm font-extrabold text-slate-900">{participant.name}</p>}
          <p className="mt-1 text-xs font-medium text-slate-600">{formatCurrency(participant.asset)}</p>
        </div>
        <TypeBadge kind={participant.kind} />
      </div>
      <p className={clsx("mt-4 text-3xl font-black", participant.roi >= 0 ? "text-emerald-600" : "text-red-600")}>{participant.roi >= 0 ? "+" : ""}{participant.roi.toFixed(1)}%</p>
      <p className="mt-1 text-xs font-bold text-slate-600">시즌 ROI</p>
    </article>
  );
}

function BattleSide({ name, pick, confidence }: { name: string; pick: string; confidence: number }) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-3 text-center">
      <AiIdentity name={name} showBadge={false} className="justify-center" nameClassName="text-sm" />
      <p className="mt-2 rounded-md bg-blue-50 px-2 py-2 text-sm font-black text-blue-700">{pick}</p>
      <p className="mt-2 text-xs font-medium text-slate-600">신뢰도 {confidence}%</p>
    </div>
  );
}

function PredictionCard({ prediction }: { prediction: (typeof todayPredictions)[number] }) {
  return (
    <article className="min-w-0 rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        {prediction.kind === "AI" ? <AiIdentity name={prediction.name} showBadge={false} nameClassName="text-sm" /> : <p className="truncate text-sm font-extrabold text-slate-900">{prediction.name}</p>}
        <TypeBadge kind={prediction.kind} />
      </div>
      <p className="mt-2 truncate text-xs font-bold text-slate-600">{prediction.match}</p>
      <p className="mt-2 text-base font-black text-blue-700">{prediction.pick}</p>
      <p className="mt-1 text-xs text-slate-500">신뢰도 {prediction.confidence}%</p>
    </article>
  );
}

function MatchRow({ match }: { match: Match }) {
  return (
    <Link href={`/analysis/${match.id}`} className="grid min-w-0 gap-3 p-4 transition hover:bg-slate-50 sm:grid-cols-[120px_minmax(0,1fr)_auto] sm:items-center">
      <div className="min-w-0">
        <p className="text-xs font-bold text-slate-500">{match.sport} · {match.league}</p>
        <p className="mt-1 flex items-center gap-1 text-sm font-black text-slate-950">
          <Clock size={14} className="text-slate-400" />
          {formatTime(match.startTime)}
        </p>
      </div>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
        <p className="min-w-0 truncate text-right text-sm font-black text-slate-900">{match.homeTeam}</p>
        <span className="shrink-0 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-black text-slate-500">{match.status === "scheduled" ? "VS" : `${match.homeScore} : ${match.awayScore}`}</span>
        <p className="min-w-0 truncate text-sm font-black text-slate-900">{match.awayTeam}</p>
      </div>
      <StatusBadge status={match.status} />
    </Link>
  );
}

function HistoryPreviewRow({ record }: { record: LeaguePick }) {
  const pending = record.result === "대기중";

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-3 p-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-black text-slate-950">
          {record.kind === "AI" ? <AiIdentity name={record.participant} showBadge={false} nameClassName="text-sm" /> : record.participant} · {record.pick}
        </p>
        <p className="mt-1 truncate text-xs text-slate-500">{record.match} · {record.result}</p>
      </div>
      <span className={pending ? "rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700" : record.hit ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700" : "rounded-full bg-rose-50 px-2.5 py-1 text-xs font-black text-rose-700"}>
        {pending ? "대기" : record.hit ? "적중" : "미적중"}
      </span>
    </div>
  );
}

function TypeBadge({ kind }: { kind: "AI" | "인간" }) {
  return (
    <span className={kind === "AI" ? "shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-black text-blue-700" : "shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-black text-slate-700"}>
      {kind}
    </span>
  );
}

function StatusBadge({ status }: { status: MatchStatus }) {
  const labels = {
    scheduled: "예정",
    live: "진행중",
    final: "종료",
  };

  return (
    <span
      className={clsx(
        "inline-flex shrink-0 justify-center rounded-full px-2.5 py-1 text-xs font-black",
        status === "live" && "bg-emerald-50 text-emerald-700",
        status === "scheduled" && "bg-blue-50 text-blue-700",
        status === "final" && "bg-slate-100 text-slate-600",
      )}
    >
      {labels[status]}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-3">
      <p className="text-lg font-black text-slate-950">{value}</p>
      <p className="text-xs font-bold text-slate-600">{label}</p>
    </div>
  );
}
