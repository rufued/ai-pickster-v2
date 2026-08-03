import { AdSlot } from "@/components/ads/AdSlot";
import { GameOddsBoard } from "@/components/scorehub/GameOddsBoard";
import { DashboardShell } from "@/components/scorehub/ScorehubPrimitives";
import { getLiveData } from "@/lib/live-data";
import { getTranslations } from "@/i18n/server";
import { SPORTS } from "@/lib/odds-api";
import { isEsportsSport, isMajorEsportsLeague } from "@/lib/esports-leagues";

const SEASON_ACTIVITY_DAYS = 14;

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function GamesPage() {
  const t = await getTranslations();
  const { games } = await getLiveData();
  const now = Date.now();
  const activityCutoff = now - SEASON_ACTIVITY_DAYS * 24 * 60 * 60 * 1000;
  const recentSportCounts = games.reduce<Record<string, number>>((counts, game) => {
    const startTime = new Date(game.startTime).getTime();
    if (Number.isFinite(startTime) && startTime >= activityCutoff) {
      counts[game.sportKey] = (counts[game.sportKey] ?? 0) + 1;
    }
    return counts;
  }, {});
  const recentLeagueCounts = games.reduce<Record<string, number>>((counts, game) => {
    const startTime = new Date(game.startTime).getTime();
    if (Number.isFinite(startTime) && startTime >= activityCutoff) {
      const key = `${game.sportKey}:${game.sportCode}:${game.league}`;
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  }, {});
  const recentGameCounts = games.reduce<Record<string, number>>((counts, game) => {
    const startTime = new Date(game.startTime).getTime();
    if (Number.isFinite(startTime) && startTime >= activityCutoff && game.sportKey === "esports") {
      counts[game.sportCode] = (counts[game.sportCode] ?? 0) + 1;
    }
    return counts;
  }, {});
  const unavailableSportGroups = [...new Set(
    SPORTS.filter(
      (sport) =>
        sport.enabled &&
        sport.sourceSupported === false &&
        !process.env.ODDSPAPI_API_KEY,
    ).map((sport) => sport.sportGroup),
  )];
  const upcomingGames = games
    .filter((game) => {
      const startTime = new Date(game.startTime).getTime();
      const supportedLeague = !isEsportsSport(game.sportCode) || isMajorEsportsLeague(game.sportCode, game.league);
      return supportedLeague && game.status === "scheduled" && Number.isFinite(startTime) && startTime >= now;
    })
    .sort((first, second) => new Date(first.startTime).getTime() - new Date(second.startTime).getTime());
  return (
    <DashboardShell
      title={t("games.title")}
      eyebrow="Games and odds"
      description={t("games.description")}
    >
      <AdSlot placement="games_top" />
      <GameOddsBoard games={upcomingGames} recentSportCounts={recentSportCounts} recentGameCounts={recentGameCounts} recentLeagueCounts={recentLeagueCounts} activityDays={SEASON_ACTIVITY_DAYS} unavailableSportGroups={unavailableSportGroups} />
    </DashboardShell>
  );
}
