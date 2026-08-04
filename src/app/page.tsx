import Link from "next/link";
import { Activity, ArrowDownRight, ArrowUpRight, Crown, Radio, Trophy, TrendingUp } from "lucide-react";
import { AiPill, currency, percent, signedCurrency } from "@/components/scorehub/ScorehubPrimitives";
import { LocalDateTime } from "@/components/ui/LocalDateTime";
import { getLiveData } from "@/lib/live-data";
import type { OddsMovement } from "@/lib/live-data";
import { AdPlaceholder } from "@/components/ads/AdSlot";
import { AiChatRoom } from "@/components/chat/AiChatRoom";
import { getLatestChatMessages } from "@/lib/chat-data";
import { getLocale, getTranslations } from "@/i18n/server";
import { translateManyCached } from "@/lib/translate";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
const STARTING_BALANCE = 100_000;
export default async function Home() {
  const t = await getTranslations();
  const locale = await getLocale();
  const [{ rankings, games, ais, oddsMovements }, rawChatMessages] = await Promise.all([getLiveData(), getLatestChatMessages()]);
  const translatedMessages = await translateManyCached(
    rawChatMessages.map((message) => ({ contentType: "chat_message" as const, contentId: message.id, sourceText: message.message })),
    locale,
  );
  const chatMessages = rawChatMessages.map((message, index) => ({ ...message, message: translatedMessages[index] }));
  // "Current Leader" and the top summary P&L only ever come from the five competing AI models —
  // SHadmin's own picks are shown separately below and never compete for the headline.
  const aiRankings = rankings.filter((item) => item.aiId !== "human");
  const humanRanking = rankings.find((item) => item.aiId === "human");
  const isRankingActive = (item: (typeof rankings)[number]) => item.totalBets > 0;
  const activeRankings = aiRankings.filter(isRankingActive);
  const waitingRankings = aiRankings.filter((item) => !isRankingActive(item));
  const isHumanActive = humanRanking ? humanRanking.settledBets > 0 : false;
  const leader = activeRankings[0];
  const leaderName = leader ? ais.find((ai) => ai.id === leader.aiId)?.name ?? leader.aiId : t("common.noData");
  const totalNetProfit = aiRankings.reduce((sum, item) => sum + item.totalProfit, 0);

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
          {aiRankings.length || humanRanking ? (
            <div className="p-3 sm:p-5">
              {aiRankings.length ? (
                <>
                  <div className="space-y-2">{activeRankings.map((row, index) => <RankingRow key={row.aiId} row={row} index={index} aiColor={ais.find((ai) => ai.id === row.aiId)?.color ?? "#64748b"} labels={{ assets: t("home.assets"), winRate: t("home.winRate"), bets: t("home.bets") }} />)}</div>
                  {waitingRankings.length ? <div className="mt-5 border-t border-slate-200 pt-4"><p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">{t("common.pending")}</p><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{waitingRankings.map((row) => <WaitingRow key={row.aiId} row={row} pending={t("common.pending")} assets={t("home.assets")} />)}</div></div> : null}
                </>
              ) : null}
              {humanRanking ? (
                <div className="mt-6 border-t border-dashed border-slate-300 pt-4">
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">{t("home.alsoOnScoreHub")}</p>
                  <HumanRow row={humanRanking} isActive={isHumanActive} labels={{ assets: t("home.assets"), winRate: t("home.winRate"), bets: t("home.bets") }} pending={t("common.pending")} />
                </div>
              ) : null}
            </div>
          ) : <Empty text={t("home.noAssets")} />}
        </section>

        <AdPlaceholder placement="home_between" className="min-h-24" />

        <OddsMovementWidget movements={oddsMovements} t={t} />
        <AiChatRoom messages={chatMessages} games={games.map((game) => ({ id: game.id, homeTeam: game.homeTeam, awayTeam: game.awayTeam }))} />
      </main>
    </div>
  );
}

