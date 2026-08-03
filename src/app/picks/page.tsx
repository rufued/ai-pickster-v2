import { AdSlot } from "@/components/ads/AdSlot";
import { BetCard, DashboardShell } from "@/components/scorehub/ScorehubPrimitives";
import { getLiveData } from "@/lib/live-data";

export const dynamic = "force-dynamic";

export default async function PicksPage() {
  const { bets } = await getLiveData();
  const upcoming = bets
    .filter((bet) => bet.status === "scheduled" || bet.status === "live")
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  return (
    <DashboardShell title="AI 픽 조합" eyebrow="Live picks" description="Supabase에 저장된 실제 단일 픽과 조합 베팅만 표시합니다.">
      <AdSlot placement="picks_top" />
      {upcoming.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{upcoming.map((bet) => <BetCard key={bet.id} bet={bet} />)}</div> : <div className="panel p-10 text-center text-sm font-bold text-slate-500">현재 예정된 실제 픽이 없습니다.</div>}
    </DashboardShell>
  );
}
