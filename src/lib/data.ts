import type {
  AIDecisionProcess,
  AICompetitor,
  AIModel,
  AnalysisMatch,
  ApiCombination,
  Combination,
  CommunityPost,
  FeaturedMatch,
  Match,
  Prediction,
  PredictionHistoryRecord,
} from "./types";
import { SCOREHUB } from "./brand";

export const aiModels: AIModel[] = [
  { id: "gpt", name: "GPT", initials: "GP", description: "전력 지표와 최근 폼을 균형 있게 반영", color: "blue" },
  { id: "gemini", name: "Gemini", initials: "GE", description: "경기 흐름과 변수 탐지에 강점", color: "green" },
  { id: "claude", name: "Claude", initials: "CL", description: "맥락 기반 리스크 점검과 안정적인 판단", color: "cyan" },
  { id: "grok", name: "Grok", initials: "GR", description: "뉴스와 라인업 변화를 빠르게 반영", color: "slate" },
  { id: "deepseek", name: "DeepSeek", initials: "DS", description: "확률 모델과 ROI 효율 판단", color: "indigo" },
];

export const rankingStats: AICompetitor[] = [
  competitor("gpt", "GPT", "GP", "A+", 68, 102, 48, 134500, 34.5, 66.8, "데이터 밸런스형", "전력, 일정, 최근 폼을 균형 있게 반영합니다.", ["최근 5경기 폼", "부상 변수", "시장 안정성"]),
  competitor("gemini", "Gemini", "GE", "A", 64, 96, 54, 128000, 28.0, 64.1, "흐름 감지형", "경기 템포와 부상 변수, 최근 분위기를 민감하게 봅니다.", ["경기 템포", "홈/원정 밸런스", "후반 집중력"]),
  competitor("claude", "Claude", "CL", "A", 65, 98, 52, 118500, 18.5, 65.3, "리스크 관리형", "스코어 분포와 언더/오버 기대값을 촘촘하게 계산합니다.", ["예상 득점", "언더/오버", "확률 분포"]),
  competitor("grok", "Grok", "GR", "B+", 61, 88, 56, 121000, 21.0, 61.4, "뉴스 반응형", "라인업 발표와 현장 이슈, 여론 변화를 빠르게 반영합니다.", ["라인업 뉴스", "현장 변수", "메타 이슈"]),
  competitor("deepseek", "DeepSeek", "DS", "B+", 61, 92, 58, 116800, 16.8, 61.2, "ROI 확률형", "배당 대비 기대값과 경기별 리스크 분산을 함께 계산합니다.", ["기대값 계산", "ROI 효율", "확률 분포"]),
];

export const aiCompetitors = rankingStats;

export const matches: Match[] = [
  {
    id: "lg-kia",
    sport: "야구",
    league: "KBO",
    homeTeam: "LG 트윈스",
    awayTeam: "KIA 타이거즈",
    startTime: "2026-06-08 18:30",
    status: "live",
    homeScore: 3,
    awayScore: 2,
    venue: "잠실야구장",
    headline: "상위권 맞대결, 불펜 운영과 중심 타선 컨디션이 승부처입니다.",
    popularity: 96,
  },
  {
    id: "seoul-jeonbuk",
    sport: "축구",
    league: "K리그1",
    homeTeam: "FC 서울",
    awayTeam: "전북 현대",
    startTime: "2026-06-08 19:00",
    status: "scheduled",
    venue: "서울월드컵경기장",
    headline: "중원 압박과 전환 속도가 핵심 변수입니다.",
    popularity: 91,
  },
  {
    id: "sk-kcc",
    sport: "농구",
    league: "KBL",
    homeTeam: "서울 SK",
    awayTeam: "부산 KCC",
    startTime: "2026-06-08 19:00",
    status: "scheduled",
    venue: "잠실학생체육관",
    headline: "트랜지션 득점과 리바운드 우위가 중요합니다.",
    popularity: 84,
  },
  {
    id: "t1-gen",
    sport: "e스포츠",
    league: "LCK",
    homeTeam: "T1",
    awayTeam: "Gen.G",
    startTime: "2026-06-08 20:00",
    status: "scheduled",
    venue: "LoL Park",
    headline: "밴픽 주도권과 초반 오브젝트 운영이 승부를 가릅니다.",
    popularity: 99,
  },
  {
    id: "korea-japan-volley",
    sport: "배구",
    league: "VNL",
    homeTeam: "대한민국",
    awayTeam: "일본",
    startTime: "2026-06-09 18:00",
    status: "scheduled",
    venue: "인천 삼산월드체육관",
    headline: "리시브 안정성과 세트 후반 결정력이 관건입니다.",
    popularity: 72,
  },
  {
    id: "hanwha-lotte",
    sport: "야구",
    league: "KBO",
    homeTeam: "한화 이글스",
    awayTeam: "롯데 자이언츠",
    startTime: "2026-06-07 17:00",
    status: "final",
    homeScore: 5,
    awayScore: 4,
    venue: "대전 한화생명이글스파크",
    headline: "후반 집중력으로 갈린 접전입니다.",
    popularity: 77,
  },
];

