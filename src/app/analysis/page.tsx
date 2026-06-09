import clsx from "clsx";
import { BarChart3, ChevronRight } from "lucide-react";
import Link from "next/link";
import { AiIdentity } from "@/components/ai/AiIdentity";
import { analysisMatches } from "@/lib/data";
import { formatDateTime } from "@/lib/format";
import { getSportFromParam, normalizeSportCategoryId, sportCategories } from "@/lib/sports";

type AnalysisPageProps = {
  searchParams?: Promise<{
    sport?: string | string[];
  }>;
};

export default async function AnalysisPage({ searchParams }: AnalysisPageProps) {
  const params = await searchParams;
  const selectedSport = normalizeSportCategoryId(params?.sport);
  const sport = getSportFromParam(selectedSport);
  const visibleMatches = sport ? analysisMatches.filter((match) => match.sport === sport) : analysisMatches;

  return (
    <section className="container-shell py-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold text-blue-700">AI 분석 센터</p>
          <h1 className="mt-1 text-3xl font-black text-slate-950">경기별 AI 예측 비교</h1>
          <p className="mt-2 text-sm text-slate-600">🇺🇸 GPT, 🇺🇸 Gemini, 🇺🇸 Claude, 🇺🇸 Grok, 🇨🇳 DeepSeek의 승부 예측과 예상 스코어를 한 번에 비교합니다.</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {sportCategories.map((category) => (
            <Link
              key={category.id}
              href={category.id === "all" ? "/analysis" : `/analysis?sport=${category.id}`}
              className={clsx(
                "inline-flex h-10 flex-none items-center rounded-md border px-3 text-sm font-bold",
                selectedSport === category.id ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-600",
              )}
            >
              {category.icon} {category.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {visibleMatches.map((match) => {
          const top = [...match.analyses].sort((a, b) => b.confidence - a.confidence)[0];
          return (
            <Link key={match.id} href={`/analysis/${match.id}`} className="panel grid gap-4 p-5 transition hover:border-blue-300 hover:shadow-md lg:grid-cols-[1fr_280px_auto] lg:items-center">
              <div>
                <p className="text-xs font-bold text-slate-500">{match.sport} · {match.league} · {formatDateTime(match.startTime)}</p>
                <h2 className="mt-2 text-xl font-black text-slate-950">{match.match}</h2>
                <p className="mt-2 text-sm text-slate-600">{match.headline}</p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="flex items-center gap-2 text-sm font-black text-slate-900">
                  <BarChart3 size={16} className="text-blue-600" />
                  AI 최고 신뢰도
                </p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-600">
                  <AiIdentity name={top.aiName} showBadge={false} nameClassName="text-sm" /> · {top.prediction} · {top.expectedScore}
                </p>
                <div className="mt-3 h-2 rounded-full bg-slate-200">
                  <div className="h-2 rounded-full bg-blue-600" style={{ width: `${top.confidence}%` }} />
                </div>
                <p className="mt-1 text-right text-xs font-bold text-blue-700">{top.confidence}%</p>
              </div>

              <span className="inline-flex items-center justify-center gap-1 rounded-md bg-blue-50 px-3 py-2 text-sm font-black text-blue-700">
                상세보기 <ChevronRight size={16} />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
