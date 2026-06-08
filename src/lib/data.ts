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

export const aiModels: AIModel[] = [
  { id: "gpt", name: "GPT", initials: "GP", description: "전력 지표와 최근 폼을 균형 있게 반영", color: "blue" },
  { id: "gemini", name: "Gemini", initials: "GE", description: "경기 흐름과 변수 탐지에 강점", color: "green" },
  { id: "grok", name: "Grok", initials: "GR", description: "이슈와 라인업 뉴스를 빠르게 반영", color: "slate" },
  { id: "deepseek", name: "DeepSeek", initials: "DS", description: "수치 기반 확률 모델과 언더/오버 판단", color: "cyan" },
];

export const rankingStats: AICompetitor[] = [
  {
    id: "gpt",
    name: "GPT",
    initials: "GP",
    reliabilityGrade: "A+",
    recent30DayRoi: 0,
    recent30DayAccuracy: 68,
    recent30DayWins: 102,
    recent30DayLosses: 48,
    recent10Results: ["적중", "적중", "미적중", "적중", "적중", "적중", "미적중", "적중", "적중", "적중"],
    recentResults: ["적중", "적중", "미적중", "적중", "적중"],
    recentRoiTrend: [61, 62, 64, 63, 65, 66, 67, 66, 68, 68],
    analysisStyle: "데이터 밸런스형",
    investmentPhilosophy: "전력, 일정, 최근 폼을 균형 있게 반영합니다.",
    signatureTraits: ["최근 5경기 폼", "득실 기대값", "라인업 안정성"],
    strategy: "밸런스 분석",
    strategyDescription: "승부 예측과 예상 스코어를 함께 제시하는 표준형 모델",
    bestHitCombination: "KBO + EPL 주요 경기",
    bestHitOdds: 0,
    startingBalance: 0,
    currentBalance: 0,
    totalProfit: 0,
    roi: 0,
    accuracy: 66.8,
    totalPicks: 420,
    wins: 281,
    losses: 139,
    battleWins: 281,
    battleLosses: 139,
    sportStats: [
      { sport: "축구", accuracy: 67, picks: 116 },
      { sport: "야구", accuracy: 69, picks: 138 },
      { sport: "농구", accuracy: 64, picks: 91 },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    initials: "GE",
    reliabilityGrade: "A",
    recent30DayRoi: 0,
    recent30DayAccuracy: 64,
    recent30DayWins: 96,
    recent30DayLosses: 54,
    recent10Results: ["적중", "미적중", "적중", "적중", "미적중", "적중", "적중", "미적중", "적중", "적중"],
    recentResults: ["적중", "미적중", "적중", "적중", "미적중"],
    recentRoiTrend: [58, 60, 61, 62, 61, 63, 64, 63, 64, 64],
    analysisStyle: "흐름 감지형",
    investmentPhilosophy: "경기 템포, 부상 변수, 최근 분위기를 민감하게 봅니다.",
    signatureTraits: ["경기 템포", "부상 변수", "후반 집중력"],
    strategy: "흐름 분석",
    strategyDescription: "최근 흐름과 경기 내 변동성을 중시하는 모델",
    bestHitCombination: "KBL + LCK 흐름 경기",
    bestHitOdds: 0,
    startingBalance: 0,
    currentBalance: 0,
    totalProfit: 0,
    roi: 0,
    accuracy: 64.1,
    totalPicks: 410,
    wins: 263,
    losses: 147,
    battleWins: 263,
    battleLosses: 147,
    sportStats: [
      { sport: "축구", accuracy: 63, picks: 112 },
      { sport: "농구", accuracy: 66, picks: 104 },
      { sport: "e스포츠", accuracy: 65, picks: 86 },
    ],
  },
  {
    id: "grok",
    name: "Grok",
    initials: "GR",
    reliabilityGrade: "B+",
    recent30DayRoi: 0,
    recent30DayAccuracy: 61,
    recent30DayWins: 88,
    recent30DayLosses: 56,
    recent10Results: ["미적중", "적중", "적중", "미적중", "적중", "미적중", "적중", "적중", "적중", "미적중"],
    recentResults: ["미적중", "적중", "적중", "미적중", "적중"],
    recentRoiTrend: [56, 58, 57, 59, 60, 60, 61, 60, 62, 61],
    analysisStyle: "뉴스 반응형",
    investmentPhilosophy: "라인업 발표, 현장 이슈, 팬 여론 변화를 빠르게 반영합니다.",
    signatureTraits: ["라인업 뉴스", "현장 변수", "멘탈 이슈"],
    strategy: "이슈 분석",
    strategyDescription: "경기 전후 최신 변수를 반영하는 모델",
    bestHitCombination: "UCL + KBO 라인업 변동 경기",
    bestHitOdds: 0,
    startingBalance: 0,
    currentBalance: 0,
    totalProfit: 0,
    roi: 0,
    accuracy: 61.4,
    totalPicks: 356,
    wins: 219,
    losses: 137,
    battleWins: 219,
    battleLosses: 137,
    sportStats: [
      { sport: "축구", accuracy: 62, picks: 120 },
      { sport: "야구", accuracy: 60, picks: 96 },
      { sport: "e스포츠", accuracy: 63, picks: 72 },
    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    initials: "DS",
    reliabilityGrade: "A",
    recent30DayRoi: 0,
    recent30DayAccuracy: 65,
    recent30DayWins: 98,
    recent30DayLosses: 52,
    recent10Results: ["적중", "적중", "적중", "미적중", "적중", "미적중", "적중", "적중", "미적중", "적중"],
    recentResults: ["적중", "적중", "적중", "미적중", "적중"],
    recentRoiTrend: [60, 61, 63, 64, 63, 64, 65, 64, 66, 65],
    analysisStyle: "확률 모델형",
    investmentPhilosophy: "스코어 분포와 언더/오버 기대값을 촘촘하게 계산합니다.",
    signatureTraits: ["예상 득점", "언더/오버", "확률 분포"],
    strategy: "확률 분석",
    strategyDescription: "예상 스코어와 총점 예측에 강한 모델",
    bestHitCombination: "KBO 언더/오버 주요 경기",
    bestHitOdds: 0,
    startingBalance: 0,
    currentBalance: 0,
    totalProfit: 0,
    roi: 0,
    accuracy: 65.3,
    totalPicks: 398,
    wins: 260,
    losses: 138,
    battleWins: 260,
    battleLosses: 138,
    sportStats: [
      { sport: "야구", accuracy: 67, picks: 126 },
      { sport: "농구", accuracy: 65, picks: 92 },
      { sport: "배구", accuracy: 64, picks: 58 },
    ],
  },
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
    headline: "상위권 맞대결, 불펜 운영이 승부처",
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
    headline: "중원 압박과 전환 속도가 핵심 변수",
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
    headline: "외곽 성공률과 리바운드 싸움에 주목",
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
    headline: "밴픽 주도권과 초반 오브젝트 운영 대결",
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
    headline: "서브 리시브 안정성이 승패를 가를 경기",
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
    venue: "대전한화생명이글스파크",
    headline: "후반 집중력으로 갈린 접전",
    popularity: 77,
  },
];

const analysisByMatch: Record<string, AnalysisMatch["analyses"]> = {
  "lg-kia": [
    ai("GPT", "홈승", "5:3", "Under", 68, "LG의 선발 안정성과 홈 불펜 운영을 높게 평가했습니다."),
    ai("Gemini", "홈승", "6:4", "Over", 64, "최근 타선 흐름은 접전이지만 LG의 후반 집중력이 우세합니다."),
    ai("Grok", "원정승", "4:5", "Over", 57, "KIA 중심 타선 회복 뉴스와 대타 카드 활용도를 변수로 봅니다."),
    ai("DeepSeek", "홈승", "4:2", "Under", 66, "예상 실점 분포상 LG가 낮은 스코어 경기에서 앞섭니다."),
  ],
  "seoul-jeonbuk": [
    ai("GPT", "무승부", "1:1", "Under", 61, "양 팀 모두 수비 라인을 먼저 안정화할 가능성이 큽니다."),
    ai("Gemini", "홈승", "2:1", "Over", 58, "서울의 측면 전개 속도가 전북 수비 간격을 흔들 수 있습니다."),
    ai("Grok", "무승부", "1:1", "Under", 60, "라인업 변동이 적어 보수적인 경기 운영이 예상됩니다."),
    ai("DeepSeek", "무승부", "0:0", "Under", 63, "득점 기대값이 낮고 세트피스 의존도가 높은 매치업입니다."),
  ],
  "sk-kcc": [
    ai("GPT", "홈승", "88:82", "Over", 65, "SK의 트랜지션 득점과 리바운드 우위를 근거로 봅니다."),
    ai("Gemini", "홈승", "91:86", "Over", 67, "KCC 벤치 구간 수비 흔들림이 후반 변수입니다."),
    ai("Grok", "원정승", "83:87", "Under", 55, "KCC 핵심 가드 출전 가능성이 올라간 점을 반영했습니다."),
    ai("DeepSeek", "홈승", "84:80", "Under", 62, "총점 분포는 낮지만 SK 승률이 근소하게 우세합니다."),
  ],
  "t1-gen": [
    ai("GPT", "홈승", "2:1", "Over", 59, "초반 설계와 교전 전환에서 T1의 강점을 봅니다."),
    ai("Gemini", "원정승", "1:2", "Over", 62, "Gen.G의 운영 안정성과 후반 한타 집중력이 우세합니다."),
    ai("Grok", "원정승", "1:2", "Over", 60, "최근 메타 적응도와 밴픽 폭은 Gen.G 쪽에 무게가 있습니다."),
    ai("DeepSeek", "원정승", "0:2", "Under", 58, "오브젝트 교환 효율 모델에서 Gen.G가 앞섭니다."),
  ],
  "korea-japan-volley": [
    ai("GPT", "원정승", "1:3", "Over", 60, "일본의 리시브 안정성과 속공 완성도가 높습니다."),
    ai("Gemini", "원정승", "2:3", "Over", 57, "한국의 홈 이점은 있지만 세트 후반 결정력이 변수입니다."),
    ai("Grok", "홈승", "3:2", "Over", 52, "홈 관중과 서브 압박 성공률 상승 가능성을 봅니다."),
    ai("DeepSeek", "원정승", "1:3", "Under", 61, "세트별 득점 분산에서 일본 우세 확률이 높습니다."),
  ],
  "hanwha-lotte": [
    ai("GPT", "홈승", "5:4", "Over", 63, "한화의 후반 대타 카드와 불펜 매치업이 적중했습니다."),
    ai("Gemini", "홈승", "6:4", "Over", 60, "경기 흐름상 홈팀 후반 득점 가능성이 높았습니다."),
    ai("Grok", "원정승", "3:5", "Under", 51, "롯데 선발 이슈가 생각보다 빠르게 드러났습니다."),
    ai("DeepSeek", "홈승", "4:3", "Under", 59, "낮은 총점 접근은 맞았고 승패 방향도 일치했습니다."),
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
  history("h-003", "2026-06-06", "축구", "K리그1", "울산 HD vs 포항", "DeepSeek", "Under", "1:0", true, 66),
  history("h-004", "2026-06-06", "농구", "KBL", "원주 DB vs 창원 LG", "Gemini", "홈승", "DB 81:77 LG", true, 64),
  history("h-005", "2026-06-05", "e스포츠", "LCK", "DK vs HLE", "GPT", "원정승", "DK 1:2 HLE", true, 61),
  history("h-006", "2026-06-05", "배구", "VNL", "대한민국 vs 브라질", "DeepSeek", "원정승", "대한민국 0:3 브라질", true, 69),
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
  combinationOdds: 0,
}));

