export const MAJOR_ESPORTS_LEAGUES = {
  esports_lol: ["LCK", "LPL", "LEC", "LCS", "LCK CL"],
  esports_dota2: ["The International", "DreamLeague", "ESL One", "PGL Wallachia", "Riyadh Masters"],
  esports_cs2: ["ESL Pro League", "BLAST Premier", "Intel Extreme Masters", "IEM", "PGL Major", "StarLadder Major"],
  esports_valorant: ["VCT", "Valorant Masters", "Valorant Champions"],
};

function normalize(value) {
  return String(value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function isMajorEsportsLeague(sport, league) {
  const allowed = MAJOR_ESPORTS_LEAGUES[sport];
  if (!allowed) return false;
  const normalizedLeague = normalize(league);
  if (sport === "esports_lol") return allowed.some((name) => normalize(name) === normalizedLeague);
  return allowed.some((name) => normalizedLeague.includes(normalize(name)));
}

export function isEsportsSport(sport) {
  return String(sport ?? "").startsWith("esports_");
}
