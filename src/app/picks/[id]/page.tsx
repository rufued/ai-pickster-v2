import Link from "next/link";
import { notFound } from "next/navigation";
import { AiPill, DashboardShell, Metric, StatusBadge, currency, signedCurrency, timeUntil } from "@/components/scorehub/ScorehubPrimitives";
import { TeamMatchup } from "@/components/sports/SportsBrand";
import { LocalDateTime } from "@/components/ui/LocalDateTime";
import { getLiveData } from "@/lib/live-data";
import { getLocale, getTranslations } from "@/i18n/server";
import { localizeMarket, localizeSport } from "@/i18n/config";
import { gameDetailHref } from "@/lib/route-id";

export default async function PickDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const t = await getTranslations();
  const locale = await getLocale();
  const { id } = await params;
  const { bets } = await getLiveData();
  const bet = bets.find((item) => item.id === id);
  if (!bet) notFound();

  return (
    <DashboardShell title={t("picks.detailTitle")} eyebrow="AI pick detail" description={t("picks.detailDescription")}>
      <section className="panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <AiPill aiId={bet.aiId} />
          <StatusBadge status={bet.status} />
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <Metric label={t("picks.totalOdds")} value={bet.totalOdds.toFixed(2)} />
          <Metric label={t("picks.stake")} value={currency(bet.stake)} />
          <Metric label={t("picks.potentialProfit")} value={currency(bet.potentialProfit)} />
          <Metric label={t("picks.profit")} value={signedCurrency(bet.profit)} tone={bet.profit >= 0 ? "positive" : "negative"} />
        </div>
        <div className="mt-5 rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-black uppercase text-slate-500">{t("picks.reason")}</p>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-700">{bet.reason}</p>
        </div>
      </section>
      <section className="panel overflow-hidden">
        <div className="border-b border-slate-100 px-4 py-3 text-base font-black text-slate-950">{t("picks.allGames")}</div>
        <div className="divide-y divide-slate-100">
          {bet.legs.map((leg) => (
            <Link key={`${bet.id}-${leg.gameId}`} href={gameDetailHref(leg.gameId)} className="grid gap-2 p-4 hover:bg-slate-50 md:grid-cols-[1fr_140px_120px_100px] md:items-center">
              <div>
                <p className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-slate-500"><span>{localizeSport(locale, leg.sport)} · {leg.league}</span><span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] text-slate-700">{localizeMarket(locale, leg.market)}</span></p>
              <p className="mt-1 font-black text-slate-950"><TeamMatchup homeTeam={leg.homeTeam} awayTeam={leg.awayTeam} selectedSide={leg.selectedSide} compact /></p>
              </div>
              <p className="font-bold text-blue-700">{leg.selection}</p>
              <p className="font-black text-slate-900">{leg.odds.toFixed(2)}</p>
              <p className="text-sm font-bold text-slate-600">{leg.result}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="grid gap-3 md:grid-cols-3">
        <Metric label={t("picks.createdAt")} value={<LocalDateTime value={bet.registeredAt} />} />
        <Metric label={t("picks.gameStart")} value={<LocalDateTime value={bet.startsAt} />} />
        <Metric label={t("picks.timeUntil")} value={timeUntil(bet.startsAt, t)} />
      </section>
    </DashboardShell>
  );
}
