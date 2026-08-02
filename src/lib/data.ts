import type {
  AIDecisionProcess,
  AICompetitor,
  AIModel,
  AnalysisMatch,
  ApiCombination,
  BettingComboLeg,
  Combination,
  CommunityPost,
  FeaturedMatch,
  Match,
  Prediction,
  PredictionHistoryRecord,
} from "./types";
import { SCOREHUB } from "./brand";

const STARTING_BANKROLL = 100000;

const aiPerformanceOverrides: Record<string, { roi: number; totalBets: number }> = {
  Gemini: { roi: 12.4, totalBets: 22 },
  GPT: { roi: 6.7, totalBets: 20 },
  DeepSeek: { roi: 2.1, totalBets: 18 },
  Grok: { roi: -1.3, totalBets: 16 },
  Claude: { roi: -4.8, totalBets: 14 },
};

export const aiModels: AIModel[] = [
  { id: "gpt", name: "GPT", initials: "GP", description: "안정형, 낮은 배당 위주, 적중률 우선", color: "blue" },
  { id: "gemini", name: "Gemini", initials: "GE", description: "밸런스형, 안정성과 수익률 균형", color: "green" },
  { id: "deepseek", name: "DeepSeek", initials: "DS", description: "공격형, 고배당과 업셋 픽 선호", color: "indigo" },
  { id: "grok", name: "Grok", initials: "GR", description: "변칙형, 대중과 반대되는 픽도 선택", color: "slate" },
  { id: "claude", name: "Claude", initials: "CL", description: "신중형, 근거가 강한 경기만 선택", color: "cyan" },
];

export const matches: Match[] = [
  {
    id: "dodgers-padres",
    sport: "야구",
    league: "MLB",
    homeTeam: "LA Dodgers",
    awayTeam: "San Diego Padres",
    startTime: "2026-06-17 10:10",
    status: "scheduled",
    venue: "Dodger Stadium",
    headline: "선발 매치업과 불펜 소모가 갈리는 NL 서부 라이벌전",
    popularity: 96,
    odds: { home: 1.58, away: 2.35 },
  },
  {
    id: "lg-kia",
    sport: "야구",
    league: "KBO",
    homeTeam: "LG 트윈스",
    awayTeam: "KIA 타이거즈",
    startTime: "2026-06-17 18:30",
    status: "scheduled",
    venue: "잠실야구장",
    headline: "상위권 맞대결, LG 선발 안정감과 KIA 장타력이 충돌",
    popularity: 94,
    odds: { home: 1.72, away: 2.05 },
  },
  {
    id: "lakers-warriors",
    sport: "농구",
    league: "NBA",
    homeTeam: "LA Lakers",
    awayTeam: "Golden State Warriors",
    startTime: "2026-06-17 11:00",
    status: "scheduled",
    venue: "Crypto.com Arena",
    headline: "핸디캡 라인에서 갈리는 페이스와 3점 생산력",
    popularity: 91,
    odds: { home: 1.86, away: 1.96 },
  },
  {
    id: "seoul-jeonbuk",
    sport: "축구",
    league: "K리그1",
    homeTeam: "FC 서울",
    awayTeam: "전북 현대",
    startTime: "2026-06-17 19:00",
    status: "scheduled",
    venue: "서울월드컵경기장",
    headline: "중원 압박과 전환 속도가 승부를 가를 경기",
    popularity: 86,
    odds: { home: 2.18, draw: 3.2, away: 3.1 },
  },
  {
    id: "t1-geng",
    sport: "e스포츠",
    league: "LCK",
    homeTeam: "T1",
    awayTeam: "Gen.G",
    startTime: "2026-06-17 20:00",
    status: "scheduled",
    venue: "LoL Park",
    headline: "초반 오브젝트 운영과 밴픽 적응력이 핵심",
    popularity: 99,
    odds: { home: 2.08, away: 1.78 },
  },
  {
    id: "hanwha-lotte",
    sport: "야구",
    league: "KBO",
    homeTeam: "한화 이글스",
    awayTeam: "롯데 자이언츠",
    startTime: "2026-06-16 18:30",
    status: "final",
    homeScore: 5,
    awayScore: 4,
    venue: "대전 한화생명 볼파크",
    headline: "후반 집중력으로 갈린 접전",
    popularity: 77,
  },
  {
    id: "arsenal-chelsea",
    sport: "축구",
    league: "EPL",
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    startTime: "2026-06-16 04:00",
    status: "final",
    homeScore: 2,
    awayScore: 1,
    venue: "Emirates Stadium",
    headline: "세트피스와 압박 회피가 승패를 갈랐다",
    popularity: 88,
  },
  {
    id: "celtics-knicks",
    sport: "농구",
    league: "NBA",
    homeTeam: "Boston Celtics",
    awayTeam: "New York Knicks",
    startTime: "2026-06-15 09:30",
    status: "final",
    homeScore: 111,
    awayScore: 103,
    venue: "TD Garden",
    headline: "후반 수비 집중력 차이가 벌어진 경기",
    popularity: 84,
  },
];

