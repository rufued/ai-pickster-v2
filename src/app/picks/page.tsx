import { AdSlot } from "@/components/ads/AdSlot";
import { PendingPicksBoard } from "@/components/scorehub/PendingPicksBoard";
import { DashboardShell } from "@/components/scorehub/ScorehubPrimitives";
import { getLiveData, getPendingPicks } from "@/lib/live-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function PicksPage() {
  const { ais, bets } = await getLiveData();
  const upcoming = getPendingPicks(bets);

  return (
    <DashboardShell title="AI 픽 조합" eyebrow="Live picks" description="아직 정산되지 않은 예정 단일 픽과 조합 베팅만 표시합니다.">
      <AdSlot placement="picks_top" />
      <PendingPicksBoard bets={upcoming} ais={ais} />
    </DashboardShell>
  );
}
