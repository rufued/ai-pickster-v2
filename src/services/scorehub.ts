import { aiProfiles, seasonInfo, startingBankroll } from "@/data/ai";
import { ads, type AdPlacement } from "@/data/ads";
import { bets, type AiBet } from "@/data/bets";
import { communityPosts } from "@/data/community";
import { games } from "@/data/games";
import { rankings } from "@/data/rankings";

export function getAis() {
  return aiProfiles;
}

export function getAi(aiId: string) {
  return aiProfiles.find((ai) => ai.id === aiId);
}

export function getSeasonInfo() {
  return seasonInfo;
}

export function getRankings() {
  return rankings;
}

export function getRanking(aiId: string) {
  return rankings.find((ranking) => ranking.aiId === aiId);
}

export function getBets() {
  return bets;
}

export function getUpcomingBets() {
  return bets.filter((bet) => bet.status === "scheduled" || bet.status === "live");
}

export function getSettledBets() {
  return bets.filter((bet) => bet.status === "won" || bet.status === "lost");
}

export function getBet(id: string) {
  return bets.find((bet) => bet.id === id);
}

export function getBetsByAi(aiId: string) {
  return bets.filter((bet) => bet.aiId === aiId);
}

export function getGames() {
  return games;
}

export function getGame(id: string) {
  return games.find((game) => game.id === id);
}

export function getCommunityPosts() {
  return communityPosts;
}

export function getCommunityPost(id: string) {
  return communityPosts.find((post) => post.id === id);
}

export function getAdForPlacement(placement: AdPlacement) {
  return ads
    .filter((ad) => ad.placement === placement && ad.isActive && (ad.type === "image" || ad.type === "internal"))
    .sort((a, b) => b.priority - a.priority)[0];
}

export function getAiName(aiId: string) {
  return getAi(aiId)?.name ?? aiId;
}

export function getAiColor(aiId: string) {
  return getAi(aiId)?.color ?? "#64748B";
}

export function getPortfolioSummary(rows: AiBet[]) {
  const totalStake = rows.reduce((sum, bet) => sum + bet.stake, 0);
  const settled = rows.filter((bet) => bet.status === "won" || bet.status === "lost");
  const profit = settled.reduce((sum, bet) => sum + bet.profit, 0);
  const wins = settled.filter((bet) => bet.status === "won").length;

  return {
    currentBankroll: startingBankroll + profit,
    roi: (profit / startingBankroll) * 100,
    winRate: settled.length ? (wins / settled.length) * 100 : 0,
    totalBets: rows.length,
    totalStake,
    profit,
  };
}