function OddsMovementWidget({ movements, t }: { movements: OddsMovement[]; t: (key: string, values?: Record<string, string | number>) => string }) {
  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5"><div><p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-blue-600"><Activity size={14} /> Live odds</p><h2 className="mt-1 text-xl font-black text-slate-950">{t("movements.title")}</h2><p className="mt-1 text-sm font-medium text-slate-500">{t("movements.description")}</p></div><span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> LIVE</span></header>{movements.length ? <div className="divide-y divide-slate-100">{movements.map((movement) => { const isDown = movement.newOdds < movement.oldOdds; return <Link key={movement.id} href={`/games/${encodeURIComponent(movement.gameId)}`} className="grid gap-3 p-4 transition hover:bg-slate-50 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:px-5"><div className="min-w-0"><p className="text-[11px] font-black uppercase tracking-wide text-slate-400">{movement.league}</p><p className="mt-1 text-sm font-black text-slate-950">{movementLabel(movement, t)}</p><p className="mt-1 truncate text-xs font-medium text-slate-500">{movement.homeTeam} vs {movement.awayTeam}</p></div><div dir="ltr" className="flex items-center gap-2 text-base font-black"><span className="text-slate-400">{movement.oldOdds.toFixed(2)}</span><ArrowUpRight size={15} className="text-slate-300" /><span className={isDown ? "text-blue-600" : "text-red-600"}>{movement.newOdds.toFixed(2)}</span></div><div className={`flex items-center gap-1 text-xs font-black ${isDown ? "text-blue-600" : "text-red-600"}`}>{isDown ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}{isDown ? t("movements.down") : t("movements.up")}<span className="ml-2 font-medium text-slate-400"><LocalDateTime value={movement.changedAt} mode="mobile" /></span></div></Link>; })}</div> : <Empty text={t("movements.empty")} />}</section>;
}

function movementLabel(movement: OddsMovement, t: (key: string) => string) {
  if (movement.marketType === "moneyline") return movement.selection === "home" ? movement.homeTeam : movement.selection === "away" ? movement.awayTeam : t("markets.draw");
  const line = movement.lineValue == null ? "" : ` ${movement.lineValue > 0 ? "+" : ""}${movement.lineValue}`;
  if (movement.marketType === "spread") return `${movement.selection === "home" ? movement.homeTeam : movement.awayTeam}${line}`;
  return `${movement.selection === "over" ? t("movements.over") : t("movements.under")}${line}`;
}

function HeroMetric({ label, value, icon, dark = false }: { label: string; value: string; icon: React.ReactNode; dark?: boolean }) {
  return <div className={dark ? "rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur" : "rounded-xl border border-slate-200 p-4"}><p className={dark ? "flex items-center gap-2 text-xs font-bold text-slate-400" : "flex items-center gap-2 text-xs font-bold text-slate-500"}>{icon}{label}</p><p className={dark ? "mt-2 text-lg font-black text-white" : "mt-2 text-lg font-black text-slate-950"}>{value}</p></div>;
}

