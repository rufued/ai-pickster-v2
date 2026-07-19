import { AdSlot } from "@/components/ads/AdSlot";
import { GameOddsBoard } from "@/components/scorehub/GameOddsBoard";
import { DashboardShell } from "@/components/scorehub/ScorehubPrimitives";
import { getGames } from "@/services/scorehub";

export default function GamesPage() {
  return (
    <DashboardShell
      title="경기·배당"
      eyebrow="Games and odds"
      description="AI가 참고하는 경기 정보와 배당을 금융 대시보드 형태로 정리합니다. 실제 베팅 기능은 제공하지 않습니다."
    >
      <AdSlot placement="games_top" />
      <GameOddsBoard games={getGames()} />
    </DashboardShell>
  );
}