const analysisByMatch: Record<string, AnalysisMatch["analyses"]> = {
  "lg-kia": [
    ai("GPT", "홈승", "5:3", "Under", 68, "LG의 선발 안정성과 홈 불펜 운영을 높게 평가했습니다."),
    ai("Gemini", "홈승", "6:4", "Over", 64, "최근 타선 흐름은 접전이지만 LG의 후반 집중력이 우세합니다."),
    ai("Claude", "홈승", "4:2", "Under", 66, "예상 실점 분포상 LG가 낮은 스코어 경기에서 앞섭니다."),
    ai("Grok", "원정승", "4:5", "Over", 57, "KIA 중심 타선 회복 뉴스와 대타 카드 활용도를 변수로 봅니다."),
    ai("DeepSeek", "홈승", "5:3", "Under", 66, "배당 대비 기대값은 LG 쪽이 더 안정적으로 계산됩니다."),
  ],
  "seoul-jeonbuk": [
    ai("GPT", "무승부", "1:1", "Under", 61, "양 팀 모두 수비 라인을 먼저 안정화할 가능성이 큽니다."),
    ai("Gemini", "홈승", "2:1", "Over", 58, "서울의 측면 전개 속도가 전북 수비 간격을 흔들 수 있습니다."),
    ai("Claude", "무승부", "0:0", "Under", 63, "득점 기대값이 낮고 세트피스 의존도가 높은 매치업입니다."),
    ai("Grok", "무승부", "1:1", "Under", 60, "라인업 변동이 적어 보수적인 경기 운영이 예상됩니다."),
    ai("DeepSeek", "무승부", "1:1", "Under", 62, "승패 방향보다 낮은 총점 쪽의 기대값이 높습니다."),
  ],
  "sk-kcc": [
    ai("GPT", "홈승", "88:82", "Over", 65, "SK의 트랜지션 득점과 리바운드 우위를 근거로 봅니다."),
    ai("Gemini", "홈승", "91:86", "Over", 67, "KCC 벤치 구간 수비 흔들림이 후반 변수입니다."),
    ai("Claude", "홈승", "84:80", "Under", 62, "총점 분포는 낮지만 SK 승률이 근소하게 우세합니다."),
    ai("Grok", "원정승", "83:87", "Under", 55, "KCC 핵심 가드 출전 가능성이 올라간 점을 반영했습니다."),
    ai("DeepSeek", "홈승", "86:80", "Under", 64, "SK 승리와 언더 조합의 리스크 대비 보상이 좋습니다."),
  ],
  "t1-gen": [
    ai("GPT", "홈승", "2:1", "Over", 59, "초반 설계와 교전 전환에서 T1의 강점을 봅니다."),
    ai("Gemini", "원정승", "1:2", "Over", 62, "Gen.G의 운영 안정성과 후반 한타 집중력이 우세합니다."),
    ai("Claude", "원정승", "0:2", "Under", 58, "오브젝트 교환 효율 모델에서 Gen.G가 앞섭니다."),
    ai("Grok", "원정승", "1:2", "Over", 60, "최근 메타 적응도와 밴픽 폭은 Gen.G 쪽에 무게가 있습니다."),
    ai("DeepSeek", "원정승", "1:2", "Over", 63, "세트별 승률 분포가 Gen.G 방향으로 가장 안정적입니다."),
  ],
  "korea-japan-volley": [
    ai("GPT", "원정승", "1:3", "Over", 60, "일본의 리시브 안정성과 속공 완성도가 높습니다."),
    ai("Gemini", "원정승", "2:3", "Over", 57, "한국의 홈 이점은 있지만 세트 후반 결정력이 변수입니다."),
    ai("Claude", "원정승", "1:3", "Under", 61, "세트별 득점 분산에서 일본 우세 확률이 높습니다."),
    ai("Grok", "홈승", "3:2", "Over", 52, "홈 관중과 서브 압박 성공률 상승 가능성을 봅니다."),
    ai("DeepSeek", "원정승", "1:3", "Under", 64, "일본 승리 쪽 장기 기대값이 더 높습니다."),
  ],
  "hanwha-lotte": [
    ai("GPT", "홈승", "5:4", "Over", 63, "한화의 후반 대타 카드와 불펜 매치업이 적중했습니다."),
    ai("Gemini", "홈승", "6:4", "Over", 60, "경기 흐름상 홈팀 후반 득점 가능성이 높았습니다."),
    ai("Claude", "홈승", "4:3", "Under", 59, "낮은 총점 접근은 맞았고 승패 방향도 일치했습니다."),
    ai("Grok", "원정승", "3:5", "Under", 51, "롯데 선발 이슈가 생각보다 빠르게 드러났습니다."),
    ai("DeepSeek", "홈승", "5:4", "Over", 66, "홈팀 승리와 오버 조합이 결과적으로 가장 효율적이었습니다."),
  ],
};

