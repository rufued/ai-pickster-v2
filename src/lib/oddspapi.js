const API_BASE_URL = "https://api.oddspapi.io/v4";
const BOOKMAKER_PRIORITY = ["pinnacle", "bet365", "betfair", "ggbet", "thunderpick", "betway"];
export const ODDSPAPI_LOOKAHEAD_HOURS = 72;
export const ODDSPAPI_ESPORTS = [
  { key: "esports_lol", label: "League of Legends", aliases: ["leagueoflegends"] },
  { key: "esports_dota2", label: "Dota 2", aliases: ["dota2", "dota"] },
  { key: "esports_cs2", label: "Counter-Strike 2", aliases: ["counterstrike2", "counterstrike", "csgo"] },
  { key: "esports_valorant", label: "Valorant", aliases: ["valorant"] },
];

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

function matchSport(sports, config) {
  return sports.find((item) => {
    const value = normalize(`${item.slug} ${item.sportName}`);
    return config.aliases.some((alias) => value.includes(alias));
  });
}

export async function getOddsPapiEsportsSports() {
  const sports = asArray(await request("/sports", { language: "en" }));
  return ODDSPAPI_ESPORTS.map((config) => ({ config, sport: matchSport(sports, config) ?? null }));
}

export async function getLolSport() {
  const entry = (await getOddsPapiEsportsSports()).find(({ config }) => config.key === "esports_lol");
  if (!entry?.sport) throw new Error("OddsPapi did not return a League of Legends sport");
  return entry.sport;
}

