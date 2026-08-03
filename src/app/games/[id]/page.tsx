import { notFound } from "next/navigation";
import { AiPill, DashboardShell, Metric } from "@/components/scorehub/ScorehubPrimitives";
import { TeamMatchup } from "@/components/sports/SportsBrand";
import { LocalDateTime } from "@/components/ui/LocalDateTime";
import { getLiveData } from "@/lib/live-data";
import { getLocale, getTranslations } from "@/i18n/server";
import { localizeSport } from "@/i18n/config";

export default async function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const t = await getTranslations();
  const locale = await getLocale();
  const { id } = await params;
  const { games } = await getLiveData();
  const game = games.find((item) => item.id === id);
  if (!game) notFound();

  return (
    <DashboardShell title={`${game.homeTeam} vs ${game.awayTeam}`} eyebrow={`${localizeSport(locale, game.sport)} · ${game.league}`} description={t("games.detailDescription")}>
      <div className="panel p-5 text-lg font-black text-slate-950"><TeamMatchup homeTeam={game.homeTeam} awayTeam={game.awayTeam} /></div>
      <section className="grid gap-3 md:grid-cols-4">
        <Metric label={t("games.time")} value={<LocalDateTime value={game.startTime} />} />
        <Metric label={t("games.venue")} value={game.venue} />
        <Metric label={t("games.status")} value={game.status === "scheduled" ? t("common.scheduled") : game.status === "live" ? t("common.live") : t("common.finished")} />
        <Metric label={t("games.actualResult")} value={game.result ?? t("common.pending")} />
      </section>
      <section className="panel overflow-hidden">
        <div className="border-b border-slate-100 px-4 py-3 text-base font-black text-slate-950">{t("games.odds")}</div>
        <div className="grid gap-3 p-4 md:grid-cols-4">
          <Metric label={t("games.home")} value={game.odds.home?.toFixed(2) ?? "-"} />
          <Metric label={t("markets.draw")} value={game.odds.draw?.toFixed(2) ?? "-"} />
          <Metric label={t("games.away")} value={game.odds.away?.toFixed(2) ?? "-"} />
          <Metric label={`${t("markets.spread")} / UO`} value={`${game.odds.handicap ?? "-"} · ${game.odds.overUnder ?? "-"}`} />
        </div>
      </section>
      <section className="panel overflow-hidden">
        <div className="border-b border-slate-100 px-4 py-3 text-base font-black text-slate-950">{t("games.predictions")}</div>
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
