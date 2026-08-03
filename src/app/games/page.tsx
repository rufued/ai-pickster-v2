import { AdSlot } from "@/components/ads/AdSlot";
import { GameOddsBoard } from "@/components/scorehub/GameOddsBoard";
import { DashboardShell } from "@/components/scorehub/ScorehubPrimitives";
import { getLiveData } from "@/lib/live-data";

export default async function GamesPage() {
  const { games } = await getLiveData();
  return (
    <DashboardShell
      title="경기·배당"
      eyebrow="Games and odds"
      description="AI가 참고하는 경기 정보와 배당을 금융 대시보드 형태로 정리합니다. 실제 베팅 기능은 제공하지 않습니다."
    >
      <AdSlot placement="games_top" />
      {games.length ? <GameOddsBoard games={games} /> : <div className="panel p-8 text-center text-sm font-bold text-slate-500">등록된 경기 데이터가 없습니다.</div>}
    </DashboardShell>
  );
}
