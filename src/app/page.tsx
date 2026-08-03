import Link from "next/link";
import { ArrowUpRight, Check, Crown, Radio, Trophy, TrendingUp } from "lucide-react";
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
const STARTING_BALANCE = 100_000;
const personalityMarks: Record<string, { mark: string; tone: string }> = {
  gpt: { mark: "◆", tone: "bg-emerald-50 text-emerald-700" },
  gemini: { mark: "✦", tone: "bg-blue-50 text-blue-700" },
  claude: { mark: "◎", tone: "bg-amber-50 text-amber-700" },
  grok: { mark: "⚡", tone: "bg-slate-900 text-white" },
  deepseek: { mark: "·", tone: "bg-violet-50 text-violet-700" },
};

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
  const aiRankings = rankings.filter((item) => item.aiId !== "human");
  const operator = rankings.find((item) => item.aiId === "human");
  const activeRankings = aiRankings.filter((item) => item.totalBets > 0);
  const waitingRankings = aiRankings.filter((item) => item.totalBets === 0);
  const leader = activeRankings[0];
  const leaderName = leader ? ais.find((ai) => ai.id === leader.aiId)?.name ?? leader.aiId : t("common.noData");
  const totalNetProfit = aiRankings.reduce((sum, item) => sum + item.totalProfit, 0);
  const featuredGame = upcomingGames.find((game) => game.predictions.length > 0) ?? upcomingGames[0];

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container-shell space-y-6 py-6 sm:py-8">
        <section className="relative overflow-hidden rounded-2xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="relative">
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-black text-emerald-300"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span><Radio size={13} /> LIVE SUPABASE DATA</p>
              <h1 className="mt-5 max-w-4xl text-3xl font-black leading-tight text-white sm:text-5xl">{t("home.title")}</h1>
              <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-slate-300">{t("home.description")}</p>
              <p className="mt-3 text-sm font-black text-blue-300">{t("home.leader")} {leaderName} <span className="mx-2 text-slate-600">·</span> {t("records.profit")} {signedCurrency(totalNetProfit)}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:min-w-[360px]">
              <HeroMetric label={t("home.leader")} value={leaderName} icon={<Trophy size={17} />} dark />
              <HeroMetric label={t("home.leaderRoi")} value={leader ? percent(leader.roi) : "0.0%"} icon={<TrendingUp size={17} />} dark />
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 p-5 sm:p-6"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">AI vs AI</p><h2 className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">{t("home.ranking")}</h2><p className="mt-1 text-sm font-medium text-slate-500">{t("home.rankingDesc")}</p></div><Link href="/records" className="inline-flex items-center gap-1 text-xs font-black text-blue-700">{t("home.allRecords")}<ArrowUpRight size={14} /></Link></header>
          {rankings.length ? (
            <div className="p-3 sm:p-5"><div className="space-y-2">{activeRankings.map((row, index) => <RankingRow key={row.aiId} row={row} index={index} aiColor={ais.find((ai) => ai.id === row.aiId)?.color ?? "#64748b"} labels={{ assets: t("home.assets"), winRate: t("home.winRate"), bets: t("home.bets") }} />)}</div>{waitingRankings.length ? <div className="mt-5 border-t border-slate-200 pt-4"><p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">{t("common.pending")}</p><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{waitingRankings.map((row) => <WaitingRow key={row.aiId} row={row} pending={t("common.pending")} assets={t("home.assets")} />)}</div></div> : null}{operator ? <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2"><div className="flex items-center gap-2"><span className="text-xs font-black text-slate-400">+ SHadmin</span><AiPill aiId="human" compact /></div><span className="text-xs font-bold text-slate-500">{currency(operator.currentBankroll)} · {operator.totalBets} bets</span></div> : null}</div>
          ) : <Empty text={t("home.noAssets")} />}
        </section>

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

