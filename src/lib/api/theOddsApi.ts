import type { Match, MatchStatus, Sport } from "@/lib/types";

const fallbackMatches: Match[] = [];

const THE_ODDS_API_BASE_URL = "https://api.the-odds-api.com/v4";

type FetchUpcomingOddsOptions = {
  regions?: string;
  markets?: string;
  oddsFormat?: "american" | "decimal";
  dateFormat?: "iso" | "unix";
  fallback?: Match[];
};

type TheOddsApiEvent = {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers?: Array<{
    key: string;
    title: string;
    last_update: string;
    markets: Array<{
      key: string;
      last_update: string;
      outcomes: Array<{
        name: string;
        price: number;
        point?: number;
      }>;
    }>;
  }>;
};

export type TheOddsApiConnectionTestResult = {
  apiKeyFound: boolean;
  ok: boolean;
  status?: number;
  fallbackUsed: boolean;
  message: "API KEY FOUND" | "API KEY NOT FOUND" | "API REQUEST OK" | "API REQUEST FAILED";
};

export async function fetchUpcomingOdds(sportKey: string, options: FetchUpcomingOddsOptions = {}): Promise<Match[]> {
  const apiKey = process.env.THE_ODDS_API_KEY;

  if (!apiKey) {
    return options.fallback ?? fallbackMatches;
  }

  try {
    const params = new URLSearchParams({
      apiKey,
      regions: options.regions ?? "us",
      markets: options.markets ?? "h2h",
      oddsFormat: options.oddsFormat ?? "decimal",
      dateFormat: options.dateFormat ?? "iso",
    });
    const response = await fetch(`${THE_ODDS_API_BASE_URL}/sports/${sportKey}/odds/?${params.toString()}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return options.fallback ?? fallbackMatches;
    }

    const events = (await response.json()) as TheOddsApiEvent[];
    return events.map(normalizeTheOddsEvent);
  } catch {
    return options.fallback ?? fallbackMatches;
  }
}

export async function testTheOddsApiConnection(sportKey = "upcoming"): Promise<TheOddsApiConnectionTestResult> {
  const apiKey = process.env.THE_ODDS_API_KEY;

  if (!apiKey) {
    console.log("API KEY NOT FOUND");
    return {
      apiKeyFound: false,
      ok: false,
      fallbackUsed: true,
      message: "API KEY NOT FOUND",
    };
  }

  console.log("API KEY FOUND");

  try {
    const params = new URLSearchParams({
      apiKey,
      regions: "us",
      markets: "h2h",
      oddsFormat: "decimal",
      dateFormat: "iso",
    });
    const response = await fetch(`${THE_ODDS_API_BASE_URL}/sports/${sportKey}/odds/?${params.toString()}`, {
      next: { revalidate: 300 },
    });

    return {
      apiKeyFound: true,
      ok: response.ok,
      status: response.status,
      fallbackUsed: !response.ok,
      message: response.ok ? "API REQUEST OK" : "API REQUEST FAILED",
    };
  } catch {
    return {
      apiKeyFound: true,
      ok: false,
      fallbackUsed: true,
      message: "API REQUEST FAILED",
    };
  }
}

function normalizeTheOddsEvent(event: TheOddsApiEvent): Match {
  return {
    id: createMatchId(event),
    sport: normalizeSport(event.sport_key, event.sport_title),
    league: event.sport_title,
    homeTeam: event.home_team,
    awayTeam: event.away_team,
    startTime: event.commence_time,
    status: normalizeMatchStatus(event.commence_time),
    headline: `${event.sport_title} upcoming odds`,
    odds: normalizeOdds(event),
  };
}

function createMatchId(event: TheOddsApiEvent) {
  const startsAt = new Date(event.commence_time);
  const datePart = Number.isNaN(startsAt.getTime())
    ? "upcoming"
    : startsAt.toISOString().slice(0, 16).replace(/[-:T]/g, "");
  return `${normalizeSportPrefix(event.sport_key)}-${slugify(event.home_team)}-${slugify(event.away_team)}-${datePart}`;
}

function normalizeSportPrefix(sportKey: string) {
  if (sportKey.includes("baseball")) {
    return "mlb";
  }

  return slugify(sportKey);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeOdds(event: TheOddsApiEvent): Match["odds"] {
  const market = event.bookmakers?.[0]?.markets.find((item) => item.key === "h2h");

  if (!market) {
    return undefined;
  }

  const odds: Match["odds"] = {};

  for (const outcome of market.outcomes) {
    if (outcome.name === event.home_team) {
      odds.home = outcome.price;
    } else if (outcome.name === event.away_team) {
      odds.away = outcome.price;
    } else if (outcome.name.toLowerCase() === "draw") {
      odds.draw = outcome.price;
    }
  }

  return odds.home || odds.away || odds.draw ? odds : undefined;
}

function normalizeMatchStatus(commenceTime: string): MatchStatus {
  const startsAt = new Date(commenceTime).getTime();

  if (Number.isNaN(startsAt)) {
    return "scheduled";
  }

  return startsAt <= Date.now() ? "live" : "scheduled";
}

function normalizeSport(sportKey: string, sportTitle: string): Sport {
  const value = `${sportKey} ${sportTitle}`.toLowerCase();

  if (value.includes("soccer")) {
    return "축구";
  }

  if (value.includes("baseball") || value.includes("mlb") || value.includes("kbo")) {
    return "야구";
  }

  if (value.includes("basketball") || value.includes("nba") || value.includes("kbl")) {
    return "농구";
  }

  if (value.includes("tennis")) {
    return "테니스";
  }

  if (value.includes("mma") || value.includes("esports") || value.includes("lol") || value.includes("valorant")) {
    return "e스포츠";
  }

  if (value.includes("hockey") || value.includes("nhl")) {
    return "아이스하키";
  }

  if (value.includes("formula") || value.includes("f1")) {
    return "Formula 1";
  }

  return "축구";
}
