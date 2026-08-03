import { AdSlot } from "@/components/ads/AdSlot";
import { GameOddsBoard } from "@/components/scorehub/GameOddsBoard";
import { DashboardShell } from "@/components/scorehub/ScorehubPrimitives";
import { getLiveData } from "@/lib/live-data";

export default async function GamesPage() {
  const { games } = await getLiveData();
  const now = Date.now();
  const upcomingGames = games
    .filter((game) => {
      const startTime = new Date(game.startTime).getTime();
      return game.status === "scheduled" && Number.isFinite(startTime) && startTime >= now;
    })
    .sort((first, second) => new Date(first.startTime).getTime() - new Date(second.startTime).getTime());
  return (
    <DashboardShell
      title="경기·배당"
      eyebrow="Games and odds"
      description="AI가 참고하는 경기 정보와 배당을 금융 대시보드 형태로 정리합니다. 실제 베팅 기능은 제공하지 않습니다."
    >
      <AdSlot placement="games_top" />
      {upcomingGames.length ? <GameOddsBoard games={upcomingGames} /> : <div className="panel p-8 text-center text-sm font-bold text-slate-500">예정된 경기 데이터가 없습니다.</div>}
    </DashboardShell>
  );
}