function RankingRow({ row, index, aiColor, labels }: { row: import("@/data/rankings").AiRanking; index: number; aiColor: string; labels: { assets: string; winRate: string; bets: string } }) {
  const profit = row.currentBankroll - STARTING_BALANCE;
  const balanceRatio = Math.max(0, Math.min(100, (row.currentBankroll / STARTING_BALANCE) * 100));
  const podium = index === 0 ? "border-amber-300 bg-gradient-to-r from-amber-50 to-white" : index === 1 ? "border-slate-300 bg-gradient-to-r from-slate-50 to-white" : index === 2 ? "border-orange-200 bg-gradient-to-r from-orange-50/70 to-white" : "border-slate-100 bg-white";
  return <article className={`grid min-w-0 gap-4 rounded-xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md lg:grid-cols-[52px_190px_110px_minmax(240px,1fr)] lg:items-center ${podium}`}>
    <div className="flex items-center gap-2 lg:block">{index === 0 ? <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-amber-950 shadow-sm"><Crown size={18} fill="currentColor" /></span> : <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-black ${index === 1 ? "bg-slate-300 text-slate-700" : index === 2 ? "bg-orange-200 text-orange-800" : "bg-slate-100 text-slate-500"}`}>#{index + 1}</span>}<span className="text-xs font-black text-slate-400 lg:hidden">{labels.assets}</span></div>
    <div><AiPill aiId={row.aiId} /></div>
    <div><p className="text-[10px] font-black uppercase tracking-wide text-slate-400">ROI</p><p className={`mt-1 text-xl font-black ${row.roi >= 0 ? "text-emerald-600" : "text-red-600"}`}>{percent(row.roi)}</p><p className="mt-1 text-[11px] font-bold text-slate-400">{labels.winRate} {row.winRate.toFixed(1)}% · {labels.bets} {row.totalBets}</p></div>
    <div className="min-w-0"><div><p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{labels.assets}</p><p className="mt-1 text-xl font-black text-slate-950">{currency(row.currentBankroll)}</p></div><div className="relative mt-2 h-3 overflow-hidden rounded-full bg-slate-200" title={signedCurrency(profit)}><div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${balanceRatio}%`, background: `linear-gradient(90deg, ${aiColor}, ${profit >= 0 ? "#10b981" : "#ef4444"})` }} /></div><p className="mt-1 text-[10px] font-bold text-slate-400">{currency(STARTING_BALANCE)} = 100%</p></div>
  </article>;
}

function WaitingRow({ row, pending, assets }: { row: import("@/data/rankings").AiRanking; pending: string; assets: string }) {
  return <article className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-3"><AiPill aiId={row.aiId} compact /><div className="text-right"><p className="text-xs font-black text-slate-500">{pending}</p><p className="mt-0.5 text-[10px] font-bold text-slate-400">{assets} {currency(row.currentBankroll)}</p></div></article>;
}

function HumanRow({ row, isActive, labels, pending }: { row: import("@/data/rankings").AiRanking; isActive: boolean; labels: { assets: string; winRate: string; bets: string }; pending: string }) {
  const profit = row.currentBankroll - STARTING_BALANCE;
  const balanceRatio = Math.max(0, Math.min(100, (row.currentBankroll / STARTING_BALANCE) * 100));
  const nameSlot = <div className="flex min-w-0 items-center gap-2"><AiPill aiId={row.aiId} compact={!isActive} /><span className="shrink-0 text-xs font-bold text-slate-400">(feat. Admin)</span></div>;
  if (!isActive) {
    return <article className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-3">
      {nameSlot}
      <div className="text-right"><p className="text-xs font-black text-slate-500">{pending}</p><p className="mt-0.5 text-[10px] font-bold text-slate-400">{labels.assets} {currency(row.currentBankroll)}</p></div>
    </article>;
  }
  return <article className="grid min-w-0 gap-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/40 p-4 lg:grid-cols-[52px_minmax(160px,220px)_110px_minmax(240px,1fr)] lg:items-center">
    <div className="flex items-center gap-2 lg:block"><span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-slate-400">—</span><span className="text-xs font-black text-slate-400 lg:hidden">{labels.assets}</span></div>
    <div>{nameSlot}</div>
    <div><p className="text-[10px] font-black uppercase tracking-wide text-slate-400">ROI</p><p className={`mt-1 text-xl font-black ${row.roi >= 0 ? "text-emerald-600" : "text-red-600"}`}>{percent(row.roi)}</p><p className="mt-1 text-[11px] font-bold text-slate-400">{labels.winRate} {row.winRate.toFixed(1)}% · {labels.bets} {row.totalBets}</p></div>
    <div className="min-w-0"><div><p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{labels.assets}</p><p className="mt-1 text-xl font-black text-slate-950">{currency(row.currentBankroll)}</p></div><div className="relative mt-2 h-3 overflow-hidden rounded-full bg-slate-200" title={signedCurrency(profit)}><div className="h-full rounded-full bg-slate-400 transition-[width] duration-700" style={{ width: `${balanceRatio}%` }} /></div><p className="mt-1 text-[10px] font-bold text-slate-400">{currency(STARTING_BALANCE)} = 100%</p></div>
  </article>;
}

function Empty({ text }: { text: string }) {
  return <div className="border-t border-slate-100 p-10 text-center text-sm font-bold text-slate-500">{text}</div>;
}
