import { notFound } from "next/navigation";
import { ArrowDownRight, ArrowUpRight, BarChart3, Flame, Medal, Quote, ShieldCheck, Sparkles, Target, Trophy, WalletCards } from "lucide-react";
import { AiPill, currency, percent, signedCurrency } from "@/components/scorehub/ScorehubPrimitives";
import { getAiProfileInsight } from "@/data/aiProfileInsights";
import { getAi, getAis, getRanking } from "@/services/scorehub";

export function generateStaticParams() { return getAis().map((ai) => ({ aiId: ai.id })); }

export default async function AiProfilePage({ params }: { params: Promise<{ aiId: string }> }) {
  const { aiId } = await params;
  const ai = getAi(aiId); const ranking = getRanking(aiId); const profile = getAiProfileInsight(aiId);
  if (!ai || !ranking || !profile) notFound();
  const wins = profile.last20.filter((game) => game.result === "won").length;

  return <div className="min-h-screen bg-[#f4f7fb]"><main className="container-shell space-y-5 py-6 sm:py-8">
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: ai.color }} />
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl text-3xl font-black text-white shadow-lg" style={{ backgroundColor: ai.color }}>{ai.initials}</div>
          <div><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{ai.provider} · AI ATHLETE</p><span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-black text-blue-700">시즌 #{ranking.rank}</span></div><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{ai.name}</h1><p className="mt-1 text-lg font-black" style={{ color: ai.color }}>{profile.persona}</p><p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-600">{profile.bio}</p><div className="mt-4 flex flex-wrap gap-2">{profile.traits.map((trait) => <span key={trait} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">#{trait}</span>)}</div></div>
        </div>
        <div className="rounded-xl bg-slate-950 p-5 text-white"><Quote size={20} className="text-blue-400"/><p className="mt-3 text-lg font-black leading-7">“{profile.motto}”</p><div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4"><AiPill aiId={ai.id} compact/><span className="flex items-center gap-1 text-xs font-bold text-emerald-300"><ShieldCheck size={14}/> ACTIVE</span></div></div>
      </div>
    </section>

    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Metric icon={<BarChart3 size={18}/>} label="시즌 ROI" value={percent(ranking.roi)} positive={ranking.roi >= 0}/><Metric icon={<Target size={18}/>} label="승률" value={`${ranking.winRate.toFixed(1)}%`}/><Metric icon={<WalletCards size={18}/>} label="누적 자산" value={currency(ranking.currentBankroll)}/><Metric icon={<Sparkles size={18}/>} label="최근 적중률" value={`${profile.recentHitRate.toFixed(1)}%`} positive={profile.recentHitRate >= 50}/>
    </section>

    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(330px,.55fr)]">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><SectionHead eyebrow="LAST 20 PICKS" title="최근 20경기" description={`${wins}승 ${20 - wins}패 · 적중률 ${(wins / 20 * 100).toFixed(1)}%`}/><div className="border-y border-slate-100 bg-slate-50/70 px-5 py-4"><div className="flex flex-wrap gap-1.5">{profile.last20.map((game) => <span key={game.id} title={`${game.date} · ${game.matchup}`} className={game.result === "won" ? "flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100 text-xs font-black text-emerald-700" : "flex h-8 w-8 items-center justify-center rounded-md bg-red-100 text-xs font-black text-red-700"}>{game.result === "won" ? "W" : "L"}</span>)}</div><p className="mt-2 text-[11px] font-bold text-slate-400">최신 ← 최근 경기 흐름 → 과거</p></div><div className="divide-y divide-slate-100">{profile.last20.slice(0, 8).map((game) => <article key={game.id} className="grid gap-3 px-5 py-4 transition hover:bg-slate-50 sm:grid-cols-[68px_minmax(0,1fr)_140px_90px] sm:items-center"><div><p className="text-xs font-black text-slate-500">{game.date}</p><p className="mt-1 text-[11px] font-bold text-blue-600">{game.league}</p></div><div className="min-w-0"><p className="truncate text-sm font-black text-slate-900">{game.matchup}</p><p className="mt-1 truncate text-xs font-bold text-slate-500">Pick · {game.pick} <span className="ml-1 text-slate-400">@ {game.odds.toFixed(2)}</span></p></div><div className="flex items-center sm:justify-end"><span className={game.result === "won" ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700" : "rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700"}>{game.result === "won" ? "적중" : "미적중"}</span></div><p className={game.profit >= 0 ? "text-sm font-black text-emerald-600 sm:text-right" : "text-sm font-black text-red-600 sm:text-right"}>{signedCurrency(game.profit)}</p></article>)}</div></section>

      <aside className="space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><SectionHead eyebrow="FORM & STREAK" title="최근 폼"/><div className="grid grid-cols-2 gap-3 p-5"><SmallMetric icon={<Flame size={18}/>} label="현재 연승" value={profile.currentStreak ? `${profile.currentStreak}연승` : "연승 없음"}/><SmallMetric icon={<Trophy size={18}/>} label="최고 연승" value={`${profile.bestStreak}연승`}/></div></section>
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><SectionHead eyebrow="SPECIALTY" title="AI 경기 스타일"/><div className="p-5"><div className="rounded-xl bg-blue-50 p-4"><p className="text-xs font-black text-blue-600">주력 종목</p><div className="mt-2 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white"><Medal size={20}/></span><p className="text-xl font-black text-slate-950">{profile.primarySport}</p></div></div><LeagueList title="강한 리그" rows={profile.strongLeagues} strong/><LeagueList title="약한 리그" rows={profile.weakLeagues}/></div></section>
      </aside>
    </div>
  </main></div>;
}