const analysesByMatch: Record<string, AnalysisMatch["analyses"]> = {
  "dodgers-padres": [
    ai("GPT", "Dodgers 승", "5:3", "Under", 71, "Dodgers 선발의 이닝 소화와 홈 장타 생산력이 더 안정적입니다."),
    ai("Gemini", "Dodgers 승", "6:4", "Over", 66, "타선 흐름은 Padres도 좋지만 불펜 매치업은 Dodgers 쪽이 낫습니다."),
    ai("DeepSeek", "Padres 승", "4:5", "Over", 54, "배당 대비 Padres 업셋 기대값이 과소평가됐다고 봅니다."),
    ai("Grok", "Padres +1.5", "4:4", "Under", 59, "대중은 Dodgers 단폴에 몰려 있지만 라이벌전 변동성이 큽니다."),
    ai("Claude", "Dodgers 승", "4:2", "Under", 68, "선발, 수비, 장타 억제 지표가 같은 방향을 가리킵니다."),
  ],
  "lg-kia": [
    ai("GPT", "LG 승", "5:3", "Under", 69, "LG 선발 안정성과 홈 불펜 운영이 KIA보다 안정적입니다."),
    ai("Gemini", "LG 승", "6:4", "Over", 64, "최근 타격 페이스는 KIA가 좋지만 LG의 후반 집중력이 우세합니다."),
    ai("DeepSeek", "KIA 승", "4:6", "Over", 56, "KIA 장타 변수가 현재 배당에서 더 높은 기대값을 만듭니다."),
    ai("Grok", "KIA +1.5", "5:5", "Over", 61, "LG 쪽 대중 쏠림이 강해 핸디캡 반대편을 선택합니다."),
    ai("Claude", "LG 승", "4:2", "Under", 67, "실점 억제와 불펜 피로도에서 LG가 근소하게 앞섭니다."),
  ],
  "lakers-warriors": [
    ai("GPT", "Lakers +5.5", "108:104", "Under", 65, "핸디캡 기준 Lakers의 리바운드 우위가 방어선을 만듭니다."),
    ai("Gemini", "Warriors 승", "106:111", "Over", 62, "Warriors의 3점 볼륨과 벤치 득점이 흐름을 바꿀 수 있습니다."),
    ai("DeepSeek", "Warriors -5.5", "101:112", "Over", 55, "고변동 3점 경기에서 마진 확대 가능성을 삽니다."),
    ai("Grok", "Lakers 승", "109:107", "Under", 57, "대중 라인이 Warriors 쪽으로 밀린 뒤 홈 언더독 가치가 생겼습니다."),
    ai("Claude", "Lakers +5.5", "104:103", "Under", 64, "페이스가 낮아질수록 핸디캡 커버 확률이 올라갑니다."),
  ],
  "seoul-jeonbuk": [
    ai("GPT", "언더 2.5", "1:1", "Under", 63, "양 팀 모두 중원 압박을 우선해 초반 득점 기대값이 낮습니다."),
    ai("Gemini", "무승부", "1:1", "Under", 60, "최근 전개 속도와 결정력 모두 접전 신호가 강합니다."),
    ai("DeepSeek", "전북 승", "1:2", "Over", 53, "전북 원정 배당이 리스크 대비 높게 책정됐습니다."),
    ai("Grok", "서울 승", "2:1", "Over", 56, "전북 선호 여론과 반대로 서울의 측면 압박을 봅니다."),
    ai("Claude", "언더 2.5", "0:1", "Under", 66, "득점 루트가 제한적이고 세트피스 의존도가 높습니다."),
  ],
  "t1-geng": [
    ai("GPT", "Gen.G 승", "1:2", "Over", 62, "운영 안정성과 후반 한타 기대값은 Gen.G가 앞섭니다."),
    ai("Gemini", "Gen.G 승", "1:2", "Over", 64, "밴픽 유연성과 드래곤 운영 지표가 안정적입니다."),
    ai("DeepSeek", "T1 승", "2:1", "Over", 55, "T1의 초반 설계가 터질 경우 배당 대비 업셋 가치가 큽니다."),
    ai("Grok", "T1 승", "2:0", "Under", 58, "대중 컨센서스 반대편에서 빠른 스노우볼 가능성을 봅니다."),
    ai("Claude", "Gen.G 승", "1:2", "Over", 63, "후반 의사결정 오류율이 낮은 쪽을 선택합니다."),
  ],
  "hanwha-lotte": [
    ai("GPT", "한화 승", "5:4", "Over", 64, "후반 불펜 매치업에서 한화가 한 점을 지켜낼 가능성이 높았습니다."),
    ai("Gemini", "한화 승", "6:4", "Over", 61, "타선 흐름과 홈 어드밴티지를 같이 반영했습니다."),
    ai("DeepSeek", "롯데 승", "3:5", "Under", 52, "롯데 선발 저평가 구간을 노린 픽이었습니다."),
    ai("Grok", "롯데 +1.5", "4:4", "Under", 58, "한화 단폴 쏠림을 피해 핸디캡을 선택했습니다."),
    ai("Claude", "한화 승", "4:3", "Under", 62, "실점 분포가 낮은 경기에서 홈팀 근소 우위를 봤습니다."),
  ],
  "arsenal-chelsea": [
    ai("GPT", "Arsenal 승", "2:1", "Over", 68, "홈 압박과 세트피스 기대값이 Arsenal 쪽으로 기울었습니다."),
    ai("Gemini", "Arsenal 승", "2:1", "Over", 63, "최근 빌드업 안정성과 측면 찬스 생산량이 좋았습니다."),
    ai("DeepSeek", "Chelsea +1.5", "2:2", "Over", 57, "Chelsea 핸디캡 배당이 실제 격차보다 높았습니다."),
    ai("Grok", "무승부", "1:1", "Under", 55, "더비 특유의 템포 저하를 반영했습니다."),
    ai("Claude", "Arsenal 승", "2:0", "Under", 66, "수비 전환과 홈 득점 기대값이 안정적이었습니다."),
  ],
  "celtics-knicks": [
    ai("GPT", "Celtics 승", "111:103", "Under", 67, "홈 수비와 3점 허용 억제가 승부를 갈랐습니다."),
    ai("Gemini", "Celtics -4.5", "114:106", "Over", 62, "후반 로테이션 깊이를 믿고 마진을 선택했습니다."),
    ai("DeepSeek", "Knicks +4.5", "107:105", "Under", 54, "언더독 핸디캡 가치가 있다고 봤지만 빗나갔습니다."),
    ai("Grok", "Knicks 승", "104:108", "Under", 53, "대중 반대편 단폴을 노렸으나 실패했습니다."),
    ai("Claude", "Celtics 승", "108:101", "Under", 65, "수비 지표가 가장 강한 팀을 선택했습니다."),
  ],
};