export const analysisMatches: AnalysisMatch[] = matches.map((match) => ({
  id: match.id,
  match: `${match.homeTeam} vs ${match.awayTeam}`,
  sport: match.sport,
  league: match.league,
  startTime: match.startTime,
  headline: match.headline ?? "",
  consensusScore: getConsensusScore(analysisByMatch[match.id] ?? []),
  consensusLabel: getConsensusLabel(getConsensusScore(analysisByMatch[match.id] ?? [])),
  actualResult: match.status === "final" ? getWinnerText(match) : undefined,
  status: match.status,
  homeTeam: match.homeTeam,
  awayTeam: match.awayTeam,
  homeScore: match.homeScore,
  awayScore: match.awayScore,
  venue: match.venue,
  recentForm: ["최근 5경기 득점 흐름 안정", "주전 라인업 변동 적음", "후반 실점 관리가 관건"],
  headToHead: [
    { date: "2026.05.21", result: `${match.homeTeam} 승`, note: "후반 집중력 우세" },
    { date: "2026.04.12", result: `${match.awayTeam} 승`, note: "원정팀 역습 성공" },
    { date: "2026.03.08", result: "무승부", note: "접전 흐름" },
  ],
  standings: [
    { rank: 2, team: match.homeTeam, played: 28, points: 53, form: "W-W-L-W-D" },
    { rank: 4, team: match.awayTeam, played: 28, points: 49, form: "W-L-W-D-W" },
  ],
  analyses: analysisByMatch[match.id] ?? [],
}));

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

export const predictionHistory: PredictionHistoryRecord[] = [
  history("h-001", "2026-06-07", "야구", "KBO", "한화 이글스 vs 롯데 자이언츠", "GPT", "홈승", "한화 5:4 롯데", true, 63),
  history("h-002", "2026-06-07", "야구", "KBO", "한화 이글스 vs 롯데 자이언츠", "Grok", "원정승", "한화 5:4 롯데", false, 51),
  history("h-003", "2026-06-06", "축구", "K리그1", "울산 HD vs 포항", "Claude", "Under", "1:0", true, 66),
  history("h-004", "2026-06-06", "농구", "KBL", "원주 DB vs 창원 LG", "Gemini", "홈승", "DB 81:77 LG", true, 64),
  history("h-005", "2026-06-05", "e스포츠", "LCK", "DK vs HLE", "GPT", "원정승", "DK 1:2 HLE", true, 61),
  history("h-006", "2026-06-05", "배구", "VNL", "대한민국 vs 브라질", "Claude", "원정승", "대한민국 0:3 브라질", true, 69),
];

export const featuredMatches: FeaturedMatch[] = analysisMatches.map((match) => ({
  id: match.id,
  sport: match.sport,
  league: match.league,
  match: match.match,
  startTime: match.startTime,
}));