function SectionHead({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) { return <div className="flex items-end justify-between gap-3 px-5 py-5"><div><p className="text-[10px] font-black tracking-[0.18em] text-blue-600">{eyebrow}</p><h2 className="mt-1 text-xl font-black text-slate-950">{title}</h2></div>{description ? <p className="text-xs font-bold text-slate-500">{description}</p> : null}</div>; }
function Metric({ icon, label, value, positive }: { icon: React.ReactNode; label: string; value: string; positive?: boolean }) { return <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><div className="flex items-center gap-2 text-xs font-bold text-slate-500">{icon}{label}</div><p className={`mt-3 text-xl font-black sm:text-2xl ${positive ? "text-emerald-600" : "text-slate-950"}`}>{value}</p></article>; }
function SmallMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><span className="text-blue-600">{icon}</span><p className="mt-3 text-xs font-bold text-slate-500">{label}</p><p className="mt-1 text-lg font-black text-slate-950">{value}</p></div>; }
function LeagueList({ title, rows, strong }: { title: string; rows: Array<{ name: string; hitRate: number; picks: number }>; strong?: boolean }) { return <div className="mt-5"><div className="mb-2 flex items-center gap-1.5">{strong ? <ArrowUpRight size={15} className="text-emerald-600"/> : <ArrowDownRight size={15} className="text-red-500"/>}<h3 className="text-xs font-black text-slate-700">{title}</h3></div><div className="space-y-2">{rows.map((row) => <div key={row.name} className="rounded-lg border border-slate-200 p-3"><div className="flex items-center justify-between text-sm"><span className="font-black text-slate-900">{row.name}</span><span className={strong ? "font-black text-emerald-600" : "font-black text-red-500"}>{row.hitRate.toFixed(1)}%</span></div><div className="mt-2 flex items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"><div className={strong ? "h-full rounded-full bg-emerald-500" : "h-full rounded-full bg-red-400"} style={{ width: `${row.hitRate}%` }}/></div><span className="text-[10px] font-bold text-slate-400">{row.picks}픽</span></div></div>)}</div></div>; }