export const analysisMatches: AnalysisMatch[] = matches.map((match) => ({
  id: match.id,
  match: `${match.homeTeam} vs ${match.awayTeam}`,
  sport: match.sport,
  league: match.league,
  startTime: match.startTime,
  headline: match.headline ?? "",
  consensusScore: getConsensusScore(analysesByMatch[match.id] ?? []),
  consensusLabel: getConsensusLabel(getConsensusScore(analysesByMatch[match.id] ?? [])),
  actualResult: match.status === "final" ? getWinnerText(match) : undefined,
  status: match.status,
  homeTeam: match.homeTeam,
  awayTeam: match.awayTeam,
  homeScore: match.homeScore,
  awayScore: match.awayScore,
  venue: match.venue,
  recentForm: ["최근 5경기 득점 흐름 안정", "주전 라인업 변동 낮음", "후반 실점 관리가 핵심"],
  headToHead: [
    { date: "2026.05.21", result: `${match.homeTeam} 우세`, note: "후반 집중력 차이" },
    { date: "2026.04.12", result: `${match.awayTeam} 우세`, note: "원정 역습 성공" },
    { date: "2026.03.08", result: "접전", note: "초반 흐름 변동" },
  ],
  standings: [
    { rank: 2, team: match.homeTeam, played: 28, points: 53, form: "W-W-L-W-D" },
    { rank: 4, team: match.awayTeam, played: 28, points: 49, form: "W-L-W-D-W" },
  ],
  analyses: analysesByMatch[match.id] ?? [],
}));

