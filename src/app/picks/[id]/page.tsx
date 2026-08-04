import Link from "next/link";
import { BookOpen, Layers3 } from "lucide-react";
import { notFound } from "next/navigation";
import { AiPill, DashboardShell, Metric, currency, signedCurrency, timeUntil } from "@/components/scorehub/ScorehubPrimitives";
import { TeamMatchup } from "@/components/sports/SportsBrand";
import { LocalDateTime } from "@/components/ui/LocalDateTime";
import type { AiBet, BetLeg } from "@/data/bets";
import { getLiveData } from "@/lib/live-data";
import { getLocale, getTranslations } from "@/i18n/server";
import { localizeMarket, localizeSport } from "@/i18n/config";
import { gameDetailHref } from "@/lib/route-id";
import { translateCached } from "@/lib/translate";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PickDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const t = await getTranslations();
  const locale = await getLocale();
  const { id } = await params;
  const { bets } = await getLiveData();
  const rawBet = bets.find((item) => item.id === id);
  if (!rawBet) notFound();
  const isParlay = rawBet.kind === "combo";

  const [translatedReason, translatedLegs] = await Promise.all([
    translateCached({ contentType: "pick_analysis", contentId: rawBet.id, locale, sourceText: rawBet.reason }),
    Promise.all(rawBet.legs.map(async (leg) => {
      if (!leg.analysis || !leg.pickId) return leg;
      const analysis = await translateCached({ contentType: "pick_analysis", contentId: leg.pickId, locale, sourceText: leg.analysis });
      return { ...leg, analysis };
    })),
  ]);
  const bet: AiBet = { ...rawBet, reason: translatedReason, legs: translatedLegs };

  return (
    <DashboardShell title={isParlay ? t("report.parlayTitle") : t("report.singleTitle")} eyebrow="Pick analysis report" description={t("report.description")}>
      <section className="overflow-hidden rounded-2xl bg-slate-950 text-white shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 p-5 sm:p-6">
          <div className="[&>span]:text-white"><AiPill aiId={bet.aiId} />{isParlay ? <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-blue-200"><Layers3 size={14} /> {t("picks.parlay", { count: bet.legs.length })}</p> : null}</div>
          <DetailStatusBadge status={bet.status} t={t} />
        </div>
        <div className="p-5 sm:p-6">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-blue-300"><BookOpen size={15} /> {t("picks.reason")}</p>
          <div className="mt-3 max-w-4xl space-y-3 text-sm font-medium leading-7 text-slate-200"><Paragraphs text={bet.reason} /></div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label={t("picks.totalOdds")} value={bet.totalOdds.toFixed(2)} />
        <Metric label={t("picks.stake")} value={currency(bet.stake)} />
        <Metric label={t("picks.potentialProfit")} value={currency(bet.potentialProfit)} />
        <Metric label={t("picks.profit")} value={signedCurrency(bet.profit)} tone={bet.profit >= 0 ? "positive" : "negative"} />
      </section>

      <section className="space-y-3">
        <div><h2 className="text-lg font-black text-slate-950">{t("report.legAnalysis")}</h2><p className="mt-1 text-sm font-medium text-slate-500">{t("report.legAnalysisDescription")}</p></div>
        {bet.legs.map((leg, index) => <LegReport key={`${bet.id}-${leg.gameId}-${index}`} leg={leg} index={index} locale={locale} t={t} />)}
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <Metric label={t("picks.createdAt")} value={<LocalDateTime value={bet.registeredAt} />} />
        <Metric label={t("picks.gameStart")} value={<LocalDateTime value={bet.startsAt} />} />
        <Metric label={t("picks.timeUntil")} value={timeUntil(bet.startsAt, t)} />
      </section>
    </DashboardShell>
  );
}

function LegReport({ leg, index, locale, t }: { leg: BetLeg; index: number; locale: Parameters<typeof localizeSport>[0]; t: (key: string, values?: Record<string, string | number>) => string }) {
  return <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[42px_minmax(0,1fr)_180px] lg:items-center"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-sm font-black text-blue-700">{index + 1}</span><div className="min-w-0"><p className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500"><span>{localizeSport(locale, leg.sport)} · {leg.league}</span><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">{localizeMarket(locale, leg.market)}</span></p><p className="mt-2 text-base font-black text-slate-950"><TeamMatchup homeTeam={leg.homeTeam} awayTeam={leg.awayTeam} selectedSide={leg.selectedSide} pickType={leg.pickType} oddsOptions={leg.oddsOptions} /></p></div><div className="rounded-lg bg-blue-50 p-3"><p className="text-[11px] font-black uppercase text-blue-500">{t("common.pick")}</p><p className="mt-1 text-sm font-black text-blue-800">{leg.selection || "-"}</p><p dir="ltr" className="mt-1 text-lg font-black text-slate-950">{leg.odds.toFixed(2)}</p></div></div><div className="border-t border-slate-100 bg-slate-50/70 p-4 sm:px-5"><p className="text-xs font-black text-slate-500">{t("report.legReason")}</p><div className="mt-2 space-y-2 text-sm font-medium leading-7 text-slate-700"><Paragraphs text={leg.analysis ?? t("report.noAnalysis")} /></div><Link href={gameDetailHref(leg.gameId)} className="mt-3 inline-flex text-xs font-black text-blue-700 hover:text-blue-900">{t("games.detail")} →</Link></div></article>;
}

function Paragraphs({ text }: { text: string }) {
  const paragraphs = text.split(/\n+/).map((value) => value.trim()).filter(Boolean);
  return <>{(paragraphs.length ? paragraphs : ["-"]).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</>;
}

function DetailStatusBadge({ status, t }: { status: AiBet["status"]; t: (key: string) => string }) {
  const label = status === "scheduled" ? t("common.scheduled") : status === "live" ? t("common.live") : status === "won" ? t("common.won") : status === "lost" ? t("common.lost") : t("common.void");
  const tone = status === "won" ? "bg-emerald-400/15 text-emerald-300" : status === "lost" ? "bg-red-400/15 text-red-300" : status === "live" ? "bg-amber-400/15 text-amber-200" : "bg-blue-400/15 text-blue-200";
  return <span className={`rounded-full px-3 py-1.5 text-xs font-black ${tone}`}>{label}</span>;
}
