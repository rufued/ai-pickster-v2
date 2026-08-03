import "server-only";

import { createClient } from "@supabase/supabase-js";

export type SearchGame = {
  id: string;
  sportLabel: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  status: string;
  homeOdds?: number;
  awayOdds?: number;
  drawOdds?: number;
};

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase server environment variables are not configured");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function searchGames(query: string): Promise<SearchGame[]> {
  const supabase = client();
  const aliases: Record<string, string[]> = {
    epl: ["Premier League"],
    ucl: ["UEFA Champions League"],
    "champions league": ["UEFA Champions League"],
    laliga: ["La Liga"],
  };
  const terms = aliases[query.toLocaleLowerCase()] ?? [query];
  const columns = "id,sport_label,home_team,away_team,commence_time,status,home_odds,away_odds,draw_odds";
  const searches = terms.flatMap((term) => ["home_team", "away_team", "sport_label"].map((column) =>
    supabase.from("games").select(columns).ilike(column, `%${term}%`).order("commence_time", { ascending: false }).limit(30),
  ));
  const results = await Promise.all(searches);
  const error = results.find((result) => result.error)?.error;
  if (error) throw new Error(`Search failed: ${error.message}`);

  const rows = new Map<string, Record<string, unknown>>();
  for (const result of results) for (const row of result.data ?? []) rows.set(String(row.id), row);
  const now = Date.now();
  return [...rows.values()]
    .sort((first, second) => {
      const firstTime = new Date(String(first.commence_time)).getTime();
      const secondTime = new Date(String(second.commence_time)).getTime();
      const firstUpcoming = firstTime >= now;
      const secondUpcoming = secondTime >= now;
      if (firstUpcoming !== secondUpcoming) return firstUpcoming ? -1 : 1;
      return firstUpcoming ? firstTime - secondTime : secondTime - firstTime;
    })
    .slice(0, 30)
    .map((row) => ({
      id: String(row.id),
      sportLabel: String(row.sport_label ?? ""),
      homeTeam: String(row.home_team ?? ""),
      awayTeam: String(row.away_team ?? ""),
      commenceTime: String(row.commence_time ?? ""),
      status: String(row.status ?? "upcoming"),
      ...(row.home_odds == null ? {} : { homeOdds: Number(row.home_odds) }),
      ...(row.away_odds == null ? {} : { awayOdds: Number(row.away_odds) }),
      ...(row.draw_odds == null ? {} : { drawOdds: Number(row.draw_odds) }),
    }));
}