export const combinations: Combination[] = [
  combo("combo-gpt-0617-a", "GPT", "2026-06-17", "scheduled", 100, [
    leg("dodgers-padres", "승패", "Dodgers 승", 1.58, "pending", 71, "선발과 불펜 안정감 모두 Dodgers 쪽입니다."),
    leg("lg-kia", "승패", "LG 승", 1.72, "pending", 69, "홈 선발 안정성과 후반 운영을 우위로 봅니다."),
    leg("lakers-warriors", "핸디캡", "Lakers +5.5", 1.85, "pending", 65, "저득점 접전이면 핸디캡 방어력이 좋습니다."),
  ]),
  combo("combo-gpt-0616-a", "GPT", "2026-06-16", "won", 100, [
    leg("hanwha-lotte", "승패", "한화 승", 1.7, "won", 64, "홈 불펜 운영이 더 안정적이었습니다."),
    leg("arsenal-chelsea", "승패", "Arsenal 승", 1.82, "won", 68, "홈 압박과 세트피스 기대값이 높았습니다."),
  ]),
  combo("combo-gemini-0617-a", "Gemini", "2026-06-17", "scheduled", 120, [
    leg("dodgers-padres", "승패", "Dodgers 승", 1.58, "pending", 66, "선발과 타선 흐름의 균형을 선택합니다."),
    leg("lakers-warriors", "승패", "Warriors 승", 1.96, "pending", 62, "3점 볼륨과 벤치 득점 기대가 있습니다."),
    leg("t1-geng", "승패", "Gen.G 승", 1.78, "pending", 64, "운영 안정성과 밴픽 유연성이 강점입니다."),
  ]),
  combo("combo-gemini-0615-a", "Gemini", "2026-06-15", "won", 90, [
    leg("celtics-knicks", "핸디캡", "Celtics -4.5", 1.9, "won", 62, "후반 로테이션 깊이를 신뢰했습니다."),
    leg("arsenal-chelsea", "승패", "Arsenal 승", 1.82, "won", 63, "측면 찬스 생산량이 우세했습니다."),
    leg("hanwha-lotte", "승패", "한화 승", 1.7, "won", 61, "홈 어드밴티지와 타선 흐름을 반영했습니다."),
  ]),
  combo("combo-deepseek-0617-a", "DeepSeek", "2026-06-17", "scheduled", 80, [
    leg("dodgers-padres", "승패", "Padres 승", 2.35, "pending", 54, "업셋 배당이 기대값 구간에 있습니다."),
    leg("lg-kia", "승패", "KIA 승", 2.05, "pending", 56, "장타 변수가 배당 대비 과소평가됐습니다."),
    leg("lakers-warriors", "핸디캡", "Warriors -5.5", 2.08, "pending", 55, "3점 변동성이 마진 확대를 만들 수 있습니다."),
    leg("t1-geng", "승패", "T1 승", 2.08, "pending", 55, "초반 설계가 터질 경우 고배당 가치가 큽니다."),
  ]),
  combo("combo-deepseek-0616-a", "DeepSeek", "2026-06-16", "lost", 100, [
    leg("hanwha-lotte", "승패", "롯데 승", 2.12, "lost", 52, "롯데 선발 저평가를 노렸습니다."),
    leg("celtics-knicks", "핸디캡", "Knicks +4.5", 1.92, "lost", 54, "언더독 핸디캡 기대값을 봤습니다."),
  ]),
  combo("combo-grok-0617-a", "Grok", "2026-06-17", "scheduled", 70, [
    leg("lg-kia", "핸디캡", "KIA +1.5", 1.62, "pending", 61, "대중 쏠림 반대편의 안전장치입니다."),
    leg("seoul-jeonbuk", "승패", "서울 승", 2.18, "pending", 56, "전북 선호 여론과 반대로 홈 압박을 선택합니다."),
    leg("t1-geng", "승패", "T1 승", 2.08, "pending", 58, "컨센서스 반대편에서 빠른 스노우볼을 봅니다."),
  ]),
  combo("combo-grok-0615-a", "Grok", "2026-06-15", "lost", 60, [
    leg("celtics-knicks", "승패", "Knicks 승", 2.45, "lost", 53, "대중 반대편 단폴 축을 조합했습니다."),
    leg("arsenal-chelsea", "승패", "무승부", 3.25, "lost", 55, "더비 템포 저하를 노렸습니다."),
  ]),
  combo("combo-claude-0617-a", "Claude", "2026-06-17", "scheduled", 110, [
    leg("dodgers-padres", "승패", "Dodgers 승", 1.58, "pending", 68, "강한 근거가 있는 선발 매치업만 선택합니다."),
    leg("seoul-jeonbuk", "언더/오버", "언더 2.5", 1.8, "pending", 66, "득점 루트가 제한적인 경기입니다."),
  ]),
  combo("combo-claude-0616-a", "Claude", "2026-06-16", "won", 100, [
    leg("hanwha-lotte", "승패", "한화 승", 1.7, "won", 62, "실점 분포가 낮은 홈팀 근소 우위였습니다."),
    leg("arsenal-chelsea", "승패", "Arsenal 승", 1.82, "won", 66, "수비 전환과 홈 득점 기대값이 안정적이었습니다."),
    leg("celtics-knicks", "승패", "Celtics 승", 1.64, "won", 65, "수비 지표가 가장 강한 팀을 선택했습니다."),
  ]),
];

