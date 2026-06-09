export type Sport = "축구" | "야구" | "농구" | "배구" | "e스포츠" | "테니스" | "아이스하키" | "Formula 1" | string;

export type MatchStatus = "scheduled" | "live" | "final";
export type MatchResultPick = "홈승" | "무승부" | "원정승";
export type OverUnderPick = "Over" | "Under";
export type AIModelId = "gpt" | "gemini" | "grok" | "claude" | "deepseek" | string;

export type CombinationStatus = "대기중" | "적중" | "미적중" | string;
export type AIStyle = string;
export type CommunityCategory = string;
export type ConsensusLabel = "Strong Consensus" | "Partial Consensus" | "Split Opinion";
export type DecisionStatus = "추천" | "관망" | "제외" | string;

export type AIModel = {
  id: AIModelId;
  name: string;
  initials: string;
  description: string;
  color: string;
};

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
  venue?: string;
  headline?: string;
  popularity?: number;
  odds?: {
    home?: number;
    away?: number;
    draw?: number;
  };
};

export type Prediction = {
  aiName: string;
  matchId: string;
  pick: MatchResultPick | string;
  confidence: number;
  predictedScore?: string;
  predictedTotal?: number;
  overUnder?: OverUnderPick;
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

export type AIAnalysis = {
  aiName: string;
  prediction: MatchResultPick | string;
  expectedScore?: string;
  predictedTotal?: number;
  overUnder?: OverUnderPick;
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
  status?: MatchStatus;
  homeTeam?: string;
  awayTeam?: string;
  homeScore?: number;
  awayScore?: number;
  venue?: string;
  recentForm?: string[];
  headToHead?: Array<{ date: string; result: string; note: string }>;
  standings?: Array<{ rank: number; team: string; played: number; points: number; form: string }>;
  analyses: AIAnalysis[];
};

export type AICompetitor = {
  id: string;
  name: string;
  initials: string;
  reliabilityGrade: "A+" | "A" | "B+" | "B" | "C";
  recent30DayRoi: number;
  recent30DayAccuracy: number;
  recent30DayWins: number;
  recent30DayLosses: number;
  recent10Results: CombinationStatus[];
  recentResults: CombinationStatus[];
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
  sportStats?: Array<{ sport: Sport; accuracy: number; picks: number }>;
};

export type AIDecisionProcess = {
  aiName: string;
  reviewedMatches: number;
  candidateMatches: number;
  finalSelections: number;
  excludedMatches: number;
  combinationOdds: number;
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

export type FeaturedMatch = {
  id: string;
  sport: Sport;
  league: string;
  match: string;
  startTime: string;
};

export type PredictionHistoryRecord = {
  id: string;
  date: string;
  sport: Sport;
  league: string;
  match: string;
  aiName: string;
  prediction: string;
  result: string;
  hit: boolean;
  confidence: number;
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