export const decisionProcesses: AIDecisionProcess[] = aiModels.map((model, index) => ({
  aiName: model.name,
  reviewedMatches: 42,
  candidateMatches: 14 - index,
  finalSelections: 6 - Math.min(index, 2),
  excludedMatches: 28 + index,
  combinationOdds: [72.4, 69.1, 71.6, 66.9, 75.8][index] ?? 68.5,
}));

const combinationMetrics: Record<string, { index: number; stake: number; return: number; profit: number }> = {
  GPT: { index: 72.4, stake: 10000, return: 16800, profit: 6800 },
  Gemini: { index: 69.1, stake: 10000, return: 15200, profit: 5200 },
  Claude: { index: 71.6, stake: 10000, return: 15800, profit: 5800 },
  Grok: { index: 66.9, stake: 10000, return: 14300, profit: 4300 },
  DeepSeek: { index: 75.8, stake: 10000, return: 17400, profit: 7400 },
};

export const combinations: Combination[] = aiModels.map((model, index) => {
  const metrics = combinationMetrics[model.name] ?? combinationMetrics.GPT;
  const selectionSource = [...analysisMatches.slice(index, index + 3), ...analysisMatches].slice(0, 3);

  return {
    id: `combo-${index + 1}`,
    date: "2026-06-08",
    aiName: model.name,
    style: model.description,
    stake: metrics.stake,
    totalOdds: metrics.index,
    potentialReturn: metrics.return,
    status: "대기중",
    result: "예정 경기",
    profit: metrics.profit,
    selections: selectionSource.map((match, selectionIndex) => ({
      analysisId: match.id,
      match: match.match,
      league: match.league,
      sport: match.sport,
      prediction: match.analyses.find((analysis) => analysis.aiName === model.name)?.prediction ?? "관망",
      odds: [1.82, 1.74, 1.91][selectionIndex] ?? 1.8,
    })),
  };
});

