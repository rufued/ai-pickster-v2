import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bot, Clock, LineChart, ListChecks, MapPin, Trophy } from "lucide-react";
import type { ReactNode } from "react";
import { AiIdentity } from "@/components/ai/AiIdentity";
import { LeagueBadge, TeamName } from "@/components/sports/SportsBrand";
import { getBattleAnalyses } from "@/lib/battleAnalyses";
import { analysisMatches, getAnalysisMatch } from "@/lib/data";
import { formatDateTime, formatPredictedTotal } from "@/lib/format";

type AnalysisDetailPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return analysisMatches.map((match) => ({ id: match.id }));
}

export default async function AnalysisDetailPage({ params }: AnalysisDetailPageProps) {
  const { id } = await params;
  const match = getAnalysisMatch(id);

  if (!match) {
    notFound();
  }

  const analyses = getBattleAnalyses(match.analyses);

  return (
    <section className="container-shell py-8">
      <Link href="/analysis" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-700">
        <ArrowLeft size={16} /> 경기분석으로 돌아가기
      </Link>

      <div className="panel mb-5 p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-blue-700">
              <span>{match.sport}</span>
              <LeagueBadge league={match.league} />
            </div>
            <h1 className="mt-3 flex flex-wrap items-center gap-3 text-3xl font-black text-slate-950">
              <TeamName team={match.homeTeam ?? ""} size="lg" />
              <span className="text-xl text-slate-400">VS</span>
              <TeamName team={match.awayTeam ?? ""} size="lg" />
            </h1>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1"><Clock size={15} /> {formatDateTime(match.startTime)}</span>
              <span className="inline-flex items-center gap-1"><MapPin size={15} /> {match.venue}</span>
            </div>
          </div>
          <div className="grid min-w-[260px] grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="min-w-0 text-sm font-black text-slate-800"><TeamName team={match.homeTeam ?? ""} /></p>
            <p className="text-2xl font-black text-slate-950">{match.status === "scheduled" ? "VS" : `${match.homeScore} : ${match.awayScore}`}</p>
            <p className="min-w-0 text-sm font-black text-slate-800"><TeamName team={match.awayTeam ?? ""} /></p>
          </div>
        </div>
        <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm font-semibold text-blue-800">{match.headline}</p>
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-3">
        <InfoPanel icon={<LineChart size={18} />} title="최근 경기 흐름" items={match.recentForm ?? []} />
        <InfoPanel icon={<ListChecks size={18} />} title="상대 전적" items={(match.headToHead ?? []).map((item) => `${item.date} · ${item.result} · ${item.note}`)} />
        <InfoPanel icon={<Trophy size={18} />} title="리그 순위" items={(match.standings ?? []).map((item) => `${item.rank}위 ${item.team} · ${item.points}점 · ${item.form}`)} />
      </div>

      <div className="panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h2 className="flex items-center gap-2 text-base font-black text-slate-950">
            <Bot size={18} className="text-blue-600" />
            AI 분석 표
          </h2>
          <span className="hidden text-xs font-black text-slate-500 sm:inline-flex sm:items-center sm:gap-2">
            <AiIdentity name="GPT" showBadge={false} nameClassName="text-xs" />
            <AiIdentity name="Gemini" showBadge={false} nameClassName="text-xs" />
            <AiIdentity name="Claude" showBadge={false} nameClassName="text-xs" />
            <AiIdentity name="Grok" showBadge={false} nameClassName="text-xs" />
            <AiIdentity name="DeepSeek" showBadge={false} nameClassName="text-xs" />
          </span>
        </div>

        <div className="grid gap-4 p-4 lg:grid-cols-3 xl:grid-cols-5">
          {analyses.map((analysis) => (
            <article key={analysis.aiName} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <AiIdentity name={analysis.aiName} showBadge={false} nameClassName="text-lg" />
                  <p className="mt-1 text-xs font-bold text-slate-500">{analysis.analysisAngle}</p>
                </div>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700">{analysis.confidence}%</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <MiniStat label="예측 결과" value={analysis.prediction} />
                <MiniStat label="예상 스코어" value={analysis.expectedScore ?? "-"} />
                <MiniStat label="오버/언더" value={analysis.overUnder ?? "-"} />
                <MiniStat label="예상 총점" value={formatPredictedTotal(match.sport, analysis.predictedTotal) ?? "-"} />
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">{analysis.summary}</p>
              <div className="mt-4 rounded-md bg-slate-50 p-3">
                <p className="text-xs font-black text-slate-500">진입 분석 코멘트</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{analysis.decisionReason}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function InfoPanel({ icon, title, items }: { icon: ReactNode; title: string; items: string[] }) {
  return (
    <section className="panel p-4">
      <h2 className="flex items-center gap-2 text-sm font-black text-slate-950">
        <span className="text-blue-600">{icon}</span>
        {title}
      </h2>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <p key={item} className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">{item}</p>
        ))}
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
      <p className="text-[11px] font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}
