export type Sport = "축구" | "야구" | "농구" | "테니스" | "Formula 1" | "아이스하키" | "e스포츠";

export type CombinationStatus = "대기중" | "적중" | "미적중";

export type AIStyle = "데이터 안정형" | "균형 분석형" | "변동성 탐색형";

export type CommunityCategory = "자유게시판" | "경기분석" | "픽공유" | "질문답변" | "AI토론";

export type ConsensusLabel = "Strong Consensus" | "Partial Consensus" | "Split Opinion";

export type DecisionStatus = "조합 포함" | "후보만 선정" | "최종 제외";

export type MatchStatus = "scheduled" | "live" | "final";

export type Match = {
  id: string;
  sport: Sport;
  league: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  status: MatchStatus;
  homeScore?: number;
  awayScore?: number;
  headline?: string;
  odds?: {
    home?: number;
    away?: number;
    draw?: number;
  };
};

export type Prediction = {
  aiName: string;
  matchId: string;
  pick: string;
  confidence: number;
  predictedScore?: string;
  predictedTotal?: number;
  analysis: {
    angle: string;
    decisionStatus: DecisionStatus;
    decisionReason: string;
    summary: string;
    strengths: string[];
    risks: string[];
    roiChange?: number;
  };
};

export type CombinationLeg = {
  matchId: string;
  pick: string;
  odds: number;
};

export type ApiCombination = {
  aiName: string;
  combinationId: string;
  date: string;
  style: AIStyle;
  legs: CombinationLeg[];
  odds: number;
  stake: number;
  potentialProfit: number;
  potentialReturn: number;
  status: CombinationStatus;
  result: string;
  profit: number;
};

export type AIDecisionProcess = {
  aiName: string;
  reviewedMatches: number;
  candidateMatches: number;
  finalSelections: number;
  excludedMatches: number;
  combinationOdds: number;
};

export type AICompetitor = {
  id: string;
  name: string;
  initials: string;
  reliabilityGrade: "A+" | "A" | "B+" | "B";
  recent30DayRoi: number;
  recent30DayAccuracy: number;
  recent30DayWins: number;
  recent30DayLosses: number;
  recent10Results: CombinationStatus[];
  recentRoiTrend: number[];
  analysisStyle: string;
  investmentPhilosophy: string;
  signatureTraits: string[];
  strategy: AIStyle;
  strategyDescription: string;
  bestHitCombination: string;
  bestHitOdds: number;
  startingBalance: number;
  currentBalance: number;
  totalProfit: number;
  roi: number;
  accuracy: number;
  totalPicks: number;
  wins: number;
  losses: number;
  battleWins: number;
  battleLosses: number;
  recentResults: CombinationStatus[];
};

export type Selection = {
  analysisId: string;
  match: string;
  league: string;
  sport: Sport;
  prediction: string;
  odds: number;
};

export type Combination = {
  id: string;
  date: string;
  aiName: string;
  style: AIStyle;
  stake: number;
  totalOdds: number;
  potentialReturn: number;
  status: CombinationStatus;
  result: string;
  profit: number;
  selections: Selection[];
};

export type FeaturedMatch = {
  id: string;
  sport: Sport;
  league: string;
  match: string;
  startTime: string;
};

export type AIAnalysis = {
  aiName: string;
  prediction: string;
  expectedScore?: string;
  predictedTotal?: number;
  confidence: number;
  roiChange?: number;
  analysisAngle: string;
  decisionStatus: DecisionStatus;
  decisionReason: string;
  summary: string;
  strengths: string[];
  risks: string[];
};

export type AnalysisMatch = {
  id: string;
  match: string;
  sport: Sport;
  league: string;
  startTime: string;
  headline: string;
  consensusScore: number;
  consensusLabel: ConsensusLabel;
  actualResult?: string;
  analyses: AIAnalysis[];
};

export type CommunityComment = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
};

export type CommunityPost = {
  id: string;
  category: CommunityCategory;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  comments: number;
  likes: number;
  body: string;
  commentList: CommunityComment[];
};
