import type { AnalysisMatch, Match } from "@/lib/types";

type AiTemplate = {
  aiName: "GPT" | "Gemini" | "DeepSeek";
  confidence: number;
  angle: string;
  decisionStatus: "조합 포함" | "후보만 선정" | "최종 제외";
};

const aiTemplates: AiTemplate[] = [
  {
    aiName: "GPT",
    confidence: 58,
    angle: "시장 배당과 기본 전력 기반 분석",
    decisionStatus: "후보만 선정",
  },
  {
    aiName: "Gemini",
    confidence: 56,
    angle: "최근 흐름과 홈/원정 균형 분석",
    decisionStatus: "후보만 선정",
  },
  {
    aiName: "DeepSeek",
    confidence: 52,
    angle: "배당 가치와 업셋 가능성 분석",
    decisionStatus: "최종 제외",
  },
];

export function createTemporaryMlbAnalysis(match: Match): AnalysisMatch {
  const picks = createMlbPicks(match);
  const consensusScore = getConsensusScore(picks.map((pick) => pick.pick));

  return {
    id: match.id,
    match: `${match.homeTeam} vs ${match.awayTeam}`,
    sport: match.sport,
    league: match.league,
    startTime: match.startTime,
    headline: match.headline ?? "The Odds API에서 불러온 실제 MLB 경기입니다. AI 분석은 임시 더미 로직으로 생성됩니다.",
    consensusScore,
    consensusLabel: consensusScore === 100 ? "Strong Consensus" : consensusScore >= 67 ? "Partial Consensus" : "Split Opinion",
    analyses: aiTemplates.map((template, index) => {
      const pick = picks[index];
      return {
        aiName: template.aiName,
        prediction: pick.pick,
        expectedScore: `${match.homeTeam} ${pick.homeScore} : ${pick.awayScore} ${match.awayTeam}`,
        predictedTotal: pick.homeScore + pick.awayScore,
        confidence: template.confidence,
        analysisAngle: template.angle,
        decisionStatus: template.decisionStatus,
        decisionReason: createDecisionReason(template.aiName, match, pick.pick),
        summary: createSummary(template.aiName, match, pick.pick),
        strengths: createStrengths(template.aiName, match),
        risks: createRisks(template.aiName),
      };
    }),
  };
}

function createMlbPicks(match: Match) {
  const homeOdds = match.odds?.home;
  const awayOdds = match.odds?.away;
  const favorite = homeOdds && awayOdds && awayOdds < homeOdds ? "away" : "home";
  const underdog = favorite === "home" ? "away" : "home";
  const gptSide = favorite;
  const geminiSide = favorite;
  const deepSeekSide = homeOdds && awayOdds && Math.abs(homeOdds - awayOdds) >= 0.35 ? underdog : favorite;

  return [createPick(match, gptSide, 0), createPick(match, geminiSide, 1), createPick(match, deepSeekSide, 2)];
}

function createPick(match: Match, side: "home" | "away", index: number) {
  const scores = side === "home" ? [[5, 3], [6, 4], [4, 2]] : [[3, 5], [4, 6], [2, 4]];
  const [homeScore, awayScore] = scores[index % scores.length];
  const team = side === "home" ? match.homeTeam : match.awayTeam;

  return {
    pick: `${team} 승`,
    homeScore,
    awayScore,
  };
}

function getConsensusScore(picks: string[]) {
  const counts = picks.reduce<Record<string, number>>((acc, pick) => {
    acc[pick] = (acc[pick] ?? 0) + 1;
    return acc;
  }, {});

  return Math.round((Math.max(...Object.values(counts)) / picks.length) * 100);
}

function createDecisionReason(aiName: string, match: Match, pick: string) {
  if (aiName === "GPT") {
    return `${pick} 방향은 현재 배당과 기본 전력 안정성을 기준으로 임시 후보에 포함했습니다.`;
  }

  if (aiName === "Gemini") {
    return `${match.homeTeam} 홈 흐름과 ${match.awayTeam} 원정 변수를 함께 비교해 ${pick}을 우선 검토했습니다.`;
  }

  return `대중적인 방향과 반대 가치가 있는지 확인하며 ${pick} 가능성을 임시 분석했습니다.`;
}

function createSummary(aiName: string, match: Match, pick: string) {
  if (aiName === "GPT") {
    return `배당 데이터와 경기 기본 조건을 기준으로 ${pick} 쪽의 안정성을 더 높게 봅니다.`;
  }

  if (aiName === "Gemini") {
    return `홈/원정 흐름과 경기 시작 시간 변수를 함께 고려하면 ${pick}이 근소하게 앞섭니다.`;
  }

  return `시장 배당에 숨어 있는 반대 방향 가능성을 점검했으며, ${pick}은 변동성 있는 선택입니다.`;
}

function createStrengths(aiName: string, match: Match) {
  if (aiName === "GPT") {
    return ["배당 기반 기본 우위", "선발 매치업 사전 검토 가능"];
  }

  if (aiName === "Gemini") {
    return ["홈/원정 밸런스 비교", `${match.league} 경기 흐름 반영`];
  }

  return ["배당 가치 탐색", "언더독 변동성 검토"];
}

function createRisks(aiName: string) {
  if (aiName === "GPT") {
    return ["라인업 최종 변경", "불펜 운용 변수"];
  }

  if (aiName === "Gemini") {
    return ["초반 실점 변수", "최근 컨디션 데이터 부족"];
  }

  return ["예측 신뢰도 낮음", "시장 반대 선택의 변동성"];
}
