const ODDS_API_BASE_URL = "https://api.the-odds-api.com/v4";
const REQUEST_DELAY_MS = 500;
export const LOOKAHEAD_HOURS = 72;

export const SPORTS = [
  { key: "soccer_epl", label: "Premier League", sportGroup: "soccer", enabled: true },
  { key: "soccer_uefa_champs_league", label: "UEFA Champions League", sportGroup: "soccer", enabled: true },
  { key: "soccer_spain_la_liga", label: "La Liga", sportGroup: "soccer", enabled: true },
  { key: "basketball_nba", label: "NBA", sportGroup: "basketball", enabled: true },
  { key: "baseball_mlb", label: "MLB", sportGroup: "baseball", enabled: true },
  { key: "esports_lol", label: "League of Legends", sportGroup: "esports", enabled: true, sourceSupported: false },
  { key: "esports_dota2", label: "Dota 2", sportGroup: "esports", enabled: true, sourceSupported: false },
  { key: "esports_cs2", label: "Counter-Strike 2", sportGroup: "esports", enabled: true, sourceSupported: false },
  { key: "esports_valorant", label: "Valorant", sportGroup: "esports", enabled: true, sourceSupported: false },
  { key: "volleyball_fivb_world_championship", label: "FIVB World Championship", sportGroup: "volleyball", enabled: false },
  { key: "icehockey_nhl", label: "NHL", sportGroup: "hockey", enabled: false },
  { key: "americanfootball_nfl", label: "NFL", sportGroup: "american-football", enabled: false },
];

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

function getMarket(event, key) {
  return event.bookmakers?.flatMap((bookmaker) => bookmaker.markets ?? []).find((market) => market.key === key);
}

function getOdds(event) {
  const h2hOutcomes = getMarket(event, "h2h")?.outcomes ?? [];
  const spreadOutcomes = getMarket(event, "spreads")?.outcomes ?? [];
  const totalOutcomes = getMarket(event, "totals")?.outcomes ?? [];
  const priceFor = (name) =>
    h2hOutcomes.find((outcome) => outcome.name === name)?.price ?? null;
  const homeSpread = spreadOutcomes.find((outcome) => outcome.name === event.home_team);
  const awaySpread = spreadOutcomes.find((outcome) => outcome.name === event.away_team);
  const over = totalOutcomes.find((outcome) => outcome.name.toLowerCase() === "over");
  const under = totalOutcomes.find((outcome) => outcome.name.toLowerCase() === "under");

  return {
    home_odds: priceFor(event.home_team),
    away_odds: priceFor(event.away_team),
    draw_odds:
      h2hOutcomes.find((outcome) => outcome.name.toLowerCase() === "draw")
        ?.price ?? null,
    home_spread_point: homeSpread?.point ?? null,
    away_spread_point: awaySpread?.point ?? null,
    home_spread_odds: homeSpread?.price ?? null,
    away_spread_odds: awaySpread?.price ?? null,
    total_point: over?.point ?? under?.point ?? null,
    over_odds: over?.price ?? null,
    under_odds: under?.price ?? null,
  };
}

async function fetchSportGames(sport, apiKey, from, to) {
  const params = new URLSearchParams({
    apiKey,
    regions: "us",
    markets: "h2h,spreads,totals",
    oddsFormat: "decimal",
    dateFormat: "iso",
    commenceTimeFrom: from.toISOString().replace(".000", ""),
    commenceTimeTo: to.toISOString().replace(".000", ""),
  });

  let response = await fetch(
    `${ODDS_API_BASE_URL}/sports/${sport.key}/odds?${params.toString()}`,
    { cache: "no-store" },
  );

  // A few esports/seasonal feeds expose h2h only. Try all requested markets first,
  // then preserve game collection with h2h when that sport rejects extras.
  if (response.status === 400 || response.status === 422) {
    const details = await response.clone().text();
    if (details.toLowerCase().includes("market")) {
      console.warn(`Odds API extra markets are unavailable for ${sport.key}; retrying h2h only`);
      params.set("markets", "h2h");
      response = await fetch(`${ODDS_API_BASE_URL}/sports/${sport.key}/odds?${params.toString()}`, { cache: "no-store" });
    }
  }

  // Some configured esports leagues are not exposed for every API plan/season.
  // Keep the switch enabled so they start collecting automatically when available.
  if (response.status === 404) {
    console.warn(`Odds API sport is currently unavailable: ${sport.key}`);
    return [];
  }

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Odds API request failed for ${sport.key} (${response.status}): ${details}`,
    );
  }

  const events = await response.json();

  return events
    .filter((event) => {
      const startTime = new Date(event.commence_time).getTime();
      return startTime >= from.getTime() && startTime <= to.getTime();
    })
    .map((event) => ({
      id: event.id,
      sport: sport.key,
      sport_label: sport.label,
      home_team: event.home_team,
      away_team: event.away_team,
      commence_time: event.commence_time,
      ...getOdds(event),
    }));
}

export async function fetchAllGames() {
  const apiKey = process.env.ODDS_API_KEY;

  if (!apiKey) {
    throw new Error("ODDS_API_KEY is not configured");
  }

  const from = new Date();
  from.setMilliseconds(0);
  const to = new Date(from.getTime() + LOOKAHEAD_HOURS * 60 * 60 * 1000);
  const games = [];
  const enabledSports = SPORTS.filter((sport) => sport.enabled && sport.sourceSupported !== false);

  for (const [index, sport] of enabledSports.entries()) {
    games.push(...(await fetchSportGames(sport, apiKey, from, to)));

    if (index < enabledSports.length - 1) {
      await delay(REQUEST_DELAY_MS);
    }
  }

  return games.sort(
    (first, second) =>
      new Date(first.commence_time).getTime() -
      new Date(second.commence_time).getTime(),
  );
}