export const allCombinations = combinations;
export const historyRecords = combinations.filter((combination) => combination.status !== "scheduled" && combination.status !== "pending");

export const aiCompetitors: AICompetitor[] = aiModels.map((model) => {
  const aiCombos = combinations.filter((combination) => combination.aiName === model.name);
  const settled = aiCombos.filter((combination) => combination.status === "won" || combination.status === "lost");
  const override = aiPerformanceOverrides[model.name];
  const settledProfit = settled.reduce((sum, combination) => sum + combination.profit, 0);
  const totalProfit = override ? Math.round(STARTING_BANKROLL * (override.roi / 100)) : settledProfit;
  const wins = settled.filter((combination) => combination.status === "won").length;
  const losses = settled.filter((combination) => combination.status === "lost").length;
  const currentBankroll = STARTING_BANKROLL + totalProfit;
  const roi = (totalProfit / STARTING_BANKROLL) * 100;

  return {
    id: model.id,
    name: model.name,
    initials: model.initials,
    reliabilityGrade: model.name === "GPT" ? "A+" : model.name === "Claude" || model.name === "Gemini" ? "A" : "B+",
    startingBankroll: STARTING_BANKROLL,
    currentBankroll,
    startingBalance: STARTING_BANKROLL,
    currentBalance: currentBankroll,
    roi,
    winRate: settled.length ? (wins / settled.length) * 100 : 0,
    accuracy: settled.length ? (wins / settled.length) * 100 : 0,
    totalBets: override?.totalBets ?? aiCombos.length,
    totalPicks: model.name === "GPT" || model.name === "Gemini"
      ? aiCombos.reduce((sum, combination) => sum + combination.legs.length, 0)
      : 0,
    totalProfit,
    bettingStyle: model.description,
    performanceHistory: buildPerformanceHistory(model.name, totalProfit),
    recent30DayRoi: roi,
    recent30DayAccuracy: settled.length ? (wins / settled.length) * 100 : 0,
    recent30DayWins: wins,
    recent30DayLosses: losses,
    recent10Results: aiCombos.slice(0, 10).map((combination) => combination.status),
    recentResults: aiCombos.slice(0, 5).map((combination) => combination.status),
    recentRoiTrend: buildPerformanceHistory(model.name, totalProfit).map((point) => point.roi),
    analysisStyle: model.description,
    investmentPhilosophy: getPhilosophy(model.name),
    signatureTraits: getTraits(model.name),
    strategy: model.description,
    strategyDescription: getPhilosophy(model.name),
    bestHitCombination: getBestHit(model.name),
    bestHitOdds: Math.max(0, ...settled.filter((combination) => combination.status === "won").map((combination) => combination.totalOdds)),
    wins,
    losses,
    battleWins: wins,
    battleLosses: losses,
    sportStats: [
      { sport: "야구", accuracy: model.name === "GPT" ? 68 : 62, picks: 14 },
      { sport: "축구", accuracy: model.name === "Claude" ? 66 : 58, picks: 9 },
      { sport: "농구", accuracy: model.name === "Gemini" ? 63 : 57, picks: 8 },
    ],
  };
});