export const allCombinations = combinations;
export const historyRecords = combinations.filter((combination) => combination.status !== "대기중");
export const apiCombinations: ApiCombination[] = allCombinations.map((combination) => ({
  aiName: combination.aiName,
  combinationId: combination.id,
  date: combination.date,
  style: combination.style,
  legs: combination.selections.map((selection) => ({
    matchId: selection.analysisId,
    pick: selection.prediction,
    odds: selection.odds,
  })),
  odds: combination.totalOdds,
  stake: combination.stake,
  potentialProfit: combination.profit,
  potentialReturn: combination.potentialReturn,
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
  post("post-001", "공지", "ScoreHub 시즌 리그 운영 안내", SCOREHUB.name, "2026-06-08 09:00", 128, 3, 12, "AI와 인간 참가자가 같은 경기, 같은 규칙, 같은 100,000 SHC 시즌 자산으로 경쟁합니다. 경기 종료 후 예측 결과는 자동 채점되고 ROI 랭킹에 반영됩니다."),
  post("post-002", "경기토론", "오늘 T1 경기 어떻게 보시나요?", "축구도사", "2026-06-08 10:12", 342, 18, 41, "Gen.G 운영은 안정적인데 T1 초반 설계가 변수 같네요. AI들은 대부분 Gen.G 쪽으로 기울었습니다."),
  post("post-003", "AI토론", "GPT 최근 적중률 미쳤네", "토토왕", "2026-06-08 11:30", 287, 12, 34, "KBO 쪽에서 GPT가 계속 안정적인 픽을 내고 있습니다. 단기 흐름인지 모델 스타일인지 궁금하네요."),
  post("post-004", "AI토론", "DeepSeek 축구 예측 생각보다 잘 맞네", "야구고수", "2026-06-08 12:04", 219, 9, 28, "DeepSeek가 축구 무승부와 언더를 꽤 보수적으로 잡는데 ROI 관점에서는 나쁘지 않아 보입니다."),
  post("post-005", "자유게시판", "이번 주 최고의 픽은?", "농구황제", "2026-06-08 13:18", 176, 7, 19, "개인적으로 서울 SK 승이 가장 깔끔해 보입니다. AI와 인간 픽이 갈리는 경기라 더 재미있네요."),
  post("post-006", "리그토론", "AI보다 사람이 더 잘 맞추는 듯", "승부읽는자", "2026-06-08 14:45", 254, 15, 31, "축구도사 ROI가 계속 상위권이라 인간 진영도 충분히 경쟁력이 있어 보입니다."),
];

export const getRankedAis = () => [...aiCompetitors].sort((a, b) => b.accuracy - a.accuracy);
export const getTodayCombinations = () => combinations;
export const getSettledCombinations = () => allCombinations.filter((combination) => combination.status !== "대기중");
export const getAverageRoi = () => aiCompetitors.reduce((total, ai) => total + ai.roi, 0) / aiCompetitors.length;
export const getAnalysisMatch = (id: string) => analysisMatches.find((match) => match.id === id);
export const getMostDivisiveMatch = () => [...analysisMatches].sort((a, b) => a.consensusScore - b.consensusScore)[0];
export const getStrongConsensusMatch = () => [...analysisMatches].sort((a, b) => b.consensusScore - a.consensusScore)[0];

function competitor(
  id: string,
  name: string,
  initials: string,
  reliabilityGrade: AICompetitor["reliabilityGrade"],
  recent30DayAccuracy: number,
  wins: number,
  losses: number,
  currentBalance: number,
  roi: number,
  accuracy: number,
  analysisStyle: string,
  investmentPhilosophy: string,
  signatureTraits: string[],
): AICompetitor {
  return {
    id,
    name,
    initials,
    reliabilityGrade,
    recent30DayRoi: roi,
    recent30DayAccuracy,
    recent30DayWins: wins,
    recent30DayLosses: losses,
    recent10Results: ["적중", "적중", "미적중", "적중", "적중", "적중", "미적중", "적중", "적중", "적중"],
    recentResults: ["적중", "적중", "미적중", "적중", "적중"],
    recentRoiTrend: [roi - 7, roi - 5, roi - 4, roi - 3, roi - 2, roi - 1, roi],
    analysisStyle,
    investmentPhilosophy,
    signatureTraits,
    strategy: analysisStyle,
    strategyDescription: `${analysisStyle} 전략으로 경기 결과 확률과 리스크를 함께 계산합니다.`,
    bestHitCombination: "KBO + LCK 주요 경기",
    bestHitOdds: 72.4,
    startingBalance: 100000,
    currentBalance,
    totalProfit: currentBalance - 100000,
    roi,
    accuracy,
    totalPicks: wins + losses,
    wins,
    losses,
    battleWins: wins,
    battleLosses: losses,
    sportStats: [
      { sport: "축구", accuracy: Math.round(accuracy), picks: 116 },
      { sport: "야구", accuracy: Math.round(accuracy + 2), picks: 138 },
      { sport: "농구", accuracy: Math.round(accuracy - 1), picks: 91 },
    ],
  };
}

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
    roiChange: confidence >= 62 ? 2500 : -1200,
    analysisAngle: overUnder === "Over" ? "공격 흐름 우세" : "수비 안정 우세",
    decisionStatus: confidence >= 62 ? "추천" : "관망",
    decisionReason: summary,
    summary,
    strengths: ["최근 경기 지표 양호", "핵심 선수 활용 가능", "상대 약점 공략 여지"],
    risks: ["라인업 변경 가능성", "초반 실점 또는 흐름 급변"],
  };
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

  return (match.homeScore ?? 0) > (match.awayScore ?? 0) ? "홈승" : "원정승";
}

function history(
  id: string,
  date: string,
  sport: string,
  league: string,
  match: string,
  aiName: string,
  prediction: string,
  result: string,
  hit: boolean,
  confidence: number,
): PredictionHistoryRecord {
  return { id, date, sport, league, match, aiName, prediction, result, hit, confidence };
}

function post(
  id: string,
  category: string,
  title: string,
  author: string,
  createdAt: string,
  views: number,
  comments: number,
  likes: number,
  body: string,
): CommunityPost {
  return {
    id,
    category,
    title,
    author,
    createdAt,
    views,
    comments,
    likes,
    body,
    commentList: [
      { id: `${id}-c1`, author: "리그팬", content: "AI와 인간 픽이 갈리는 지점이 제일 재미있네요.", createdAt },
      { id: `${id}-c2`, author: "ScoreHub 유저", content: "경기 끝나고 ROI 반영되는 흐름도 계속 보고 있습니다.", createdAt },
    ],
  };
}
