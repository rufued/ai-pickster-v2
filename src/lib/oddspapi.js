const API_BASE_URL = "https://api.oddspapi.io/v4";
const DEFAULT_BOOKMAKER = "pinnacle";
export const ODDSPAPI_LOOKAHEAD_HOURS = 72;

function requireApiKey() {
  const apiKey = process.env.ODDSPAPI_API_KEY;
  if (!apiKey) throw new Error("ODDSPAPI_API_KEY is not configured");
  return apiKey;
}

async function request(path, parameters = {}) {
  const params = new URLSearchParams({ ...parameters, apiKey: requireApiKey() });
  const response = await fetch(`${API_BASE_URL}${path}?${params}`, { cache: "no-store" });
  if (!response.ok) {
    const details = await response.text();
    throw new Error(`OddsPapi request failed for ${path} (${response.status}): ${details}`);
  }
  return response.json();
}

function normalize(value) {
  return String(value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object" && Array.isArray(value.data)) return value.data;
  return value && typeof value === "object" && value.fixtureId ? [value] : [];
}

export async function getLolSport() {
  const sports = asArray(await request("/sports", { language: "en" }));
  const sport = sports.find((item) => {
    const values = [item.slug, item.sportName].map(normalize);
    return values.some((value) => value === "lol" || value.includes("leagueoflegends"));
  });
  if (!sport) throw new Error("OddsPapi did not return a League of Legends sport");
  return sport;
}

function activeLolTournaments(tournaments) {
  return tournaments.filter((item) =>
    Number(item.futureFixtures ?? 0) + Number(item.upcomingFixtures ?? 0) + Number(item.liveFixtures ?? 0) > 0,
  );
}

function tournamentSummary(item) {
  return {
    tournamentId: item.tournamentId,
    tournamentName: item.tournamentName,
    tournamentSlug: item.tournamentSlug,
  };
}

function marketMetadata(markets) {
  return new Map(markets.map((market) => [String(market.marketId), market]));
}

function playersFor(market, metadata) {
  const outcomeNames = new Map((metadata?.outcomes ?? []).map((outcome) => [String(outcome.outcomeId), outcome.outcomeName]));
  return Object.entries(market?.outcomes ?? {}).flatMap(([outcomeId, outcome]) =>
    Object.values(outcome?.players ?? {}).map((player) => ({
      ...player,
      outcomeId,
      outcomeName: outcomeNames.get(outcomeId) ?? "",
      semantic: `${player.bookmakerOutcomeId ?? ""} ${outcomeNames.get(outcomeId) ?? ""}`.toLowerCase(),
    })),
  ).filter((player) => player.active !== false && Number.isFinite(Number(player.price)));
}

function marketKind(metadata) {
  const type = normalize(metadata?.marketType);
  const name = normalize(metadata?.marketName);
  if (type.includes("total") || name.includes("overunder") || name.includes("total")) return "total";
  if (type.includes("spread") || type.includes("handicap") || name.includes("spread") || name.includes("handicap")) return "spread";
  if (["1x2", "moneyline", "winner", "matchwinner"].includes(type) || name.includes("matchwinner") || name.includes("fulltimeresult") || name.includes("moneyline")) return "moneyline";
  return null;
}

function sideFor(player) {
  const value = normalize(player.semantic);
  const tokens = String(player.semantic ?? "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  if (value.includes("home") || tokens.includes("1")) return "home";
  if (value.includes("away") || tokens.includes("2")) return "away";
  if (value.includes("draw") || value === "x") return "draw";
  if (value.includes("over")) return "over";
  if (value.includes("under")) return "under";
  return null;
}

function lineFor(player, metadata) {
  const match = String(player.bookmakerOutcomeId ?? "").match(/[+-]?\d+(?:\.\d+)?/);
  if (match) return Number(match[0]);
  const handicap = Number(metadata?.handicap);
  return Number.isFinite(handicap) ? handicap : null;
}

function bestPlayer(players, side) {
  return players
    .filter((player) => sideFor(player) === side)
    .sort((a, b) => Number(b.mainLine === true) - Number(a.mainLine === true) || Number(b.limit ?? 0) - Number(a.limit ?? 0))[0];
}

function parseOdds(fixture, markets) {
  const metadataById = marketMetadata(markets);
  const bookmakers = Object.values(fixture.bookmakerOdds ?? {}).filter((bookmaker) => bookmaker.bookmakerIsActive !== false && bookmaker.suspended !== true);
  const parsed = { home_odds: null, away_odds: null, draw_odds: null, home_spread_point: null, away_spread_point: null, home_spread_odds: null, away_spread_odds: null, total_point: null, over_odds: null, under_odds: null };

  for (const bookmaker of bookmakers) {
    for (const [marketId, market] of Object.entries(bookmaker.markets ?? {})) {
      if (market.marketActive === false) continue;
      const metadata = metadataById.get(String(marketId));
      const kind = marketKind(metadata);
      if (!kind) continue;
      const players = playersFor(market, metadata);
      if (kind === "moneyline" && parsed.home_odds == null) {
        parsed.home_odds = Number(bestPlayer(players, "home")?.price) || null;
        parsed.away_odds = Number(bestPlayer(players, "away")?.price) || null;
        parsed.draw_odds = Number(bestPlayer(players, "draw")?.price) || null;
      } else if (kind === "spread" && parsed.home_spread_odds == null) {
        const home = bestPlayer(players, "home");
        const away = bestPlayer(players, "away");
        if (home && away) {
          parsed.home_spread_point = lineFor(home, metadata);
          parsed.away_spread_point = lineFor(away, metadata);
          parsed.home_spread_odds = Number(home.price);
          parsed.away_spread_odds = Number(away.price);
        }
      } else if (kind === "total" && parsed.over_odds == null) {
        const over = bestPlayer(players, "over");
        const under = bestPlayer(players, "under");
        if (over && under) {
          parsed.total_point = lineFor(over, metadata) ?? lineFor(under, metadata);
          parsed.over_odds = Number(over.price);
          parsed.under_odds = Number(under.price);
        }
      }
    }
  }
  return parsed;
}

export async function fetchOddsPapiLolGames() {
  const sport = await getLolSport();
  const tournaments = asArray(await request("/tournaments", { sportId: String(sport.sportId), language: "en" }));
  const selected = activeLolTournaments(tournaments);
  if (!selected.length) return {
    games: [],
    diagnostics: {
      sport,
      supported_tournaments: tournaments.map(tournamentSummary),
      active_tournaments: [],
      reason: "no_active_lol_tournaments",
    },
  };

  const [marketsResponse, oddsResponse] = await Promise.all([
    request("/markets", { language: "en" }),
    request("/odds-by-tournaments", {
      tournamentIds: selected.map((item) => item.tournamentId).join(","),
      bookmakers: process.env.ODDSPAPI_BOOKMAKER || DEFAULT_BOOKMAKER,
      language: "en",
      verbosity: "3",
      oddsFormat: "decimal",
    }),
  ]);
  const markets = asArray(marketsResponse).filter((market) => Number(market.sportId) === Number(sport.sportId));
  const now = Date.now();
  const until = now + ODDSPAPI_LOOKAHEAD_HOURS * 60 * 60 * 1000;
  const games = asArray(oddsResponse).filter((fixture) => {
    const start = new Date(fixture.startTime).getTime();
    return Number(fixture.statusId) === 0 && fixture.hasOdds !== false && start >= now && start <= until;
  }).map((fixture) => ({
    id: `oddspapi:${fixture.fixtureId}`,
    sport: "esports_lol",
    sport_label: fixture.tournamentName || "League of Legends",
    home_team: fixture.participant1Name,
    away_team: fixture.participant2Name,
    commence_time: fixture.startTime,
    ...parseOdds(fixture, markets),
  })).filter((game) => game.home_team && game.away_team && game.home_odds && game.away_odds);

  return {
    games,
    diagnostics: {
      sport: { sportId: sport.sportId, slug: sport.slug, sportName: sport.sportName },
      supported_tournaments: tournaments.map(tournamentSummary),
      active_tournaments: selected.map(tournamentSummary),
      fixtures_with_odds: asArray(oddsResponse).length,
      games_in_window: games.length,
      bookmaker: process.env.ODDSPAPI_BOOKMAKER || DEFAULT_BOOKMAKER,
    },
  };
}

export async function fetchOddsPapiCompletedGames(pendingGames) {
  if (!pendingGames.length) return { games: [], requests: 0 };
  const sport = await getLolSport();
  const from = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().replace(".000", "");
  const to = new Date().toISOString().replace(".000", "");
  const fixtures = asArray(await request("/fixtures", { sportId: String(sport.sportId), from, to, statusId: "2", language: "en" }));
  const pendingIds = new Set(pendingGames.map((game) => String(game.id).replace(/^oddspapi:/, "")));
  const completed = fixtures.filter((fixture) => pendingIds.has(String(fixture.fixtureId)));
  const games = [];
  for (const fixture of completed) {
    const scoreResponse = await request("/scores", { fixtureId: fixture.fixtureId });
    const fullTime = scoreResponse?.scores?.["0"];
    const homeScore = Number(fullTime?.participant1Score);
    const awayScore = Number(fullTime?.participant2Score);
    if (!Number.isFinite(homeScore) || !Number.isFinite(awayScore)) continue;
    games.push({ id: `oddspapi:${fixture.fixtureId}`, home_score: homeScore, away_score: awayScore });
  }
  return { games, requests: 2 + completed.length };
}