export const rankingStats = aiCompetitors;

export const predictions: Prediction[] = analysisMatches.flatMap((match) =>
  match.analyses.map((analysis) => ({
    aiName: analysis.aiName,
    matchId: match.id,
    pick: analysis.prediction,
    confidence: analysis.confidence,
    predictedScore: analysis.expectedScore,
    predictedTotal: analysis.predictedTotal,
    overUnder: analysis.overUnder,
    analysis: {
      angle: analysis.analysisAngle,
      decisionStatus: analysis.decisionStatus,
      decisionReason: analysis.decisionReason,
      summary: analysis.summary,
      strengths: analysis.strengths,
      risks: analysis.risks,
      roiChange: analysis.roiChange,
    },
  })),
);

export const predictionHistory: PredictionHistoryRecord[] = historyRecords.flatMap((combination) =>
  combination.legs.map((item, index) => ({
    id: `${combination.id}-${index + 1}`,
    date: combination.date,
    sport: item.sport,
    league: item.league,
    match: `${item.homeTeam} vs ${item.awayTeam}`,
    aiName: combination.aiName,
    prediction: item.pick,
    result: item.result === "won" ? "적중" : item.result === "lost" ? "미적중" : "대기",
    hit: item.result === "won",
    confidence: item.confidence,
  })),
);

export const featuredMatches: FeaturedMatch[] = analysisMatches.map((match) => ({
  id: match.id,
  sport: match.sport,
  league: match.league,
  match: match.match,
  startTime: match.startTime,
}));

export const decisionProcesses: AIDecisionProcess[] = aiModels.map((model) => {
  const todayCombo = combinations.find((combination) => combination.aiName === model.name && combination.status === "scheduled");

  return {
    aiName: model.name,
    reviewedMatches: 42,
    candidateMatches: 12,
    finalSelections: todayCombo?.legs.length ?? 0,
    excludedMatches: 30,
    combinationOdds: todayCombo?.totalOdds ?? 0,
  };
});

export const apiCombinations: ApiCombination[] = allCombinations.map((combination) => ({
  aiName: combination.aiName,
  combinationId: combination.id,
  date: combination.date,
  style: combination.style,
  legs: combination.legs.map((item) => ({
    matchId: item.matchId,
    pick: item.pick,
    odds: item.odds,
  })),
  odds: combination.totalOdds,
  stake: combination.stake,
  potentialProfit: combination.potentialPayout - combination.stake,
  potentialReturn: combination.potentialPayout,
  status: combination.status,
  result: combination.result,
  profit: combination.profit,
}));

export const aiProfiles = aiCompetitors.map(({ id, name, initials, analysisStyle, investmentPhilosophy, signatureTraits, strategy, strategyDescription }) => ({
  id,
  name,
  initials,
  analysisStyle,
  investmentPhilosophy,
  signatureTraits,
  strategy,
  strategyDescription,
}));

export const matchAnalyses = analysisMatches;
export const battleResults = predictionHistory.map((record) => ({
  matchId: record.id,
  actualResult: record.result,
  winners: record.hit ? [record.aiName] : [],
  losers: record.hit ? [] : [record.aiName],
}));

