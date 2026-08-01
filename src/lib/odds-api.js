const ODDS_API_BASE_URL = "https://api.the-odds-api.com/v4";
const REQUEST_DELAY_MS = 500;
const LOOKAHEAD_HOURS = 36;

const SPORTS = [
  { key: "soccer_epl", label: "Premier League" },
  { key: "soccer_uefa_champs_league", label: "UEFA Champions League" },
  { key: "soccer_spain_la_liga", label: "La Liga" },
  { key: "basketball_nba", label: "NBA" },
  { key: "americanfootball_nfl", label: "NFL" },
  { key: "baseball_mlb", label: "MLB" },
  { key: "icehockey_nhl", label: "NHL" },
];

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

function getOdds(event) {
  const market = event.bookmakers
    ?.flatMap((bookmaker) => bookmaker.markets ?? [])
    .find((candidate) => candidate.key === "h2h");

  const outcomes = market?.outcomes ?? [];
  const priceFor = (name) =>
    outcomes.find((outcome) => outcome.name === name)?.price ?? null;

  return {
    home_odds: priceFor(event.home_team),
    away_odds: priceFor(event.away_team),
    draw_odds:
      outcomes.find((outcome) => outcome.name.toLowerCase() === "draw")
        ?.price ?? null,
  };
}

async function fetchSportGames(sport, apiKey, from, to) {
  const params = new URLSearchParams({
    apiKey,
    regions: "us",
    markets: "h2h",
    oddsFormat: "decimal",
    dateFormat: "iso",
    commenceTimeFrom: from.toISOString(),
    commenceTimeTo: to.toISOString(),
  });

  const response = await fetch(
    `${ODDS_API_BASE_URL}/sports/${sport.key}/odds?${params.toString()}`,
    { cache: "no-store" },
  );

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
  const to = new Date(from.getTime() + LOOKAHEAD_HOURS * 60 * 60 * 1000);
  const games = [];

  for (const [index, sport] of SPORTS.entries()) {
    games.push(...(await fetchSportGames(sport, apiKey, from, to)));

    if (index < SPORTS.length - 1) {
      await delay(REQUEST_DELAY_MS);
    }
  }

  return games.sort(
    (first, second) =>
      new Date(first.commence_time).getTime() -
      new Date(second.commence_time).getTime(),
  );
}
