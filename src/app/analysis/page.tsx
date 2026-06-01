import Link from "next/link";
import { ArrowUpRight, BarChart3 } from "lucide-react";
import { ConsensusBadge } from "@/components/analysis/ConsensusBadge";
import { analysisMatches } from "@/lib/data";
import { formatTime } from "@/lib/format";

export default function AnalysisPage() {
  return (
    <section className="container-shell py-12">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold text-accent-green">Analysis Center</p>
        <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">경기 분석 센터</h1>
        <p className="mt-3 text-slate-400">
          오늘 경기별 GPT, Gemini, DeepSeek의 예상 결과와 AI 의견 일치도를 비교합니다.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {analysisMatches.map((match) => (
          <article key={match.id} className="panel p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
                  <span>{match.sport}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-600" />
                  <span>{match.league}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-600" />
                  <span>{formatTime(match.startTime)}</span>
                </div>
                <h2 className="mt-2 text-xl font-black text-white">{match.match}</h2>
                <p className="mt-2 text-sm text-slate-400">{match.headline}</p>
              </div>
              <BarChart3 className="shrink-0 text-accent-green" size={22} />
            </div>

            <div className="mt-5 flex flex-col gap-4 rounded-lg border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">AI 의견 일치도</p>
                <div className="mt-3 grid gap-2">
                  {match.analyses.map((analysis) => (
                    <div key={analysis.aiName} className="flex items-center gap-3 text-sm">
                      <span className="w-20 font-bold text-white">{analysis.aiName}</span>
                      <span className="font-semibold text-accent-green">{analysis.prediction}</span>
                      <span className="text-slate-500">{analysis.confidence}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <ConsensusBadge score={match.consensusScore} label={match.consensusLabel} size="lg" />
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="text-sm text-slate-500">AI 분석 비교와 근거 확인</p>
              <Link
                href={`/analysis/${match.id}`}
                className="inline-flex items-center gap-1 rounded-md border border-white/10 px-3 py-2 text-sm font-bold text-accent-green transition hover:bg-accent-green hover:text-black"
              >
                상세 보기 <ArrowUpRight size={16} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
