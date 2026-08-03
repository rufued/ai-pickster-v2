import { supabaseAdmin } from "@/lib/supabase";

const ODDS_FIELDS = [
  ["moneyline", "home", "home_odds", null],
  ["moneyline", "away", "away_odds", null],
  ["moneyline", "draw", "draw_odds", null],
  ["spread", "home", "home_spread_odds", "home_spread_point"],
  ["spread", "away", "away_spread_odds", "away_spread_point"],
  ["total", "over", "over_odds", "total_point"],
  ["total", "under", "under_odds", "total_point"],
];

function finite(value) {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isMissingTable(error) {
  return error?.code === "42P01" || /odds_movements|schema cache|does not exist/i.test(error?.message ?? "");
}

function buildMovements(games, previousById) {
  const changedAt = new Date().toISOString();
  return games.flatMap((game) => {
    const previous = previousById.get(String(game.id));
    if (!previous) return [];
    return ODDS_FIELDS.flatMap(([marketType, selection, oddsField, lineField]) => {
      const oldOdds = finite(previous[oddsField]);
      const newOdds = finite(game[oddsField]);
      if (oldOdds == null || newOdds == null || Math.abs(oldOdds - newOdds) < 0.0001) return [];
      return [{
        game_id: String(game.id),
        market_type: marketType,
        selection,
        line_value: lineField ? finite(game[lineField]) : null,
        old_odds: oldOdds,
        new_odds: newOdds,
        changed_at: changedAt,
      }];
    });
  });
}

export async function syncGamesWithOddsMovements(games) {
  if (!games.length) return { upserted: 0, movements: 0, tracking: true };
  if (!supabaseAdmin) throw new Error("Supabase admin client is unavailable");

  const ids = games.map((game) => String(game.id));
  const { data: previousGames, error: previousError } = await supabaseAdmin
    .from("games")
    .select("id,home_odds,away_odds,draw_odds,home_spread_point,away_spread_point,home_spread_odds,away_spread_odds,total_point,over_odds,under_odds")
    .in("id", ids);
  if (previousError && !/schema cache/i.test(previousError.message ?? "")) throw previousError;

  const previousById = new Map((previousGames ?? []).map((game) => [String(game.id), game]));
  const movements = buildMovements(games, previousById);

  let { error } = await supabaseAdmin.from("games").upsert(games, { onConflict: "id" });
  if (error?.message?.includes("schema cache")) {
    const legacyGames = games.map(({ home_spread_point, away_spread_point, home_spread_odds, away_spread_odds, total_point, over_odds, under_odds, ...game }) => {
      void home_spread_point; void away_spread_point; void home_spread_odds; void away_spread_odds;
      void total_point; void over_odds; void under_odds;
      return game;
    });
    ({ error } = await supabaseAdmin.from("games").upsert(legacyGames, { onConflict: "id" }));
  }
  if (error) throw error;

  if (!movements.length) return { upserted: games.length, movements: 0, tracking: true };
  const { error: movementError } = await supabaseAdmin.from("odds_movements").insert(movements);
  if (movementError && !isMissingTable(movementError)) throw movementError;
  return { upserted: games.length, movements: movementError ? 0 : movements.length, tracking: !movementError };
}