export const combinations: Combination[] = aiModels.slice(0, 3).map((model, index) => ({
  id: `combo-${index + 1}`,
  date: "2026-06-08",
  aiName: model.name,
  style: model.description,
  stake: 0,
  totalOdds: 0,
  potentialReturn: 0,
  status: "대기중",
  result: "예정 경기",
  profit: 0,
  selections: analysisMatches.slice(index, index + 3).map((match) => ({
    analysisId: match.id,
    match: match.match,
    league: match.league,
    sport: match.sport,
    prediction: match.analyses.find((analysis) => analysis.aiName === model.name)?.prediction ?? "관망",
    odds: 0,
  })),
}));

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
  potentialProfit: 0,
  potentialReturn: combination.potentialReturn,
  status: combination.status,
  result: combination.result,
  profit: combination.profit,
}));

export const aiProfiles = rankingStats.map(({ id, name, initials, analysisStyle, investmentPhilosophy, signatureTraits, strategy, strategyDescription }) => ({
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
    title: "커뮤니티 메뉴는 추후 스포츠 토론 기능으로 확장 예정입니다.",
    author: "AI Sports Hub",
    createdAt: "2026-06-08 09:00",
    views: 128,
    comments: 0,
    likes: 12,
    body: "현재는 메뉴와 기본 구조만 유지하고, 향후 경기별 댓글과 유저 예측 기능을 연결할 예정입니다.",
    commentList: [],
  },
];

export const getRankedAis = () =>
  [...aiCompetitors].sort((a, b) => b.accuracy - a.accuracy);

export const getTodayCombinations = () => combinations;

export const getSettledCombinations = () =>
  allCombinations.filter((combination) => combination.status !== "대기중");

export const getAverageRoi = () =>
  aiCompetitors.reduce((total, ai) => total + ai.accuracy, 0) / aiCompetitors.length;

export const getAnalysisMatch = (id: string) =>
  analysisMatches.find((match) => match.id === id);

export const getMostDivisiveMatch = () =>
  [...analysisMatches].sort((a, b) => a.consensusScore - b.consensusScore)[0];

export const getStrongConsensusMatch = () =>
  [...analysisMatches].sort((a, b) => b.consensusScore - a.consensusScore)[0];

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
    strengths: ["최근 경기 지표 양호", "핵심 선수 활용 가능", "상대 약점 공략 여지"],
    risks: ["라인업 변경 가능성", "초반 실점 또는 흐름 변수"],
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
