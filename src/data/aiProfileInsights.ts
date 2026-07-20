import type { AiId } from "./ai";

export type ProfileResult = {
  id: string;
  date: string;
  sport: string;
  league: string;
  matchup: string;
  pick: string;
  odds: number;
  result: "won" | "lost";
  profit: number;
};

export type AiProfileInsight = {
  aiId: AiId;
  persona: string;
  bio: string;
  motto: string;
  traits: string[];
  currentStreak: number;
  bestStreak: number;
  primarySport: string;
  strongLeagues: Array<{ name: string; hitRate: number; picks: number }>;
  weakLeagues: Array<{ name: string; hitRate: number; picks: number }>;
  recentHitRate: number;
  last20: ProfileResult[];
};

const models: Record<AiId, Omit<AiProfileInsight, "aiId" | "last20"> & { pattern: string; sports: string[]; leagues: string[] }> = {
  gpt: { persona: "원칙을 지키는 전략가", bio: "데이터의 일관성과 리스크 관리에 집중합니다. 확실한 근거가 없는 경기는 과감히 건너뜁니다.", motto: "오래 살아남는 선택이 좋은 선택이다.", traits: ["저변동", "데이터 중심", "리스크 관리"], currentStreak: 3, bestStreak: 7, primarySport: "야구", strongLeagues: [{ name: "KBO", hitRate: 68.4, picks: 19 }, { name: "MLB", hitRate: 64.7, picks: 17 }], weakLeagues: [{ name: "NBA", hitRate: 44.4, picks: 9 }, { name: "LCK", hitRate: 42.9, picks: 7 }], recentHitRate: 65, pattern: "WWLWWWLWLWWWLWWLWLWW", sports: ["야구", "축구", "농구"], leagues: ["KBO", "MLB", "K League 1"] },
  gemini: { persona: "균형을 설계하는 올라운더", bio: "시장 가격과 팀 흐름을 함께 읽습니다. 여러 종목을 고르게 탐색해 안정적인 기회를 찾습니다.", motto: "균형 속에 가장 선명한 기회가 있다.", traits: ["균형형", "멀티 스포츠", "시장 감지"], currentStreak: 4, bestStreak: 8, primarySport: "농구", strongLeagues: [{ name: "NBA", hitRate: 71.4, picks: 21 }, { name: "KBO", hitRate: 66.7, picks: 15 }], weakLeagues: [{ name: "K League 1", hitRate: 46.2, picks: 13 }, { name: "NHL", hitRate: 42.9, picks: 7 }], recentHitRate: 70, pattern: "WLWWLWWWLWWLWWLWWWWW", sports: ["농구", "야구", "e스포츠"], leagues: ["NBA", "KBO", "LCK"] },
  claude: { persona: "근거를 끝까지 확인하는 분석가", bio: "픽의 수보다 근거의 품질을 우선합니다. 라인업과 경기 맥락이 명확할 때만 움직입니다.", motto: "모르는 경기는 선택하지 않는다.", traits: ["신중형", "맥락 분석", "선별 집중"], currentStreak: 2, bestStreak: 6, primarySport: "축구", strongLeagues: [{ name: "K League 1", hitRate: 69.2, picks: 13 }, { name: "EPL", hitRate: 63.6, picks: 11 }], weakLeagues: [{ name: "MLB", hitRate: 45.5, picks: 11 }, { name: "NBA", hitRate: 40, picks: 5 }], recentHitRate: 60, pattern: "WWLLWLWWLWLWWWLLWLWW", sports: ["축구", "e스포츠", "야구"], leagues: ["K League 1", "EPL", "LCK"] },
  deepseek: { persona: "큰 기회를 노리는 승부사", bio: "저평가된 언더독과 높은 기대수익을 빠르게 포착합니다. 변동성을 감수하고 상승 여력을 추구합니다.", motto: "위험 속에 가격이 잘못된 기회가 있다.", traits: ["공격형", "언더독", "고변동"], currentStreak: 0, bestStreak: 5, primarySport: "농구", strongLeagues: [{ name: "NBA", hitRate: 61.5, picks: 13 }, { name: "MLB", hitRate: 57.1, picks: 14 }], weakLeagues: [{ name: "KBO", hitRate: 38.5, picks: 13 }, { name: "K League 1", hitRate: 36.4, picks: 11 }], recentHitRate: 45, pattern: "LWLWLLWWLLWLWLWWLWLL", sports: ["농구", "야구", "축구"], leagues: ["NBA", "MLB", "KBO"] },
  grok: { persona: "대중의 반대를 보는 역발상가", bio: "쏠림이 과한 시장에서 반대편 가치를 찾습니다. 예상 밖의 경기 흐름을 가장 먼저 의심합니다.", motto: "모두가 같은 곳을 볼 때 반대편을 본다.", traits: ["역발상", "가치 탐색", "언더독"], currentStreak: 1, bestStreak: 5, primarySport: "e스포츠", strongLeagues: [{ name: "LCK", hitRate: 64.3, picks: 14 }, { name: "MLB", hitRate: 58.3, picks: 12 }], weakLeagues: [{ name: "NBA", hitRate: 41.7, picks: 12 }, { name: "KBO", hitRate: 40, picks: 10 }], recentHitRate: 50, pattern: "LWWLWLWLLWWLLWLWLWLW", sports: ["e스포츠", "야구", "축구"], leagues: ["LCK", "MLB", "K League 1"] },
};

const teams = [["LG Twins", "KIA Tigers"], ["LA Dodgers", "San Diego Padres"], ["FC Seoul", "Jeonbuk Hyundai"], ["T1", "Gen.G"], ["Lakers", "Warriors"]];

export const aiProfileInsights: AiProfileInsight[] = Object.entries(models).map(([aiId, model], modelIndex) => ({
  aiId: aiId as AiId,
  persona: model.persona,
  bio: model.bio,
  motto: model.motto,
  traits: model.traits,
  currentStreak: model.currentStreak,
  bestStreak: model.bestStreak,
  primarySport: model.primarySport,
  strongLeagues: model.strongLeagues,
  weakLeagues: model.weakLeagues,
  recentHitRate: model.recentHitRate,
  last20: model.pattern.slice(-20).split("").reverse().map((value, index) => {
    const won = value === "W";
    const team = teams[(index + modelIndex) % teams.length];
    return {
      id: `${aiId}-${index + 1}`,
      date: `07.${String(20 - index).padStart(2, "0")}`,
      sport: model.sports[index % model.sports.length],
      league: model.leagues[index % model.leagues.length],
      matchup: `${team[0]} vs ${team[1]}`,
      pick: index % 3 === 0 ? `${team[0]} 승` : index % 3 === 1 ? "Under 2.5" : `${team[1]} +1.5`,
      odds: 1.62 + ((index * 13 + modelIndex * 7) % 58) / 100,
      result: won ? "won" : "lost",
      profit: won ? 1800 + ((index * 371) % 2300) : -(1600 + ((index * 283) % 1900)),
    };
  }),
}));

export function getAiProfileInsight(aiId: string) {
  return aiProfileInsights.find((profile) => profile.aiId === aiId);
}
