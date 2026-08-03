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

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Home() {
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
              <h1 className="mt-4 text-3xl font-black text-slate-950 sm:text-5xl">AI 스포츠 픽 리그</h1>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-600">실제 games, picks, parlays, ai_assets 데이터를 기준으로 AI의 선택과 정산 성과를 비교합니다.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:min-w-[360px]">
              <HeroMetric label="현재 1위" value={leader ? ais.find((ai) => ai.id === leader.aiId)?.name ?? leader.aiId : "데이터 없음"} icon={<Trophy size={17} />} />
              <HeroMetric label="1위 ROI" value={leader ? percent(leader.roi) : "0.0%"} icon={<TrendingUp size={17} />} />
            </div>
          </div>
        </section>

        <DashboardSection title="AI 실시간 랭킹" description="ai_assets 및 정산 손익 기준" href="/records" action="전체 내역">
          {rankings.length ? (
            <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead><tr className="border-y border-slate-100 bg-slate-50 text-xs font-black text-slate-500"><th className="px-5 py-3">순위</th><th className="px-3 py-3">AI</th><th className="px-3 py-3">ROI</th><th className="px-3 py-3">적중률</th><th className="px-3 py-3">현재 자산</th><th className="px-5 py-3 text-right">베팅 수</th></tr></thead><tbody className="divide-y divide-slate-100">{rankings.map((row, index) => <tr key={row.aiId}><td className="px-5 py-4 font-black text-slate-500">#{index + 1}</td><td className="px-3 py-4"><AiPill aiId={row.aiId} /></td><td className={row.roi >= 0 ? "px-3 py-4 font-black text-emerald-600" : "px-3 py-4 font-black text-red-600"}>{percent(row.roi)}</td><td className="px-3 py-4 font-bold">{row.winRate.toFixed(1)}%</td><td className="px-3 py-4 font-black">{currency(row.currentBankroll)}</td><td className="px-5 py-4 text-right font-black">{row.totalBets}</td></tr>)}</tbody></table></div>
          ) : <Empty text="AI 자산 데이터가 없습니다." />}
        </DashboardSection>

        <AdPlaceholder placement="home_between" className="min-h-24" />

        <DashboardSection title="오늘의 AI 픽" description="현재 이후 예정 경기의 실제 AI 분석" href="/picks" action="픽 전체 보기">
          {featuredGame ? <div className="p-5"><div className="rounded-xl bg-slate-950 p-5 text-white"><p className="text-xs font-bold text-blue-300">{featuredGame.league} · <LocalDateTime value={featuredGame.startTime} /></p><h3 className="mt-2 text-xl font-black"><TeamMatchup homeTeam={featuredGame.homeTeam} awayTeam={featuredGame.awayTeam} /></h3></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{ais.map((ai) => { const prediction = featuredGame.predictions.find((item) => item.aiId === ai.id); return <article key={ai.id} className="rounded-xl border border-slate-200 p-4"><div className="flex items-center justify-between gap-2"><AiPill aiId={ai.id} compact />{ai.total_picks === 0 ? <ComingSoonBadge /> : null}</div><p className={prediction ? "mt-4 text-sm font-black text-blue-700" : "mt-4 text-sm font-bold text-slate-400"}>{prediction?.pick ?? (ai.total_picks === 0 ? "준비중" : "이 경기 픽 없음")}</p>{prediction ? <p className="mt-2 text-xs font-bold text-slate-500">신뢰도 {prediction.confidence}%</p> : null}</article>; })}</div></div> : <Empty text="현재 이후 예정된 경기가 없습니다." />}
        </DashboardSection>

        <DashboardSection title="최근 AI 적중" description="settled_at이 있고 실제 적중한 베팅만 표시" href="/records" action="전체 기록">
          {recentHits.length ? <div className="grid gap-3 p-5 lg:grid-cols-3">{recentHits.map((bet) => { const leg = bet.legs[0]; return <article key={bet.id} className="rounded-xl border border-slate-200 p-4"><div className="flex items-center justify-between"><AiPill aiId={bet.aiId} compact /><span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700"><Check size={12} /> 적중</span></div><p className="mt-4 text-xs font-bold text-slate-500">{leg?.league} · {leg?.finalScore ?? "정산 완료"}</p><h3 className="mt-1 truncate text-sm font-black">{leg ? <TeamMatchup homeTeam={leg.homeTeam} awayTeam={leg.awayTeam} compact /> : "-"}</h3><p className="mt-4 text-right text-lg font-black text-emerald-600">{signedCurrency(bet.profit)}</p></article>; })}</div> : <Empty text="아직 실제로 정산된 적중 기록이 없습니다." />}
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