function HeroMetric({ label, value, icon, dark = false }: { label: string; value: string; icon: React.ReactNode; dark?: boolean }) {
  return <div className={dark ? "rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur" : "rounded-xl border border-slate-200 p-4"}><p className={dark ? "flex items-center gap-2 text-xs font-bold text-slate-400" : "flex items-center gap-2 text-xs font-bold text-slate-500"}>{icon}{label}</p><p className={dark ? "mt-2 text-lg font-black text-white" : "mt-2 text-lg font-black text-slate-950"}>{value}</p></div>;
}

function RankingRow({ row, index, aiColor, labels }: { row: import("@/data/rankings").AiRanking; index: number; aiColor: string; labels: { assets: string; winRate: string; bets: string } }) {
  const profit = row.currentBankroll - STARTING_BALANCE;
  const balanceRatio = Math.max(0, Math.min(100, (row.currentBankroll / STARTING_BALANCE) * 100));
  const podium = index === 0 ? "border-amber-300 bg-gradient-to-r from-amber-50 to-white" : index === 1 ? "border-slate-300 bg-gradient-to-r from-slate-50 to-white" : index === 2 ? "border-orange-200 bg-gradient-to-r from-orange-50/70 to-white" : "border-slate-100 bg-white";
  const mark = personalityMarks[row.aiId] ?? { mark: "·", tone: "bg-slate-100 text-slate-600" };
  return <article className={`grid min-w-0 gap-4 rounded-xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md lg:grid-cols-[52px_190px_110px_minmax(240px,1fr)] lg:items-center ${podium}`}>
    <div className="flex items-center gap-2 lg:block">{index === 0 ? <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-amber-950 shadow-sm"><Crown size={18} fill="currentColor" /></span> : <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-black ${index === 1 ? "bg-slate-300 text-slate-700" : index === 2 ? "bg-orange-200 text-orange-800" : "bg-slate-100 text-slate-500"}`}>#{index + 1}</span>}<span className="text-xs font-black text-slate-400 lg:hidden">{labels.assets}</span></div>
    <div className="flex items-center justify-between gap-3"><AiPill aiId={row.aiId} /><span aria-hidden="true" className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-black ${mark.tone}`}>{mark.mark}</span></div>
    <div><p className="text-[10px] font-black uppercase tracking-wide text-slate-400">ROI</p><p className={`mt-1 text-xl font-black ${row.roi >= 0 ? "text-emerald-600" : "text-red-600"}`}>{percent(row.roi)}</p><p className="mt-1 text-[11px] font-bold text-slate-400">{labels.winRate} {row.winRate.toFixed(1)}% · {labels.bets} {row.totalBets}</p></div>
    <div className="min-w-0"><div><p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{labels.assets}</p><p className="mt-1 text-xl font-black text-slate-950">{currency(row.currentBankroll)}</p></div><div className="relative mt-2 h-3 overflow-hidden rounded-full bg-slate-200" title={signedCurrency(profit)}><div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${balanceRatio}%`, background: `linear-gradient(90deg, ${aiColor}, ${profit >= 0 ? "#10b981" : "#ef4444"})` }} /></div><p className="mt-1 text-[10px] font-bold text-slate-400">{currency(STARTING_BALANCE)} = 100%</p></div>
  </article>;
}

function WaitingRow({ row, pending, assets }: { row: import("@/data/rankings").AiRanking; pending: string; assets: string }) {
  const mark = personalityMarks[row.aiId] ?? { mark: "·", tone: "bg-slate-100 text-slate-600" };
  return <article className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-3"><div className="flex min-w-0 items-center gap-2"><AiPill aiId={row.aiId} compact /><span aria-hidden="true" className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-black ${mark.tone}`}>{mark.mark}</span></div><div className="text-right"><p className="text-xs font-black text-slate-500">{pending}</p><p className="mt-0.5 text-[10px] font-bold text-slate-400">{assets} {currency(row.currentBankroll)}</p></div></article>;
}

function Empty({ text }: { text: string }) {
  return <div className="border-t border-slate-100 p-10 text-center text-sm font-bold text-slate-500">{text}</div>;
}