export const communityPosts: CommunityPost[] = [
  {
    id: "post-001",
    category: "공지",
    title: "커뮤니티는 AI 리그 관전 보조 메뉴로 운영됩니다",
    author: SCOREHUB.name,
    createdAt: "2026-06-17 09:00",
    views: 128,
    comments: 0,
    likes: 12,
    body: "현재 ScoreHub의 핵심은 AI들의 가상배팅 조합, 정산 결과, ROI 경쟁입니다. 커뮤니티는 경기와 AI 판단에 대한 의견을 나누는 보조 공간으로 유지합니다.",
    commentList: [],
  },
];

export const getRankedAis = () =>
  [...aiCompetitors].sort((a, b) => b.roi - a.roi || b.currentBankroll - a.currentBankroll || b.winRate - a.winRate);

export const getTodayCombinations = () =>
  combinations.filter((combination) => combination.status === "scheduled" || combination.status === "pending");

export const getSettledCombinations = () => historyRecords;

export const getAverageRoi = () =>
  aiCompetitors.reduce((total, ai) => total + ai.roi, 0) / aiCompetitors.length;

export const getAnalysisMatch = (id: string) =>
  analysisMatches.find((match) => match.id === id);

export const getMostDivisiveMatch = () =>
  [...analysisMatches].sort((a, b) => a.consensusScore - b.consensusScore)[0];

export const getStrongConsensusMatch = () =>
  [...analysisMatches].sort((a, b) => b.consensusScore - a.consensusScore)[0];

export const getAiById = (id: string) =>
  aiCompetitors.find((aiItem) => aiItem.id === id.toLowerCase());

export const getCombosByAi = (aiIdOrName: string) => {
  const target = aiModels.find((model) => model.id === aiIdOrName.toLowerCase() || model.name.toLowerCase() === aiIdOrName.toLowerCase());
  return target ? combinations.filter((combination) => combination.aiName === target.name) : [];
};

export const getComboById = (comboId: string) =>
  combinations.find((combination) => combination.id === comboId || combination.comboId === comboId);

function ai(
  aiName: string,
  prediction: string,
  score: string,
  overUnder: "Over" | "Under",
  confidence: number,
  summary: string,
): AnalysisMatch["analyses"][number] {
  const total = score
    .split(":")
    .map(Number)
    .filter((value) => !Number.isNaN(value))
    .reduce((sum, value) => sum + value, 0);

  return {
    aiName,
    prediction,
    expectedScore: score,
    predictedTotal: total || undefined,
    overUnder,
    confidence,
    analysisAngle: overUnder === "Over" ? "공격 흐름 우세" : "수비 안정 우세",
    decisionStatus: confidence >= 62 ? "추천" : "관망",
    decisionReason: summary,
    summary,
    strengths: ["최근 경기 지표 일치", "라인업 변동 리스크 제한", "상대 약점 공략 가능"],
    risks: ["라인 변동 가능성", "초반 실점 또는 변수 발생"],
  };
}

function leg(matchId: string, market: string, pick: string, odds: number, result: BettingComboLeg["result"], confidence: number, reasoning: string): BettingComboLeg {
  const match = matches.find((item) => item.id === matchId);

  if (!match) {
    throw new Error(`Unknown match id: ${matchId}`);
  }

  return {
    matchId,
    sport: match.sport,
    league: match.league,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    market,
    pick,
    odds,
    result,
    confidence,
    reasoning,
  };
}

function combo(id: string, aiName: string, date: string, status: Combination["status"], stake: number, legs: BettingComboLeg[]): Combination {
  const totalOdds = round2(legs.reduce((value, item) => value * item.odds, 1));
  const potentialPayout = round2(stake * totalOdds);
  const allWon = legs.every((item) => item.result === "won");
  const hasLost = legs.some((item) => item.result === "lost");
  const profit = status === "won" || allWon ? round2(potentialPayout - stake) : status === "lost" || hasLost ? -stake : 0;

  return {
    id,
    comboId: id,
    date,
    aiName,
    style: aiModels.find((model) => model.name === aiName)?.description ?? "AI 가상배팅 조합",
    stake,
    totalOdds,
    potentialPayout,
    potentialReturn: potentialPayout,
    status,
    result: getComboResult(status),
    profit,
    legs,
    selections: legs.map((item) => ({
      analysisId: item.matchId,
      match: `${item.homeTeam} vs ${item.awayTeam}`,
      league: item.league,
      sport: item.sport,
      prediction: item.pick,
      odds: item.odds,
    })),
  };
}

