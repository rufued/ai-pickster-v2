import clsx from "clsx";
import { Bot, CalendarDays, ChevronRight, Clock, Flame, Radio } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { analysisMatches, matches } from "@/lib/data";
import { formatDateTime, formatTime } from "@/lib/format";
import { getSportFromParam, normalizeSportCategoryId, sportCategories } from "@/lib/sports";
import type { Match, MatchStatus } from "@/lib/types";

type HomePageProps = {
  searchParams?: Promise<{
    sport?: string | string[];
    date?: string | string[];
  }>;
};

const dateTabs = [
  { id: "yesterday", label: "어제" },
  { id: "today", label: "오늘" },
  { id: "tomorrow", label: "내일" },
];

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const selectedSport = normalizeSportCategoryId(params?.sport);
  const selectedDate = normalizeDate(params?.date);
  const sport = getSportFromParam(selectedSport);
  const visibleMatches = sport ? matches.filter((match) => match.sport === sport) : matches;
  const mainMatches = filterByDateBucket(visibleMatches, selectedDate);
  const aiRecommended = analysisMatches
    .filter((match) => (sport ? match.sport === sport : true))
    .filter((match) => match.analyses.some((analysis) => analysis.confidence >= 64))
    .slice(0, 3);
  const popularMatches = [...visibleMatches].sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0)).slice(0, 4);
  const featuredMatch = mainMatches[0] ?? visibleMatches[0];

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="container-shell py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold text-blue-700">AI 예측을 더한 스포츠 정보 플랫폼</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">오늘의 경기와 AI 분석을 한 화면에서 확인하세요</h1>
            </div>
            <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-center text-sm font-bold text-slate-600">
              <Stat label="진행중" value={matches.filter((match) => match.status === "live").length.toString()} />
              <Stat label="예정" value={matches.filter((match) => match.status === "scheduled").length.toString()} />
              <Stat label="AI 분석" value={analysisMatches.length.toString()} />
            </div>
          </div>
        </div>
      </section>

      <div className="container-shell grid gap-5 py-5 lg:grid-cols-[220px_1fr_300px]">
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <nav className="panel p-3">
            <p className="px-1 text-xs font-black uppercase tracking-wide text-slate-400">Sports</p>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:grid lg:overflow-visible lg:pb-0">
              {sportCategories.map((category) => (
                <Link
                  key={category.id}
                  href={category.id === "all" ? "/" : `/?sport=${category.id}&date=${selectedDate}`}
                  className={clsx(
                    "inline-flex h-10 flex-none items-center justify-between gap-3 rounded-md border px-3 text-sm font-bold transition lg:w-full",
                    selectedSport === category.id
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50",
                  )}
                >
                  <span>{category.label}</span>
                  <span className={selectedSport === category.id ? "text-white/80" : "text-slate-400"}>{category.icon}</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="panel p-3">
            <p className="px-1 text-xs font-black uppercase tracking-wide text-slate-400">Date</p>
            <div className="mt-3 grid grid-cols-3 gap-2 lg:grid-cols-1">
              {dateTabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={`/?sport=${selectedSport}&date=${tab.id}`}
                  className={clsx(
                    "rounded-md border px-3 py-2 text-center text-sm font-bold",
                    selectedDate === tab.id ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600 hover:bg-slate-50",
                  )}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <main className="min-w-0 space-y-5">
          {featuredMatch ? <FeaturedScoreboard match={featuredMatch} /> : null}

          <section className="panel overflow-hidden">
            <SectionTitle icon={<Radio size={18} />} title="실시간 / 예정 / 종료 경기" action={`${mainMatches.length} 경기`} />
            <div className="divide-y divide-slate-100">
              {mainMatches.map((match) => (
                <MatchRow key={match.id} match={match} />
              ))}
              {mainMatches.length === 0 ? <EmptyState /> : null}
            </div>
          </section>

          <section className="panel overflow-hidden">
            <SectionTitle icon={<Bot size={18} />} title="AI 추천 경기" action="분석 보기" href="/analysis" />
            <div className="grid gap-3 p-4 md:grid-cols-3">
              {aiRecommended.map((match) => {
                const top = [...match.analyses].sort((a, b) => b.confidence - a.confidence)[0];
                return (
                  <Link key={match.id} href={`/analysis/${match.id}`} className="rounded-lg border border-slate-200 p-4 transition hover:border-blue-300 hover:shadow-sm">
                    <p className="text-xs font-bold text-slate-500">{match.sport} · {match.league}</p>
                    <h3 className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm font-black text-slate-950">{match.match}</h3>
                    <p className="mt-3 text-sm font-bold text-blue-700">{top.aiName} {top.prediction}</p>
                    <p className="mt-1 text-xs text-slate-500">신뢰도 {top.confidence}% · 예상 {top.expectedScore}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        </main>

        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <section className="panel overflow-hidden">
            <SectionTitle icon={<Flame size={18} />} title="인기 경기" />
            <div className="divide-y divide-slate-100">
              {popularMatches.map((match, index) => (
                <Link key={match.id} href={`/analysis/${match.id}`} className="flex items-center gap-3 p-4 transition hover:bg-slate-50">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-xs font-black text-slate-600">{index + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-950">{match.homeTeam} vs {match.awayTeam}</p>
                    <p className="mt-1 text-xs text-slate-500">{match.league} · 관심도 {match.popularity}%</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </Link>
              ))}
            </div>
          </section>

          <section className="panel p-4">
            <div className="flex items-center gap-2 text-sm font-black text-slate-950">
              <CalendarDays size={18} className="text-blue-600" />
              플랫폼 메모
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              경기 데이터, AI 예측, 기록실 데이터를 분리해 두어 실제 스포츠 API와 신규 AI 모델을 연결하기 쉬운 구조로 정리했습니다.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function MatchRow({ match }: { match: Match }) {
  const analysis = analysisMatches.find((item) => item.id === match.id);
  const top = analysis ? [...analysis.analyses].sort((a, b) => b.confidence - a.confidence)[0] : undefined;

  return (
    <Link href={`/analysis/${match.id}`} className="grid gap-3 p-4 transition hover:bg-slate-50 sm:grid-cols-[120px_1fr_auto] sm:items-center">
      <div>
        <p className="text-xs font-bold text-slate-500">{match.sport} · {match.league}</p>
        <p className="mt-1 flex items-center gap-1 text-sm font-black text-slate-950">
          <Clock size={14} className="text-slate-400" />
          {formatTime(match.startTime)}
        </p>
      </div>

      <div className="min-w-0">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <TeamName name={match.homeTeam} align="right" />
          <Score match={match} />
          <TeamName name={match.awayTeam} align="left" />
        </div>
        <p className="mt-2 truncate text-xs text-slate-500">{top ? `AI 요약: ${top.aiName} ${top.prediction}, 신뢰도 ${top.confidence}%` : match.headline}</p>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <StatusBadge status={match.status} />
        <span className="rounded-md bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">상세보기</span>
      </div>
    </Link>
  );
}

function FeaturedScoreboard({ match }: { match: Match }) {
  return (
    <section className="panel p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-blue-700">오늘의 주요 경기</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">{match.homeTeam} vs {match.awayTeam}</h2>
          <p className="mt-1 text-sm text-slate-500">{match.league} · {formatDateTime(match.startTime)} · {match.venue}</p>
        </div>
        <div className="grid min-w-[180px] grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
          <p className="truncate text-sm font-bold text-slate-700">{match.homeTeam}</p>
          <Score match={match} large />
          <p className="truncate text-sm font-bold text-slate-700">{match.awayTeam}</p>
        </div>
      </div>
    </section>
  );
}

function Score({ match, large = false }: { match: Match; large?: boolean }) {
  const className = large ? "text-2xl" : "text-lg";

  if (match.status === "scheduled") {
    return <span className="rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-black text-slate-500">VS</span>;
  }

  return (
    <span className={clsx("whitespace-nowrap font-black text-slate-950", className)}>
      {match.homeScore} : {match.awayScore}
    </span>
  );
}

function TeamName({ name, align }: { name: string; align: "left" | "right" }) {
  return <p className={clsx("truncate text-sm font-black text-slate-900 sm:text-base", align === "right" ? "text-right" : "text-left")}>{name}</p>;
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
        "inline-flex rounded-full px-2.5 py-1 text-xs font-black",
        status === "live" && "bg-emerald-50 text-emerald-700",
        status === "scheduled" && "bg-blue-50 text-blue-700",
        status === "final" && "bg-slate-100 text-slate-600",
      )}
    >
      {labels[status]}
    </span>
  );
}

function SectionTitle({ icon, title, action, href }: { icon: ReactNode; title: string; action?: string; href?: string }) {
  const content = <span className="text-xs font-black text-blue-700">{action}</span>;

  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
      <h2 className="flex items-center gap-2 text-base font-black text-slate-950">
        <span className="text-blue-600">{icon}</span>
        {title}
      </h2>
      {action ? (href ? <Link href={href}>{content}</Link> : content) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-slate-200 px-4 py-3 last:border-r-0">
      <p className="text-lg font-black text-slate-950">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function EmptyState() {
  return <div className="p-6 text-sm text-slate-500">선택한 조건의 경기가 없습니다. 실제 API 연결 시 종목별 일정이 이 영역에 표시됩니다.</div>;
}

function normalizeDate(value?: string | string[] | null): string {
  const date = Array.isArray(value) ? value[0] : value;
  if (typeof date === "string" && dateTabs.some((tab) => tab.id === date)) {
    return date;
  }

  return "today";
}

function filterByDateBucket(items: Match[], bucket: string) {
  if (bucket === "yesterday") {
    return items.filter((match) => match.status === "final");
  }

  if (bucket === "tomorrow") {
    return items.filter((match) => match.startTime.startsWith("2026-06-09"));
  }

  return items.filter((match) => !match.startTime.startsWith("2026-06-09") || match.status === "live");
}
