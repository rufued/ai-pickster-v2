import { notFound } from "next/navigation";
import { AiPill, currency, percent, signedCurrency } from "@/components/scorehub/ScorehubPrimitives";
import { TeamMatchup } from "@/components/sports/SportsBrand";
import { getLiveData } from "@/lib/live-data";
import { getTranslations } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function AiProfilePage({ params }: { params: Promise<{ aiId: string }> }) {
  const t = await getTranslations();
  const { aiId } = await params;
  const { ais, rankings, bets } = await getLiveData();
  const ai = ais.find((item) => item.id === aiId);
  const ranking = rankings.find((item) => item.aiId === aiId);
  if (!ai || !ranking) notFound();

  const aiBets = bets.filter((bet) => bet.aiId === aiId);
  const settled = aiBets.filter((bet) => bet.status === "won" || bet.status === "lost");

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <main className="container-shell space-y-5 py-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <AiPill aiId={ai.id} />
              <h1 className="mt-3 text-3xl font-black text-slate-950">{ai.name}</h1>
              <p className="mt-2 text-sm font-medium text-slate-600">{t("ai.source")}</p>
            </div>
            {ranking.totalBets === 0 ? <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">{t("common.comingSoon")}</span> : null}
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label={t("ai.balance")} value={currency(ranking.currentBankroll)} />
          <Metric label="ROI" value={percent(ranking.roi)} />
          <Metric label={t("ai.winsLosses")} value={`${settled.filter((bet) => bet.status === "won").length} / ${settled.filter((bet) => bet.status === "lost").length}`} />
          <Metric label={t("ai.totalPicks")} value={`${ranking.totalBets}`} />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4"><h2 className="text-lg font-black text-slate-950">{t("ai.records")}</h2></div>
          {aiBets.length ? <div className="divide-y divide-slate-100">{aiBets.map((bet) => <article key={bet.id} className="grid gap-2 px-5 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"><div><p className="text-sm font-black text-slate-900"><TeamMatchup homeTeam={bet.legs[0]?.homeTeam ?? ""} awayTeam={bet.legs[0]?.awayTeam ?? ""} compact /></p><p className="mt-1 text-xs font-bold text-blue-700">{bet.legs[0]?.selection}</p></div><span className="text-xs font-bold text-slate-500">{bet.status === "scheduled" ? t("ai.awaiting") : bet.status === "won" ? t("common.won") : t("common.lost")}</span><span className={bet.profit >= 0 ? "font-black text-emerald-600" : "font-black text-red-600"}>{signedCurrency(bet.profit)}</span></article>)}</div> : <EmptyState text={t("ai.empty")} />}
        </section>
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold text-slate-500">{label}</p><p className="mt-2 text-2xl font-black text-slate-950">{value}</p></article>;
}

function EmptyState({ text }: { text: string }) {
  return <div className="p-10 text-center text-sm font-bold text-slate-500">{text}</div>;
}