function activeTournaments(tournaments) {
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

function chunks(items, size) {
  const result = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
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
  const bookmakers = Object.values(fixture.bookmakerOdds ?? {})
    .filter((bookmaker) => bookmaker.bookmakerIsActive !== false && bookmaker.suspended !== true)
    .sort((first, second) => bookmakerRank(first) - bookmakerRank(second));
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

function bookmakerRank(bookmaker) {
  const value = normalize(`${bookmaker.bookmakerSlug ?? ""} ${bookmaker.bookmakerName ?? ""}`);
  const index = BOOKMAKER_PRIORITY.findIndex((name) => value.includes(normalize(name)));
  return index === -1 ? BOOKMAKER_PRIORITY.length : index;
}

function bookmakerSlug(bookmaker) {
  return bookmaker.slug ?? bookmaker.bookmakerSlug ?? bookmaker.bookmakerKey ?? bookmaker.key ?? null;
}

function preferredBookmakers(bookmakers) {
  const available = bookmakers.map(bookmakerSlug).filter(Boolean);
  const selected = BOOKMAKER_PRIORITY.flatMap((preferred) =>
    available.filter((slug) => normalize(slug).includes(normalize(preferred))),
  );
  return [...new Set([process.env.ODDSPAPI_BOOKMAKER, ...selected, "pinnacle"].filter(Boolean))].slice(0, 6);
}

function mergeOddsFixtures(fixtures) {
  const merged = new Map();
  for (const fixture of fixtures) {
    const key = String(fixture.fixtureId);
    const current = merged.get(key);
    merged.set(key, current ? { ...current, ...fixture, bookmakerOdds: { ...(current.bookmakerOdds ?? {}), ...(fixture.bookmakerOdds ?? {}) } } : fixture);
  }
  return [...merged.values()];
}

export async function fetchOddsPapiEsportsGames() {
  const discovered = await getOddsPapiEsportsSports();
  const supported = discovered.filter((entry) => entry.sport);
  const tournamentSets = [];
  const from = new Date();
  const to = new Date(from.getTime() + ODDSPAPI_LOOKAHEAD_HOURS * 60 * 60 * 1000);

  for (const [index, entry] of supported.entries()) {
    if (index > 0) await delay(1100);
    const tournaments = asArray(await request("/tournaments", { sportId: String(entry.sport.sportId), language: "en" }));
    const active = activeTournaments(tournaments);
    tournamentSets.push({ ...entry, tournaments, active });
  }

  const [marketsResponse, bookmakersResponse] = await Promise.all([
    request("/markets", { language: "en" }),
    request("/bookmakers", { language: "en" }),
  ]);
  const allMarkets = asArray(marketsResponse);
  const bookmakers = preferredBookmakers(asArray(bookmakersResponse));
  const games = [];
  const diagnostics = [];
  let oddsRequestIndex = 0;
  let fixtureRequestIndex = 0;

  for (const entry of tournamentSets) {
    if (fixtureRequestIndex > 0) await delay(2100);
    fixtureRequestIndex += 1;
    const scheduledFixtures = asArray(await request("/fixtures", {
      sportId: String(entry.sport.sportId),
      from: from.toISOString().replace(".000", ""),
      to: to.toISOString().replace(".000", ""),
      statusId: "0",
      language: "en",
    })).filter((fixture) => {
      const start = new Date(fixture.startTime).getTime();
      return start >= from.getTime() && start <= to.getTime();
    });
    const relevantTournamentIds = [...new Set(scheduledFixtures.map((fixture) => fixture.tournamentId).filter(Boolean))];
    const tournamentBatches = chunks(relevantTournamentIds, 5);
    const oddsFixtures = [];
    let emptyOddsBatches = 0;
    for (const batch of tournamentBatches) {
      const targetIds = new Set(scheduledFixtures.filter((fixture) => batch.includes(fixture.tournamentId)).map((fixture) => String(fixture.fixtureId)));
      const foundIds = new Set();
      for (const bookmaker of bookmakers) {
        if (oddsRequestIndex > 0) await delay(1100);
        oddsRequestIndex += 1;
        try {
          const response = await request("/odds-by-tournaments", {
            tournamentIds: batch.join(","),
            bookmaker,
            language: "en",
            verbosity: "3",
            oddsFormat: "decimal",
          });
          const fixtures = asArray(response);
          oddsFixtures.push(...fixtures);
          for (const fixture of fixtures) if (targetIds.has(String(fixture.fixtureId))) foundIds.add(String(fixture.fixtureId));
          if ([...targetIds].every((id) => foundIds.has(id))) break;
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          if (message.includes("(404)") && message.includes("FIXTURE_NOT_FOUND")) emptyOddsBatches += 1;
          else throw error;
        }
      }
    }
    const mergedOddsFixtures = mergeOddsFixtures(oddsFixtures);
    const markets = allMarkets.filter((market) => Number(market.sportId) === Number(entry.sport.sportId));
    const oddsByFixtureId = new Map(mergedOddsFixtures.map((fixture) => [String(fixture.fixtureId), fixture]));
    const sportGames = scheduledFixtures.map((fixture) => {
      const oddsFixture = oddsByFixtureId.get(String(fixture.fixtureId));
      return {
      id: `oddspapi:${fixture.fixtureId}`,
      sport: entry.config.key,
      sport_label: fixture.tournamentName || entry.config.label,
      home_team: fixture.participant1Name,
      away_team: fixture.participant2Name,
      commence_time: fixture.startTime,
      ...(oddsFixture ? parseOdds(oddsFixture, markets) : parseOdds({}, markets)),
      };
    }).filter((game) => game.home_team && game.away_team);
    games.push(...sportGames);
    const gamesWithOdds = sportGames.filter((game) => game.home_odds && game.away_odds).length;
    diagnostics.push({
      key: entry.config.key,
      label: entry.config.label,
      sport: { sportId: entry.sport.sportId, slug: entry.sport.slug, sportName: entry.sport.sportName },
      supported_tournaments: entry.tournaments.map(tournamentSummary),
      active_tournaments: entry.active.map(tournamentSummary),
      scheduled_fixtures: scheduledFixtures.map((fixture) => ({ fixtureId: fixture.fixtureId, tournamentId: fixture.tournamentId, tournamentName: fixture.tournamentName, homeTeam: fixture.participant1Name, awayTeam: fixture.participant2Name, startTime: fixture.startTime, hasOdds: fixture.hasOdds })),
      fixtures_with_odds: mergedOddsFixtures.length,
      games_in_window: sportGames.length,
      games_with_parsed_odds: gamesWithOdds,
      schedule_only_games: sportGames.length - gamesWithOdds,
      odds_request_batches: tournamentBatches.length,
      empty_odds_batches: emptyOddsBatches,
    });
  }

  return {
    games: games.sort((a, b) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime()),
    diagnostics: {
      sports: ODDSPAPI_ESPORTS.map((config) => {
        const entry = discovered.find((item) => item.config.key === config.key);
        return { key: config.key, label: config.label, supported: Boolean(entry?.sport), sport: entry?.sport ?? null };
      }),
      feeds: diagnostics,
      games_in_window: games.length,
      api_requests: 3 + supported.length + fixtureRequestIndex + oddsRequestIndex,
      bookmakers,
    },
  };
}

export const fetchOddsPapiLolGames = fetchOddsPapiEsportsGames;

export async function fetchOddsPapiCompletedGames(pendingGames) {
  if (!pendingGames.length) return { games: [], requests: 0 };
  const discovered = await getOddsPapiEsportsSports();
  const bySport = new Map();
  for (const game of pendingGames) bySport.set(game.sport, [...(bySport.get(game.sport) ?? []), game]);
  const from = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().replace(".000", "");
  const to = new Date().toISOString().replace(".000", "");
  const games = [];
  let requests = 1;
  let fixtureRequestIndex = 0;
  let scoreRequestIndex = 0;

  for (const [sportKey, sportGames] of bySport) {
    const sport = discovered.find((entry) => entry.config.key === sportKey)?.sport;
    if (!sport) continue;
    if (fixtureRequestIndex > 0) await delay(1100);
    fixtureRequestIndex += 1;
    requests += 1;
    const fixtures = asArray(await request("/fixtures", { sportId: String(sport.sportId), from, to, statusId: "2", language: "en" }));
    const pendingIds = new Set(sportGames.map((game) => String(game.id).replace(/^oddspapi:/, "")));
    const completed = fixtures.filter((fixture) => pendingIds.has(String(fixture.fixtureId)));
    for (const fixture of completed) {
      if (scoreRequestIndex > 0) await delay(1100);
      scoreRequestIndex += 1;
      requests += 1;
      const scoreResponse = await request("/scores", { fixtureId: fixture.fixtureId });
      const fullTime = scoreResponse?.scores?.["0"];
      const homeScore = Number(fullTime?.participant1Score);
      const awayScore = Number(fullTime?.participant2Score);
      if (!Number.isFinite(homeScore) || !Number.isFinite(awayScore)) continue;
      games.push({ id: `oddspapi:${fixture.fixtureId}`, home_score: homeScore, away_score: awayScore });
    }
  }
  return { games, requests };
}
