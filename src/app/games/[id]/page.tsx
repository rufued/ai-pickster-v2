import { notFound } from "next/navigation";
import { AiPill, DashboardShell, Metric } from "@/components/scorehub/ScorehubPrimitives";
import { TeamMatchup } from "@/components/sports/SportsBrand";
import { LocalDateTime } from "@/components/ui/LocalDateTime";
import { getLiveData } from "@/lib/live-data";

export default async function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { games } = await getLiveData();
  const game = games.find((item) => item.id === id);
  if (!game) notFound();

  return (
    <DashboardShell title={`${game.homeTeam} vs ${game.awayTeam}`} eyebrow={`${game.sport} · ${game.league}`} description="경기 정보, AI별 예측과 근거, 실제 결과를 확인합니다.">
      <div className="panel p-5 text-lg font-black text-slate-950"><TeamMatchup homeTeam={game.homeTeam} awayTeam={game.awayTeam} /></div>
      <section className="grid gap-3 md:grid-cols-4">
        <Metric label="경기시간" value={<LocalDateTime value={game.startTime} />} />
        <Metric label="경기장" value={game.venue} />
        <Metric label="상태" value={game.status} />
        <Metric label="실제 결과" value={game.result ?? "대기"} />
      </section>
      <section className="panel overflow-hidden">
        <div className="border-b border-slate-100 px-4 py-3 text-base font-black text-slate-950">배당</div>
        <div className="grid gap-3 p-4 md:grid-cols-4">
          <Metric label="홈" value={game.odds.home?.toFixed(2) ?? "-"} />
          <Metric label="무승부" value={game.odds.draw?.toFixed(2) ?? "-"} />
          <Metric label="원정" value={game.odds.away?.toFixed(2) ?? "-"} />
          <Metric label="핸디캡 / UO" value={`${game.odds.handicap ?? "-"} · ${game.odds.overUnder ?? "-"}`} />
        </div>
      </section>
      <section className="panel overflow-hidden">
        <div className="border-b border-slate-100 px-4 py-3 text-base font-black text-slate-950">AI별 예측</div>
        <div className="divide-y divide-slate-100">
          {game.predictions.map((prediction) => (
            <article key={`${game.id}-${prediction.aiId}`} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <AiPill aiId={prediction.aiId} />
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">{prediction.confidence}%</span>
              </div>
              <p className="mt-3 text-lg font-black text-slate-950">{prediction.pick}</p>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{prediction.reason}</p>
            </article>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
