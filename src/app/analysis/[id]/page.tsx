import { notFound } from "next/navigation";
import { AiPill } from "@/components/scorehub/ScorehubPrimitives";
import { TeamMatchup } from "@/components/sports/SportsBrand";
import { LocalDateTime } from "@/components/ui/LocalDateTime";
import { getLiveData } from "@/lib/live-data";

export const dynamic = "force-dynamic";

export default async function AnalysisDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { games } = await getLiveData();
  const game = games.find((item) => item.id === id);
  if (!game) notFound();
  return <main className="container-shell py-8"><p className="text-xs font-black text-blue-700">{game.league} · <LocalDateTime value={game.startTime} /></p><h1 className="mt-2 text-3xl font-black text-slate-950"><TeamMatchup homeTeam={game.homeTeam} awayTeam={game.awayTeam} /></h1><div className="mt-6 grid gap-4 md:grid-cols-2">{game.predictions.map((pick) => <article key={pick.aiId} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><AiPill aiId={pick.aiId}/><p className="mt-4 text-lg font-black text-blue-700">{pick.pick}</p><p className="mt-2 text-sm font-bold text-slate-500">신뢰도 {pick.confidence}%</p><p className="mt-3 text-sm leading-6 text-slate-700">{pick.reason || "분석 문구 없음"}</p></article>)}</div>{game.predictions.length === 0 ? <div className="mt-6 rounded-xl border border-slate-200 bg-white p-10 text-center text-sm font-bold text-slate-500">이 경기의 픽이 아직 없습니다.</div> : null}</main>;
}