function getComboResult(status: Combination["status"]) {
  if (status === "won") {
    return "당첨";
  }

  if (status === "lost") {
    return "낙첨";
  }

  if (status === "pending") {
    return "정산 대기";
  }

  return "경기 예정";
}

function getConsensusScore(analyses: AnalysisMatch["analyses"]) {
  if (analyses.length === 0) {
    return 0;
  }

  const counts = analyses.reduce<Record<string, number>>((acc, analysis) => {
    acc[analysis.prediction] = (acc[analysis.prediction] ?? 0) + 1;
    return acc;
  }, {});

  return Math.round((Math.max(...Object.values(counts)) / analyses.length) * 100);
}

function getConsensusLabel(score: number) {
  if (score >= 90) {
    return "Strong Consensus";
  }

  if (score >= 60) {
    return "Partial Consensus";
  }

  return "Split Opinion";
}

function getWinnerText(match: Match) {
  if (match.homeScore === match.awayScore) {
    return "무승부";
  }

  return (match.homeScore ?? 0) > (match.awayScore ?? 0) ? `${match.homeTeam} 승` : `${match.awayTeam} 승`;
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function buildPerformanceHistory(aiName: string, totalProfit: number) {
  const finalRoi = aiPerformanceOverrides[aiName]?.roi ?? (totalProfit / STARTING_BANKROLL * 100);
  const shape: Record<string, number[]> = {
    GPT: [0, 1.8, 3.9, 5.1, finalRoi],
    Gemini: [0, 2.4, 5.8, 9.6, finalRoi],
    DeepSeek: [0, -1.1, 3.4, 0.8, finalRoi],
    Grok: [0, 1.2, -0.6, -2.4, finalRoi],
    Claude: [0, -0.8, -2.9, -3.6, finalRoi],
  };
  const dates = ["2026-06-13", "2026-06-14", "2026-06-15", "2026-06-16", "2026-06-17"];

  return (shape[aiName] ?? shape.GPT).map((roi, index) => ({
    date: dates[index],
    roi: round2(roi),
    bankroll: Math.round(STARTING_BANKROLL * (1 + roi / 100)),
  }));
}

function getPhilosophy(aiName: string) {
  const philosophies: Record<string, string> = {
    GPT: "낮은 배당이라도 근거가 겹치는 경기만 묶어 적중률을 우선합니다.",
    Gemini: "안정 픽과 적정 배당 픽을 섞어 하루 ROI 변동성을 낮춥니다.",
    DeepSeek: "시장이 과소평가한 업셋과 고배당 조합을 적극적으로 찾습니다.",
    Grok: "대중 쏠림과 반대되는 구간에서 핸디캡과 언더독 가치를 찾습니다.",
    Claude: "데이터 근거가 강한 경기만 골라 적은 횟수로 신중하게 배팅합니다.",
  };

  return philosophies[aiName] ?? "AI별 전략에 따라 조합을 만듭니다.";
}

function getTraits(aiName: string) {
  const traits: Record<string, string[]> = {
    GPT: ["낮은 배당", "높은 신뢰도", "적중률 우선"],
    Gemini: ["균형 조합", "스포츠 분산", "중간 배당"],
    DeepSeek: ["업셋", "고배당", "기대값"],
    Grok: ["역배", "대중 반대", "핸디캡"],
    Claude: ["강한 근거", "낮은 빈도", "리스크 제한"],
  };

  return traits[aiName] ?? ["AI 전략"];
}

function getBestHit(aiName: string) {
  const won = combinations
    .filter((combination) => combination.aiName === aiName && combination.status === "won")
    .sort((a, b) => b.totalOdds - a.totalOdds)[0];

  return won ? `${won.legs.length}폴더 ${won.totalOdds.toFixed(2)}배` : "정산 대기";
}
