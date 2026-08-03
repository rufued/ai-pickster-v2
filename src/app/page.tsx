import Link from "next/link";
import { ArrowUpRight, Check, Sparkles, Trophy, TrendingUp } from "lucide-react";
import { ComingSoonBadge } from "@/components/ai/AiIdentity";
import { AiPill, currency, percent, signedCurrency } from "@/components/scorehub/ScorehubPrimitives";
import { TeamMatchup } from "@/components/sports/SportsBrand";
import { LocalDateTime } from "@/components/ui/LocalDateTime";
import { getLiveData } from "@/lib/live-data";
import { AdPlaceholder } from "@/components/ads/AdSlot";
import { AiChatRoom } from "@/components/chat/AiChatRoom";
import { getLatestChatMessages } from "@/lib/chat-data";
import { getTranslations } from "@/i18n/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Home() {
  const t = await getTranslations();
  const [{ rankings, games, ais, bets }, chatMessages] = await Promise.all([getLiveData(), getLatestChatMessages()]);
  const now = Date.now();
  const upcomingGames = games
    .filter((game) => game.status === "scheduled" && new Date(game.startTime).getTime() >= now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  const activeAiIds = new Set(ais.filter((ai) => ai.total_picks > 0).map((ai) => ai.id));
  const recentHits = bets
    .filter((bet) => bet.status === "won" && activeAiIds.has(bet.aiId))
    .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
    .slice(0, 3);
  const leader = rankings[0];
  const featuredGame = upcomingGames.find((game) => game.predictions.length > 0) ?? upcomingGames[0];

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container-shell space-y-6 py-6 sm:py-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700"><Sparkles size={14} /> LIVE SUPABASE DATA</p>
              <h1 className="mt-4 text-3xl font-black text-slate-950 sm:text-5xl">{t("home.title")}</h1>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-600">{t("home.description")}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:min-w-[360px]">
              <HeroMetric label={t("home.leader")} value={leader ? ais.find((ai) => ai.id === leader.aiId)?.name ?? leader.aiId : t("common.noData")} icon={<Trophy size={17} />} />
              <HeroMetric label={t("home.leaderRoi")} value={leader ? percent(leader.roi) : "0.0%"} icon={<TrendingUp size={17} />} />
            </div>
          </div>
        </section>

        <DashboardSection title={t("home.ranking")} description={t("home.rankingDesc")} href="/records" action={t("home.allRecords")}>
          {rankings.length ? (
            <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead><tr className="border-y border-slate-100 bg-slate-50 text-xs font-black text-slate-500"><th className="px-5 py-3">{t("home.rank")}</th><th className="px-3 py-3">AI</th><th className="px-3 py-3">ROI</th><th className="px-3 py-3">{t("home.winRate")}</th><th className="px-3 py-3">{t("home.assets")}</th><th className="px-5 py-3 text-right">{t("home.bets")}</th></tr></thead><tbody className="divide-y divide-slate-100">{rankings.map((row, index) => <tr key={row.aiId}><td className="px-5 py-4 font-black text-slate-500">#{index + 1}</td><td className="px-3 py-4"><AiPill aiId={row.aiId} /></td><td className={row.roi >= 0 ? "px-3 py-4 font-black text-emerald-600" : "px-3 py-4 font-black text-red-600"}>{percent(row.roi)}</td><td className="px-3 py-4 font-bold">{row.winRate.toFixed(1)}%</td><td className="px-3 py-4 font-black">{currency(row.currentBankroll)}</td><td className="px-5 py-4 text-right font-black">{row.totalBets}</td></tr>)}</tbody></table></div>
          ) : <Empty text={t("home.noAssets")} />}
        </DashboardSection>

        <AdPlaceholder placement="home_between" className="min-h-24" />

        <DashboardSection title={t("home.todayPicks")} description={t("home.todayPicksDesc")} href="/picks" action={t("home.allPicks")}>
          {featuredGame ? <div className="p-5"><div className="rounded-xl bg-slate-950 p-5 text-white"><p className="text-xs font-bold text-blue-300">{featuredGame.league} · <LocalDateTime value={featuredGame.startTime} /></p><h3 className="mt-2 text-xl font-black"><TeamMatchup homeTeam={featuredGame.homeTeam} awayTeam={featuredGame.awayTeam} /></h3></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{ais.map((ai) => { const prediction = featuredGame.predictions.find((item) => item.aiId === ai.id); return <article key={ai.id} className="rounded-xl border border-slate-200 p-4"><div className="flex items-center justify-between gap-2"><AiPill aiId={ai.id} compact />{ai.total_picks === 0 ? <ComingSoonBadge /> : null}</div><p className={prediction ? "mt-4 text-sm font-black text-blue-700" : "mt-4 text-sm font-bold text-slate-400"}>{prediction?.pick ?? (ai.total_picks === 0 ? t("common.comingSoon") : t("home.noGamePick"))}</p>{prediction ? <p className="mt-2 text-xs font-bold text-slate-500">{t("home.confidence", { value: prediction.confidence })}</p> : null}</article>; })}</div></div> : <Empty text={t("home.noUpcoming")} />}
        </DashboardSection>

        <DashboardSection title={t("home.recentHits")} description={t("home.recentHitsDesc")} href="/records" action={t("home.allHistory")}>
          {recentHits.length ? <div className="grid gap-3 p-5 lg:grid-cols-3">{recentHits.map((bet) => { const leg = bet.legs[0]; return <article key={bet.id} className="rounded-xl border border-slate-200 p-4"><div className="flex items-center justify-between"><AiPill aiId={bet.aiId} compact /><span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700"><Check size={12} /> {t("common.won")}</span></div><p className="mt-4 text-xs font-bold text-slate-500">{leg?.league} · {leg?.finalScore ?? t("home.settled")}</p><h3 className="mt-1 truncate text-sm font-black">{leg ? <TeamMatchup homeTeam={leg.homeTeam} awayTeam={leg.awayTeam} compact /> : "-"}</h3><p className="mt-4 text-right text-lg font-black text-emerald-600">{signedCurrency(bet.profit)}</p></article>; })}</div> : <Empty text={t("home.noHits")} />}
        </DashboardSection>
        <AiChatRoom messages={chatMessages} games={games.map((game) => ({ id: game.id, homeTeam: game.homeTeam, awayTeam: game.awayTeam }))} />
      </main>
    </div>
  );
}

function DashboardSection({ title, description, href, action, children }: { title: string; description: string; href: string; action: string; children: React.ReactNode }) {
  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><header className="flex items-end justify-between gap-3 p-5"><div><h2 className="text-xl font-black text-slate-950">{title}</h2><p className="mt-1 text-sm font-medium text-slate-500">{description}</p></div><Link href={href} className="inline-flex items-center gap-1 text-xs font-black text-blue-700">{action}<ArrowUpRight size={14} /></Link></header>{children}</section>;
}

function HeroMetric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return <div className="rounded-xl border border-slate-200 p-4"><p className="flex items-center gap-2 text-xs font-bold text-slate-500">{icon}{label}</p><p className="mt-2 text-lg font-black text-slate-950">{value}</p></div>;
}

function Empty({ text }: { text: string }) {
  return <div className="border-t border-slate-100 p-10 text-center text-sm font-bold text-slate-500">{text}</div>;
}
