import type { AIDecisionProcess, AICompetitor, AnalysisMatch, ApiCombination, Combination, CommunityPost, FeaturedMatch, Match, Prediction } from "./types";

export const rankingStats: AICompetitor[] = [
  {
    id: "gpt",
    name: "GPT",
    initials: "GP",
    reliabilityGrade: "A",
    recent30DayRoi: 8.6,
    recent30DayAccuracy: 68,
    recent30DayWins: 34,
    recent30DayLosses: 16,
    recent10Results: ["적중", "적중", "미적중", "적중", "적중", "적중", "미적중", "적중", "미적중", "적중"],
    recentRoiTrend: [4.2, 5.1, 3.8, 5.7, 6.4, 7.2, 5.9, 8.1, 7.4, 8.6],
    analysisStyle: "데이터 분석형",
    investmentPhilosophy: "높은 적중률을 우선하는 안정적인 전략",
    signatureTraits: ["최근 경기 데이터", "선발투수", "팀 전력", "평균 득점"],
    strategy: "데이터 안정형",
    strategyDescription: "리스크를 줄이는 선택을 선호하지만, 상황에 따라 3~5폴더 조합 가능",
    bestHitCombination: "EPL + KBO + LCK 판단 조합",
    bestHitOdds: 7.18,
    startingBalance: 1000,
    currentBalance: 1086,
    totalProfit: 86,
    roi: 8.6,
    accuracy: 70.6,
    totalPicks: 17,
    wins: 11,
    losses: 6,
    battleWins: 42,
    battleLosses: 28,
    recentResults: ["적중", "미적중", "적중", "미적중", "적중"],
  },
  {
    id: "gemini",
    name: "Gemini",
    initials: "GE",
    reliabilityGrade: "B+",
    recent30DayRoi: 17.2,
    recent30DayAccuracy: 58,
    recent30DayWins: 29,
    recent30DayLosses: 21,
    recent10Results: ["미적중", "적중", "적중", "미적중", "적중", "적중", "적중", "미적중", "적중", "미적중"],
    recentRoiTrend: [11.6, 9.8, 12.4, 10.2, 13.7, 15.1, 18.3, 16.5, 19.4, 17.2],
    analysisStyle: "균형 분석형",
    investmentPhilosophy: "흐름과 데이터를 함께 고려하는 전략",
    signatureTraits: ["최근 경기 흐름", "홈/원정", "선수 컨디션", "공수 밸런스"],
    strategy: "균형 분석형",
    strategyDescription: "수익률과 적중 가능성을 함께 고려해 3~5폴더 조합 가능",
    bestHitCombination: "KBO + EPL + LCK 판단 조합",
    bestHitOdds: 10.64,
    startingBalance: 1000,
    currentBalance: 958,
    totalProfit: -42,
    roi: -4.2,
    accuracy: 58.8,
    totalPicks: 17,
    wins: 10,
    losses: 7,
    battleWins: 38,
    battleLosses: 32,
    recentResults: ["적중", "적중", "미적중", "적중", "미적중"],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    initials: "DS",
    reliabilityGrade: "B",
    recent30DayRoi: -12.4,
    recent30DayAccuracy: 43,
    recent30DayWins: 21,
    recent30DayLosses: 28,
    recent10Results: ["미적중", "미적중", "적중", "미적중", "미적중", "적중", "미적중", "미적중", "적중", "미적중"],
    recentRoiTrend: [21.4, 18.2, 26.8, 14.1, 7.5, 15.8, 4.2, -3.1, -8.6, -12.4],
    analysisStyle: "가치 탐색형",
    investmentPhilosophy: "시장과 다른 기회를 찾는 전략",
    signatureTraits: ["배당 가치", "시장 과열", "숨은 변수", "업셋 가능성"],
    strategy: "변동성 탐색형",
    strategyDescription: "배당 매력이 있는 조합을 적극 검토하지만, 3~5폴더 안에서 자유롭게 구성",
    bestHitCombination: "KBO + EPL + LCK 판단 조합",
    bestHitOdds: 15.34,
    startingBalance: 1000,
    currentBalance: 1434,
    totalProfit: 434,
    roi: 43.4,
    accuracy: 47.1,
    totalPicks: 17,
    wins: 8,
    losses: 9,
    battleWins: 35,
    battleLosses: 35,
    recentResults: ["미적중", "적중", "미적중", "미적중", "적중"],
  },
];

export const aiCompetitors = rankingStats;

export const decisionProcesses: AIDecisionProcess[] = [
  {
    aiName: "GPT",
    reviewedMatches: 84,
    candidateMatches: 12,
    finalSelections: 3,
    excludedMatches: 72,
    combinationOdds: 4.85,
  },
  {
    aiName: "Gemini",
    reviewedMatches: 84,
    candidateMatches: 15,
    finalSelections: 5,
    excludedMatches: 69,
    combinationOdds: 16.58,
  },
  {
    aiName: "DeepSeek",
    reviewedMatches: 84,
    candidateMatches: 18,
    finalSelections: 3,
    excludedMatches: 66,
    combinationOdds: 5.88,
  },
];

const baseAnalysisMatches: AnalysisMatch[] = [
  {
    id: "lg-kia",
    match: "LG Twins vs KIA Tigers",
    sport: "야구",
    league: "KBO",
    startTime: "2026-06-01 18:30",
    headline: "선발 매치업과 불펜 변수가 갈리는 KBO 핵심 경기",
    consensusScore: 67,
    consensusLabel: "Partial Consensus",
    actualResult: "LG 승",
    analyses: [
      {
        aiName: "GPT",
        prediction: "LG 승",
        confidence: 58,
        roiChange: 145,
        analysisAngle: "최근 승률 기반 분석",
        decisionStatus: "조합 포함",
        decisionReason: "최근 승률 우세와 선발 매치업 신뢰도가 높아 최종 조합에 포함했습니다.",
        summary: "최근 선발투수 지표와 중심 타선 흐름에서 LG가 근소하게 앞섭니다.",
        strengths: ["선발 우위", "상위 타선 출루율 상승"],
        risks: ["불펜 소모", "초반 실점 변수"],
      },
      {
        aiName: "Gemini",
        prediction: "KIA 승",
        confidence: 57,
        roiChange: -100,
        analysisAngle: "최근 팀 흐름 기반 분석",
        decisionStatus: "조합 포함",
        decisionReason: "최근 득점력과 후반 집중력을 근거로 반대 방향 가치가 있다고 판단했습니다.",
        summary: "최근 팀 타격 상승세와 후반 집중력을 고려하면 KIA가 근소하게 승부를 뒤집을 여지가 있습니다.",
        strengths: ["최근 팀 타격 상승", "후반 집중력"],
        risks: ["선발 매치업 열세", "초반 실점 변수"],
      },
      {
        aiName: "DeepSeek",
        prediction: "LG 승",
        confidence: 55,
        roiChange: 122,
        analysisAngle: "배당 가치 기반 분석",
        decisionStatus: "최종 제외",
        decisionReason: "배당 가치는 보였지만 전력 열세와 변동성이 커 최종 조합에서는 제외했습니다.",
        summary: "시장 관심이 KIA 쪽 변동성에 쏠렸지만, 배당 대비 LG의 기본 전력 가치가 더 남아 있습니다.",
        strengths: ["배당 가치 존재", "기본 전력 우위"],
        risks: ["불펜 변수", "상대 타선 반등"],
      },
    ],
  },
  {
    id: "hanwha-lotte",
    match: "한화 Eagles vs 롯데 Giants",
    sport: "야구",
    league: "KBO",
    startTime: "2026-06-01 18:30",
    headline: "득점 흐름은 좋지만 총점 라인이 관건인 경기",
    consensusScore: 100,
    consensusLabel: "Strong Consensus",
    analyses: [
      {
        aiName: "GPT",
        prediction: "언더 8.5",
        confidence: 54,
        analysisAngle: "실점 지표 기반 분석",
        decisionStatus: "후보만 선정",
        decisionReason: "실점 지표는 안정적이지만 불펜 변수 때문에 최종 선택까지는 가지 않았습니다.",
        summary: "양 팀 선발이 초반 실점을 억제할 가능성이 있어 언더 쪽을 우선합니다.",
        strengths: ["선발 안정감", "초반 득점 억제"],
        risks: ["불펜 난조", "수비 실책"],
      },
      {
        aiName: "Gemini",
        prediction: "언더 8.5",
        confidence: 54,
        analysisAngle: "최근 득점 흐름 기반 분석",
        decisionStatus: "조합 포함",
        decisionReason: "득점 흐름은 좋지만 총점 라인이 높아 언더 쪽 기대값을 선택했습니다.",
        summary: "최근 득점 흐름은 좋지만 양 팀 선발 이닝 소화 가능성을 함께 보면 총점 언더가 더 균형 잡힌 선택입니다.",
        strengths: ["선발 이닝 소화", "초반 탐색전 가능성"],
        risks: ["후반 불펜 난조", "장타 변수"],
      },
      {
        aiName: "DeepSeek",
        prediction: "언더 8.5",
        confidence: 57,
        analysisAngle: "총점 라인 가치 분석",
        decisionStatus: "조합 포함",
        decisionReason: "총점 라인 대비 언더 가치가 뚜렷해 조합에 포함했습니다.",
        summary: "라인 대비 득점 기대치가 낮아 총점 언더를 더 매력적으로 봅니다.",
        strengths: ["총점 라인 가치", "초반 투수전 가능성"],
        risks: ["후반 빅이닝", "제구 난조"],
      },
    ],
  },
  {
    id: "t1-gen",
    match: "T1 vs GEN",
    sport: "e스포츠",
    league: "LCK",
    startTime: "2026-06-01 20:00",
    headline: "밴픽 방향에 따라 AI 의견이 갈리는 LCK 빅매치",
    consensusScore: 67,
    consensusLabel: "Partial Consensus",
    analyses: [
      {
        aiName: "GPT",
        prediction: "T1 승",
        confidence: 56,
        analysisAngle: "오브젝트 지표 기반 분석",
        decisionStatus: "조합 포함",
        decisionReason: "초반 오브젝트 지표와 교전 전환 기대값이 높아 선택했습니다.",
        summary: "초반 오브젝트 설계와 교전 전환 속도에서 T1의 기대값이 높습니다.",
        strengths: ["초반 설계", "교전 전환"],
        risks: ["후반 운영", "드래프트 변수"],
      },
      {
        aiName: "Gemini",
        prediction: "GEN 승",
        confidence: 53,
        analysisAngle: "최근 운영 흐름 기반 분석",
        decisionStatus: "조합 포함",
        decisionReason: "운영 안정성과 최근 맞대결 흐름을 근거로 최종 선택했습니다.",
        summary: "최근 맞대결 기준 GEN의 안정적인 운영 완성도가 더 높게 평가됩니다.",
        strengths: ["운영 안정성", "후반 집중력"],
        risks: ["초반 손실", "밴픽 꼬임"],
      },
      {
        aiName: "DeepSeek",
        prediction: "GEN 승",
        confidence: 52,
        analysisAngle: "밴픽 변수 가치 분석",
        decisionStatus: "조합 포함",
        decisionReason: "밴픽 변수에도 배당 대비 기대값이 남아 조합에 포함했습니다.",
        summary: "시장 기대보다 GEN의 밴픽 대응력과 후반 운영 안정성이 더 크게 반영될 가능성이 있습니다.",
        strengths: ["밴픽 대응력", "후반 운영 안정성"],
        risks: ["초반 주도권 상실", "변칙 픽 대응"],
      },
    ],
  },
  {
    id: "mancity-liverpool",
    match: "맨시티 vs 리버풀",
    sport: "축구",
    league: "EPL",
    startTime: "2026-06-01 21:30",
    headline: "압박 강도와 전환 속도가 승부를 가를 EPL 메인 매치",
    consensusScore: 67,
    consensusLabel: "Partial Consensus",
    analyses: [
      {
        aiName: "GPT",
        prediction: "맨시티 승",
        confidence: 59,
        analysisAngle: "팀 전력 지표 기반 분석",
        decisionStatus: "조합 포함",
        decisionReason: "홈 경기 전력 지표와 찬스 생성 수치가 우세해 선택했습니다.",
        summary: "홈 점유율과 박스 근처 찬스 생성 빈도에서 맨시티 우세를 봅니다.",
        strengths: ["홈 점유율", "중앙 침투"],
        risks: ["역습 실점", "세트피스 수비"],
      },
      {
        aiName: "Gemini",
        prediction: "맨시티 승",
        confidence: 57,
        analysisAngle: "공격 흐름 기반 분석",
        decisionStatus: "조합 포함",
        decisionReason: "공격 흐름과 득점 기대값이 좋아 최종 조합에 넣었습니다.",
        summary: "양 팀 모두 전환 속도가 빨라 득점 기대값이 높습니다.",
        strengths: ["높은 득점 기대값", "빠른 전환"],
        risks: ["초반 탐색전", "결정력 저하"],
      },
      {
        aiName: "DeepSeek",
        prediction: "무승부",
        confidence: 52,
        analysisAngle: "시장 과열 역방향 분석",
        decisionStatus: "후보만 선정",
        decisionReason: "시장 과열 반대 관점은 유효하지만 승부 변수가 커 후보로만 남겼습니다.",
        summary: "리버풀의 압박 회복력이 핸디캡 시장에서 가치가 있습니다.",
        strengths: ["전방 압박", "핸디캡 가치"],
        risks: ["수비 뒷공간", "원정 변수"],
      },
    ],
  },
  {
    id: "kt-ssg",
    match: "KT Wiz vs SSG Landers",
    sport: "야구",
    league: "KBO",
    startTime: "2026-06-01 18:30",
    headline: "승패보다 핸디캡 해석이 중요한 KBO 경기",
    consensusScore: 67,
    consensusLabel: "Partial Consensus",
    analyses: [
      {
        aiName: "GPT",
        prediction: "SSG +1.5",
        confidence: 56,
        analysisAngle: "핸디캡 안정성 분석",
        decisionStatus: "후보만 선정",
        decisionReason: "접전 가능성은 높지만 조합 내 우선순위에서 밀려 후보로 분류했습니다.",
        summary: "접전 흐름 가능성이 높아 핸디캡 접근이 더 안정적입니다.",
        strengths: ["접전 가능성", "불펜 뎁스"],
        risks: ["초반 대량 실점", "타선 침묵"],
      },
      {
        aiName: "Gemini",
        prediction: "SSG +1.5",
        confidence: 55,
        analysisAngle: "후반 추격 흐름 분석",
        decisionStatus: "조합 포함",
        decisionReason: "후반 추격력과 핸디캡 안정성을 높게 평가해 조합에 포함했습니다.",
        summary: "최근 실점 관리가 개선되어 큰 점수 차 패배 가능성은 낮게 봅니다.",
        strengths: ["실점 관리", "후반 추격력"],
        risks: ["선발 제구", "득점권 부진"],
      },
      {
        aiName: "DeepSeek",
        prediction: "KT 승",
        confidence: 53,
        analysisAngle: "승패 시장 가치 분석",
        decisionStatus: "조합 포함",
        decisionReason: "상위 타선 기대값과 시장 배당 가치가 맞아 선택했습니다.",
        summary: "KT의 상위 타선 기대값이 승패 시장에서 살아 있습니다.",
        strengths: ["상위 타선", "홈 분위기"],
        risks: ["불펜 변수", "핸디캡 부담"],
      },
    ],
  },
  {
    id: "seoul-kcc",
    match: "서울 SK vs 부산 KCC",
    sport: "농구",
    league: "KBL",
    startTime: "2026-06-01 19:00",
    headline: "페이스와 외곽 성공률 변수가 큰 KBL 주요 경기",
    consensusScore: 67,
    consensusLabel: "Partial Consensus",
    analyses: [
      {
        aiName: "GPT",
        prediction: "서울 SK 승",
        confidence: 57,
        analysisAngle: "홈 득실 지표 분석",
        decisionStatus: "후보만 선정",
        decisionReason: "홈 득실 지표는 우세하지만 외곽 변동성이 있어 최종 조합에서는 제외했습니다.",
        summary: "홈 경기 득점 효율과 리바운드 지표에서 서울 SK가 근소하게 앞섭니다.",
        strengths: ["홈 득점 효율", "리바운드 우위"],
        risks: ["외곽 성공률 변동", "벤치 득점 기복"],
      },
      {
        aiName: "Gemini",
        prediction: "서울 SK 승",
        confidence: 59,
        analysisAngle: "최근 경기 흐름 분석",
        decisionStatus: "조합 포함",
        decisionReason: "최근 공격 흐름과 홈 이점이 함께 확인되어 오늘 조합에 포함했습니다.",
        summary: "최근 공격 템포가 안정적이고 홈에서 턴오버 관리가 개선된 점이 긍정적입니다.",
        strengths: ["최근 공격 흐름", "홈 코트 이점"],
        risks: ["파울 트러블", "4쿼터 집중력"],
      },
      {
        aiName: "DeepSeek",
        prediction: "부산 KCC +3.5",
        confidence: 52,
        analysisAngle: "핸디캡 가치 분석",
        decisionStatus: "최종 제외",
        decisionReason: "핸디캡 가치는 있지만 최근 부진 흐름을 고려해 최종 선택에서는 제외했습니다.",
        summary: "시장 기대보다 접전 가능성이 남아 있지만 변동성이 큰 경기입니다.",
        strengths: ["핸디캡 가치", "접전 가능성"],
        risks: ["최근 야투 난조", "원정 경기 부담"],
      },
    ],
  },
];

function createUpcomingMatch({
  id,
  match,
  sport,
  league,
  startTime,
  headline,
  gpt,
  gemini,
  deepseek,
  consensusScore = 67,
  consensusLabel = "Partial Consensus",
}: {
  id: string;
  match: string;
  sport: AnalysisMatch["sport"];
  league: string;
  startTime: string;
  headline: string;
  gpt: string;
  gemini: string;
  deepseek: string;
  consensusScore?: AnalysisMatch["consensusScore"];
  consensusLabel?: AnalysisMatch["consensusLabel"];
}): AnalysisMatch {
  return {
    id,
    match,
    sport,
    league,
    startTime,
    headline,
    consensusScore,
    consensusLabel,
    analyses: [
      {
        aiName: "GPT",
        prediction: gpt,
        confidence: 58,
        analysisAngle: "데이터 기반 사전 분석",
        decisionStatus: "후보만 선정",
        decisionReason: "기본 지표는 긍정적이지만 조합 우선순위에서는 후보로 분류했습니다.",
        summary: "최근 경기 지표와 전력 안정성을 기준으로 가장 가능성이 높은 방향을 선택했습니다.",
        strengths: ["최근 지표 안정성", "기본 전력 우세"],
        risks: ["라인업 변수", "초반 흐름 변동"],
      },
      {
        aiName: "Gemini",
        prediction: gemini,
        confidence: 56,
        analysisAngle: "최근 흐름 기반 분석",
        decisionStatus: "후보만 선정",
        decisionReason: "최근 경기 흐름은 좋지만 변수가 남아 최종 조합에는 포함하지 않았습니다.",
        summary: "최근 컨디션과 홈/원정 흐름을 함께 고려하면 접전 가능성이 있습니다.",
        strengths: ["최근 경기 흐름", "컨디션 상승"],
        risks: ["후반 집중력", "상대 맞춤 전략"],
      },
      {
        aiName: "DeepSeek",
        prediction: deepseek,
        confidence: 52,
        analysisAngle: "배당 가치 기반 분석",
        decisionStatus: "최종 제외",
        decisionReason: "배당 가치는 있지만 변동성이 커 최종 선택에서는 제외했습니다.",
        summary: "시장 기대와 다른 결과 가능성을 검토했지만 리스크가 높은 경기입니다.",
        strengths: ["배당 가치", "업셋 가능성"],
        risks: ["변수 과다", "예측 신뢰도 부족"],
      },
    ],
  };
}

const upcomingAnalysisMatches: AnalysisMatch[] = [
  createUpcomingMatch({
    id: "arsenal-chelsea",
    match: "아스널 vs 첼시",
    sport: "축구",
    league: "EPL",
    startTime: "2026-06-01 23:30",
    headline: "런던 더비 흐름과 압박 강도가 변수인 EPL 경기",
    gpt: "아스널 승",
    gemini: "아스널 승",
    deepseek: "무승부",
  }),
  createUpcomingMatch({
    id: "psg-dortmund",
    match: "PSG vs 도르트문트",
    sport: "축구",
    league: "UEFA",
    startTime: "2026-06-02 04:00",
    headline: "전환 속도와 원정 수비 집중력이 중요한 UEFA 매치",
    gpt: "PSG 승",
    gemini: "오버 2.5",
    deepseek: "도르트문트 +1.0",
    consensusScore: 33,
    consensusLabel: "Split Opinion",
  }),
  createUpcomingMatch({
    id: "la-ny",
    match: "LA Lakers vs New York Knicks",
    sport: "농구",
    league: "NBA",
    startTime: "2026-06-02 10:30",
    headline: "페인트존 득점과 외곽 수비 매치업이 갈리는 NBA 경기",
    gpt: "LA Lakers 승",
    gemini: "LA Lakers 승",
    deepseek: "New York +4.5",
  }),
  createUpcomingMatch({
    id: "db-mobis",
    match: "원주 DB vs 울산 현대모비스",
    sport: "농구",
    league: "KBL",
    startTime: "2026-06-01 19:30",
    headline: "리바운드 우위와 턴오버 관리가 중요한 KBL 경기",
    gpt: "원주 DB 승",
    gemini: "언더 162.5",
    deepseek: "울산 현대모비스 +3.5",
    consensusScore: 33,
    consensusLabel: "Split Opinion",
  }),
  createUpcomingMatch({
    id: "dodgers-padres",
    match: "LA Dodgers vs San Diego Padres",
    sport: "야구",
    league: "MLB",
    startTime: "2026-06-02 11:10",
    headline: "선발 매치업과 장타 억제력이 핵심인 MLB 경기",
    gpt: "Dodgers 승",
    gemini: "Dodgers 승",
    deepseek: "Padres +1.5",
  }),
  createUpcomingMatch({
    id: "sinner-alcaraz",
    match: "Sinner vs Alcaraz",
    sport: "테니스",
    league: "ATP",
    startTime: "2026-06-01 21:00",
    headline: "서브 게임 유지력과 랠리 주도권이 갈리는 ATP 빅매치",
    gpt: "Alcaraz 승",
    gemini: "오버 22.5",
    deepseek: "Sinner 승",
    consensusScore: 33,
    consensusLabel: "Split Opinion",
  }),
  createUpcomingMatch({
    id: "swiatek-gauff",
    match: "Swiatek vs Gauff",
    sport: "테니스",
    league: "WTA",
    startTime: "2026-06-01 23:00",
    headline: "리턴 게임과 클레이 코트 적응력이 중요한 WTA 경기",
    gpt: "Swiatek 승",
    gemini: "Swiatek 승",
    deepseek: "Gauff +1.5세트",
    consensusScore: 67,
  }),
  createUpcomingMatch({
    id: "djokovic-medvedev",
    match: "Djokovic vs Medvedev",
    sport: "테니스",
    league: "ATP",
    startTime: "2026-06-02 01:30",
    headline: "긴 랠리 안정성과 세트 초반 브레이크가 변수인 경기",
    gpt: "Djokovic 승",
    gemini: "언더 23.5",
    deepseek: "Medvedev 승",
    consensusScore: 33,
    consensusLabel: "Split Opinion",
  }),
  createUpcomingMatch({
    id: "monaco-gp-qualifying",
    match: "Monaco GP Qualifying",
    sport: "Formula 1",
    league: "F1",
    startTime: "2026-06-01 22:00",
    headline: "트랙 포지션과 예선 랩 완성도가 승부를 가르는 F1 세션",
    gpt: "Verstappen Pole",
    gemini: "Leclerc Top 3",
    deepseek: "Norris Top 3",
    consensusScore: 33,
    consensusLabel: "Split Opinion",
  }),
  createUpcomingMatch({
    id: "silverstone-race",
    match: "British GP Race",
    sport: "Formula 1",
    league: "F1",
    startTime: "2026-06-02 23:00",
    headline: "타이어 관리와 세이프티카 변수가 큰 실버스톤 레이스",
    gpt: "Verstappen 우승",
    gemini: "McLaren Podium",
    deepseek: "비 예보 변수",
  }),
  createUpcomingMatch({
    id: "suzuka-race",
    match: "Japanese GP Race",
    sport: "Formula 1",
    league: "F1",
    startTime: "2026-06-03 14:00",
    headline: "섹터 1 밸런스와 언더컷 타이밍이 중요한 스즈카 레이스",
    gpt: "Red Bull 우세",
    gemini: "Ferrari Top 3",
    deepseek: "Mercedes Podium",
    consensusScore: 33,
    consensusLabel: "Split Opinion",
  }),
  createUpcomingMatch({
    id: "rangers-bruins",
    match: "New York Rangers vs Boston Bruins",
    sport: "아이스하키",
    league: "NHL",
    startTime: "2026-06-02 08:00",
    headline: "골리 컨디션과 파워플레이 효율이 중요한 NHL 경기",
    gpt: "Rangers 승",
    gemini: "언더 5.5",
    deepseek: "Bruins 승",
    consensusScore: 33,
    consensusLabel: "Split Opinion",
  }),
  createUpcomingMatch({
    id: "leafs-canadiens",
    match: "Toronto Maple Leafs vs Montreal Canadiens",
    sport: "아이스하키",
    league: "NHL",
    startTime: "2026-06-02 09:00",
    headline: "라이벌전 특유의 페널티 관리가 승부를 가를 경기",
    gpt: "Maple Leafs 승",
    gemini: "Maple Leafs 승",
    deepseek: "Canadiens +1.5",
  }),
  createUpcomingMatch({
    id: "oilers-stars",
    match: "Edmonton Oilers vs Dallas Stars",
    sport: "아이스하키",
    league: "NHL",
    startTime: "2026-06-02 10:00",
    headline: "상위 라인 득점력과 수비 전환 속도가 중요한 경기",
    gpt: "Oilers 승",
    gemini: "오버 6.0",
    deepseek: "Stars 승",
    consensusScore: 33,
    consensusLabel: "Split Opinion",
  }),
  createUpcomingMatch({
    id: "geng-hle",
    match: "GEN vs HLE",
    sport: "e스포츠",
    league: "LCK",
    startTime: "2026-06-02 18:00",
    headline: "초반 오브젝트 설계와 한타 집중력이 중요한 LCK 경기",
    gpt: "GEN 승",
    gemini: "GEN 승",
    deepseek: "HLE +1.5",
  }),
  createUpcomingMatch({
    id: "blg-tes",
    match: "BLG vs TES",
    sport: "e스포츠",
    league: "LPL",
    startTime: "2026-06-02 20:00",
    headline: "라인전 주도권과 교전 빈도가 높은 LPL 매치",
    gpt: "BLG 승",
    gemini: "오버 2.5맵",
    deepseek: "TES 승",
    consensusScore: 33,
    consensusLabel: "Split Opinion",
  }),
  createUpcomingMatch({
    id: "drx-prx",
    match: "DRX vs PRX",
    sport: "e스포츠",
    league: "Valorant",
    startTime: "2026-06-02 21:30",
    headline: "맵 밴픽과 피스톨 라운드 성공률이 중요한 발로란트 경기",
    gpt: "DRX 승",
    gemini: "DRX 승",
    deepseek: "PRX 승",
    consensusScore: 67,
  }),
];

function addExpectedScores(match: AnalysisMatch): AnalysisMatch {
  const [home, away = "상대"] = splitMatchTeams(match.match);

  return {
    ...match,
    analyses: match.analyses.map((analysis, index) => {
      const predictionSide = getPredictionSide(analysis.prediction, home, away);
      const preset = createScorePreset(match.sport, predictionSide, index, analysis.prediction);

      return {
        ...analysis,
        expectedScore: analysis.expectedScore ?? preset.score.replaceAll("{home}", home).replaceAll("{away}", away),
        predictedTotal: analysis.predictedTotal ?? preset.total,
      };
    }),
  };
}

function splitMatchTeams(match: string) {
  return match.split(/\s+vs\s+/i);
}

function getSettledScore(match: AnalysisMatch) {
  if (!match.actualResult || match.sport === "Formula 1") {
    return undefined;
  }

  const [homeTeam, awayTeam = "상대"] = splitMatchTeams(match.match);
  const side = getPredictionSide(match.actualResult, homeTeam, awayTeam);
  const preset = createScorePreset(match.sport, side, 0, match.actualResult);
  const score = preset.score.replaceAll("{home}", homeTeam).replaceAll("{away}", awayTeam);
  const parsedScore = score.match(/\s(\d+)\s*:\s*(\d+)\s/);

  if (!parsedScore) {
    return undefined;
  }

  return {
    homeScore: Number(parsedScore[1]),
    awayScore: Number(parsedScore[2]),
  };
}

function buildAnalysisMatches(matchModels: Match[], predictionModels: Prediction[], sourceMatches: AnalysisMatch[]): AnalysisMatch[] {
  const predictionsByMatchId = predictionModels.reduce<Record<string, Prediction[]>>((acc, prediction) => {
    acc[prediction.matchId] = [...(acc[prediction.matchId] ?? []), prediction];
    return acc;
  }, {});
  const sourceById = new Map(sourceMatches.map((match) => [match.id, match]));

  return matchModels.map((match) => {
    const source = sourceById.get(match.id);
    const matchPredictions = predictionsByMatchId[match.id] ?? [];

    return {
      id: match.id,
      match: `${match.homeTeam} vs ${match.awayTeam}`,
      sport: match.sport,
      league: match.league,
      startTime: match.startTime,
      headline: match.headline ?? source?.headline ?? "",
      consensusScore: source?.consensusScore ?? getConsensusScore(matchPredictions),
      consensusLabel: source?.consensusLabel ?? getConsensusLabel(getConsensusScore(matchPredictions)),
      actualResult: source?.actualResult,
      analyses: matchPredictions.map((prediction) => ({
        aiName: prediction.aiName,
        prediction: prediction.pick,
        expectedScore: prediction.predictedScore,
        predictedTotal: prediction.predictedTotal,
        confidence: prediction.confidence,
        roiChange: prediction.analysis.roiChange,
        analysisAngle: prediction.analysis.angle,
        decisionStatus: prediction.analysis.decisionStatus,
        decisionReason: prediction.analysis.decisionReason,
        summary: prediction.analysis.summary,
        strengths: prediction.analysis.strengths,
        risks: prediction.analysis.risks,
      })),
    };
  });
}

function getConsensusScore(matchPredictions: Prediction[]) {
  if (matchPredictions.length === 0) {
    return 0;
  }

  const counts = matchPredictions.reduce<Record<string, number>>((acc, prediction) => {
    acc[prediction.pick] = (acc[prediction.pick] ?? 0) + 1;
    return acc;
  }, {});
  const highestCount = Math.max(...Object.values(counts));

  return Math.round((highestCount / matchPredictions.length) * 100);
}

function getConsensusLabel(score: number) {
  if (score === 100) {
    return "Strong Consensus";
  }

  if (score >= 67) {
    return "Partial Consensus";
  }

  return "Split Opinion";
}

function getPredictionSide(prediction: string, home: string, away: string) {
  if (prediction.includes("무승부")) {
    return "draw";
  }

  const normalizedPrediction = normalizeText(prediction);
  const homeMatched = getTeamKeywords(home).some((keyword) => normalizedPrediction.includes(keyword));
  const awayMatched = getTeamKeywords(away).some((keyword) => normalizedPrediction.includes(keyword));

  if (awayMatched && !homeMatched) {
    return "away";
  }

  return "home";
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9가-힣]/g, "");
}

function getTeamKeywords(team: string) {
  return team
    .split(/\s+/)
    .map(normalizeText)
    .filter((keyword) => keyword.length >= 2);
}

function createScorePreset(sport: AnalysisMatch["sport"], side: "home" | "away" | "draw", index: number, prediction: string) {
  if (sport === "Formula 1") {
    const podiums = [
      ["Verstappen", "Leclerc", "Norris"],
      ["Leclerc", "Norris", "Verstappen"],
      ["Norris", "Verstappen", "Hamilton"],
    ];
    const podium = podiums[index % podiums.length];

    return { score: `1위 ${podium[0]} / 2위 ${podium[1]} / 3위 ${podium[2]}`, total: undefined };
  }

  const totalDirection = getTotalDirection(prediction);

  if (totalDirection) {
    const totalScores: Record<Exclude<AnalysisMatch["sport"], "Formula 1">, Record<"under" | "over", Record<"home" | "away" | "draw", Array<[number, number]>>>> = {
      축구: {
        under: { home: [[1, 0], [2, 0], [1, 0]], away: [[0, 1], [0, 2], [0, 1]], draw: [[0, 0], [1, 1], [0, 0]] },
        over: { home: [[3, 1], [4, 2], [3, 2]], away: [[1, 3], [2, 4], [2, 3]], draw: [[2, 2], [3, 3], [2, 2]] },
      },
      야구: {
        under: { home: [[4, 2], [5, 3], [3, 2]], away: [[2, 4], [3, 5], [2, 3]], draw: [[3, 3], [4, 4], [2, 2]] },
        over: { home: [[7, 5], [8, 6], [9, 7]], away: [[5, 7], [6, 8], [7, 9]], draw: [[6, 6], [7, 7], [8, 8]] },
      },
      농구: {
        under: { home: [[78, 74], [80, 76], [77, 73]], away: [[74, 78], [76, 80], [73, 77]], draw: [[76, 76], [78, 78], [80, 80]] },
        over: { home: [[92, 88], [96, 91], [101, 94]], away: [[88, 92], [91, 96], [94, 101]], draw: [[88, 88], [92, 92], [96, 96]] },
      },
      테니스: {
        under: { home: [[2, 0], [2, 0], [2, 0]], away: [[0, 2], [0, 2], [0, 2]], draw: [[1, 1], [1, 1], [1, 1]] },
        over: { home: [[2, 1], [2, 1], [2, 1]], away: [[1, 2], [1, 2], [1, 2]], draw: [[1, 1], [1, 1], [1, 1]] },
      },
      아이스하키: {
        under: { home: [[3, 2], [2, 1], [3, 1]], away: [[2, 3], [1, 2], [1, 3]], draw: [[2, 2], [1, 1], [2, 2]] },
        over: { home: [[5, 3], [6, 3], [5, 4]], away: [[3, 5], [3, 6], [4, 5]], draw: [[4, 4], [5, 5], [3, 3]] },
      },
      e스포츠: {
        under: { home: [[2, 0], [2, 0], [2, 0]], away: [[0, 2], [0, 2], [0, 2]], draw: [[1, 1], [1, 1], [1, 1]] },
        over: { home: [[2, 1], [2, 1], [2, 1]], away: [[1, 2], [1, 2], [1, 2]], draw: [[1, 1], [1, 1], [1, 1]] },
      },
    };
    const [homeScore, awayScore] = totalScores[sport][totalDirection][side][index % totalScores[sport][totalDirection][side].length];

    return { score: `{home} ${homeScore} : ${awayScore} {away}`, total: homeScore + awayScore };
  }

  const scores: Record<Exclude<AnalysisMatch["sport"], "Formula 1">, Record<"home" | "away" | "draw", Array<[number, number]>>> = {
    축구: {
      home: [[2, 1], [3, 1], [2, 0]],
      away: [[1, 2], [0, 2], [1, 3]],
      draw: [[1, 1], [2, 2], [0, 0]],
    },
    야구: {
      home: [[6, 4], [5, 3], [7, 5]],
      away: [[4, 6], [3, 5], [5, 7]],
      draw: [[4, 4], [5, 5], [3, 3]],
    },
    농구: {
      home: [[82, 76], [84, 79], [88, 81]],
      away: [[78, 81], [79, 84], [83, 88]],
      draw: [[80, 80], [82, 82], [78, 78]],
    },
    테니스: {
      home: [[2, 0], [2, 1], [2, 0]],
      away: [[0, 2], [1, 2], [0, 2]],
      draw: [[1, 1], [1, 1], [1, 1]],
    },
    아이스하키: {
      home: [[4, 2], [3, 2], [5, 3]],
      away: [[2, 4], [2, 3], [3, 5]],
      draw: [[2, 2], [3, 3], [1, 1]],
    },
    e스포츠: {
      home: [[2, 1], [2, 0], [2, 1]],
      away: [[1, 2], [0, 2], [1, 2]],
      draw: [[1, 1], [1, 1], [1, 1]],
    },
  };
  const [homeScore, awayScore] = scores[sport][side][index % scores[sport][side].length];

  return { score: `{home} ${homeScore} : ${awayScore} {away}`, total: homeScore + awayScore };
}

function getTotalDirection(prediction: string) {
  if (prediction.includes("언더")) {
    return "under";
  }

  if (prediction.includes("오버")) {
    return "over";
  }

  return undefined;
}

const analysisSourceMatches: AnalysisMatch[] = [...baseAnalysisMatches, ...upcomingAnalysisMatches].map(addExpectedScores);

export const matches: Match[] = analysisSourceMatches.map((match) => {
  const [homeTeam, awayTeam = "상대"] = splitMatchTeams(match.match);
  const settledScore = getSettledScore(match);

  return {
    id: match.id,
    sport: match.sport,
    league: match.league,
    homeTeam,
    awayTeam,
    startTime: match.startTime,
    status: match.actualResult ? "final" : "scheduled",
    homeScore: settledScore?.homeScore,
    awayScore: settledScore?.awayScore,
    headline: match.headline,
  };
});

export const predictions: Prediction[] = analysisSourceMatches.flatMap((match) =>
  match.analyses.map((analysis) => ({
    aiName: analysis.aiName,
    matchId: match.id,
    pick: analysis.prediction,
    confidence: analysis.confidence,
    predictedScore: analysis.expectedScore,
    predictedTotal: analysis.predictedTotal,
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

export const analysisMatches: AnalysisMatch[] = buildAnalysisMatches(matches, predictions, analysisSourceMatches);

export const combinations: Combination[] = [
  {
    id: "combo-001",
    date: "2026-06-01",
    aiName: "GPT",
    style: "데이터 안정형",
    stake: 100,
    totalOdds: 4.85,
    potentialReturn: 485,
    status: "대기중",
    result: "경기 전",
    profit: 0,
    selections: [
      { analysisId: "lg-kia", match: "LG Twins vs KIA Tigers", league: "KBO", sport: "야구", prediction: "LG 승", odds: 1.55 },
      { analysisId: "mancity-liverpool", match: "맨시티 vs 리버풀", league: "EPL", sport: "축구", prediction: "맨시티 승", odds: 1.72 },
      { analysisId: "t1-gen", match: "T1 vs GEN", league: "LCK", sport: "e스포츠", prediction: "T1 승", odds: 1.82 },
    ],
  },
  {
    id: "combo-002",
    date: "2026-06-01",
    aiName: "Gemini",
    style: "균형 분석형",
    stake: 100,
    totalOdds: 16.58,
    potentialReturn: 1658,
    status: "대기중",
    result: "경기 전",
    profit: 0,
    selections: [
      { analysisId: "lg-kia", match: "LG Twins vs KIA Tigers", league: "KBO", sport: "야구", prediction: "KIA 승", odds: 2.05 },
      { analysisId: "mancity-liverpool", match: "맨시티 vs 리버풀", league: "EPL", sport: "축구", prediction: "맨시티 승", odds: 1.72 },
      { analysisId: "t1-gen", match: "T1 vs GEN", league: "LCK", sport: "e스포츠", prediction: "GEN 승", odds: 2.05 },
      { analysisId: "seoul-kcc", match: "서울 SK vs 부산 KCC", league: "KBL", sport: "농구", prediction: "서울 SK 승", odds: 1.57 },
      { analysisId: "hanwha-lotte", match: "한화 Eagles vs 롯데 Giants", league: "KBO", sport: "야구", prediction: "언더 8.5", odds: 1.88 },
    ],
  },
  {
    id: "combo-003",
    date: "2026-06-01",
    aiName: "DeepSeek",
    style: "변동성 탐색형",
    stake: 100,
    totalOdds: 5.88,
    potentialReturn: 588,
    status: "대기중",
    result: "경기 전",
    profit: 0,
    selections: [
      { analysisId: "kt-ssg", match: "KT Wiz vs SSG Landers", league: "KBO", sport: "야구", prediction: "KT 승", odds: 2.1 },
      { analysisId: "hanwha-lotte", match: "한화 Eagles vs 롯데 Giants", league: "KBO", sport: "야구", prediction: "언더 8.5", odds: 1.88 },
      { analysisId: "t1-gen", match: "T1 vs GEN", league: "LCK", sport: "e스포츠", prediction: "GEN 승", odds: 1.49 },
    ],
  },
];

const historyCombinations: Combination[] = [
  {
    ...combinations[0],
    id: "combo-004",
    date: "2026-05-31",
    status: "미적중",
    result: "3/4 적중",
    totalOdds: 2.86,
    potentialReturn: 286,
    profit: -100,
    selections: [
      ...combinations[0].selections,
      { analysisId: "kt-ssg", match: "KT Wiz vs SSG Landers", league: "KBO", sport: "야구", prediction: "SSG +1.5", odds: 1.68 },
    ],
  },
  {
    ...combinations[1],
    id: "combo-005",
    date: "2026-05-31",
    status: "미적중",
    result: "2/3 적중",
    totalOdds: 6.92,
    potentialReturn: 692,
    profit: -100,
    selections: combinations[1].selections.slice(0, 3),
  },
  {
    ...combinations[2],
    id: "combo-006",
    date: "2026-05-31",
    status: "미적중",
    result: "3/4 적중",
    totalOdds: 9.24,
    potentialReturn: 924,
    profit: -100,
    selections: [
      ...combinations[2].selections,
      { analysisId: "mancity-liverpool", match: "맨시티 vs 리버풀", league: "EPL", sport: "축구", prediction: "무승부", odds: 1.36 },
    ],
  },
  {
    ...combinations[0],
    id: "combo-007",
    date: "2026-05-30",
    status: "적중",
    result: "5/5 적중",
    totalOdds: 2.86,
    potentialReturn: 286,
    profit: 186,
    selections: [
      ...combinations[0].selections,
      { analysisId: "hanwha-lotte", match: "한화 Eagles vs 롯데 Giants", league: "KBO", sport: "야구", prediction: "언더 8.5", odds: 1.44 },
      { analysisId: "kt-ssg", match: "KT Wiz vs SSG Landers", league: "KBO", sport: "야구", prediction: "SSG +1.5", odds: 1.57 },
    ],
  },
  {
    ...combinations[1],
    id: "combo-008",
    date: "2026-05-30",
    status: "적중",
    result: "4/4 적중",
    totalOdds: 1.58,
    potentialReturn: 158,
    profit: 58,
    selections: combinations[1].selections.slice(0, 4),
  },
  {
    ...combinations[2],
    id: "combo-009",
    date: "2026-05-30",
    status: "적중",
    result: "5/5 적중",
    totalOdds: 6.34,
    potentialReturn: 634,
    profit: 534,
    selections: [
      ...combinations[2].selections,
      { analysisId: "mancity-liverpool", match: "맨시티 vs 리버풀", league: "EPL", sport: "축구", prediction: "무승부", odds: 3.2 },
      { analysisId: "lg-kia", match: "LG Twins vs KIA Tigers", league: "KBO", sport: "야구", prediction: "LG 승", odds: 1.55 },
    ],
  },
];

export const allCombinations: Combination[] = [...combinations, ...historyCombinations];
export const historyRecords = historyCombinations;
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
  potentialProfit: combination.potentialReturn - combination.stake,
  potentialReturn: combination.potentialReturn,
  status: combination.status,
  result: combination.result,
  profit: combination.profit,
}));

export const featuredMatches: FeaturedMatch[] = analysisMatches.map((match) => ({
  id: match.id,
  sport: match.sport,
  league: match.league,
  match: match.match,
  startTime: match.startTime,
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
export const battleResults = analysisMatches
  .filter((match) => match.actualResult)
  .map((match) => ({
    matchId: match.id,
    actualResult: match.actualResult,
    winners: match.analyses.filter((analysis) => analysis.prediction === match.actualResult).map((analysis) => analysis.aiName),
    losers: match.analyses.filter((analysis) => analysis.prediction !== match.actualResult).map((analysis) => analysis.aiName),
  }));

export const communityPosts: CommunityPost[] = [
  {
    id: "post-001",
    category: "AI토론",
    title: "오늘 DeepSeek가 의외로 3폴더만 간 이유가 뭘까요?",
    author: "LineWatcher",
    createdAt: "2026-06-01 10:24",
    views: 482,
    comments: 12,
    likes: 36,
    body: "평소보다 조합 배당이 낮아서 놀랐습니다. T1과 KT 쪽은 이해되는데, 언더까지 묶은 판단은 꽤 조심스러워 보여요.",
    commentList: [
      { id: "c-001", author: "PitchMap", createdAt: "2026-06-01 10:41", content: "오늘 KBO 라인이 애매해서 변동성을 줄인 것 같습니다." },
      { id: "c-002", author: "AIReader", createdAt: "2026-06-01 11:02", content: "DeepSeek도 매번 공격적으로만 가는 건 아니라는 점이 좋네요." },
    ],
  },
  {
    id: "post-002",
    category: "경기분석",
    title: "LG vs KIA는 AI 의견이 갈리는 게 핵심",
    author: "BullpenNote",
    createdAt: "2026-06-01 09:18",
    views: 719,
    comments: 18,
    likes: 44,
    body: "GPT와 Gemini는 LG를 보고, DeepSeek는 KIA 배당 가치를 봅니다. 승패보다 후반 불펜 변수를 봐야 할 경기 같습니다.",
    commentList: [
      { id: "c-003", author: "KBOFlow", createdAt: "2026-06-01 09:47", content: "저도 KIA 쪽 배당 가치는 있다고 봅니다." },
    ],
  },
  {
    id: "post-003",
    category: "픽공유",
    title: "오늘은 Gemini 5폴더를 소액으로 따라가 봅니다",
    author: "ComboLab",
    createdAt: "2026-06-01 08:33",
    views: 333,
    comments: 7,
    likes: 21,
    body: "배당은 높지만 선택들이 완전히 무리한 느낌은 아니라서 소액 참고용으로 괜찮아 보입니다.",
    commentList: [
      { id: "c-004", author: "GreenTicket", createdAt: "2026-06-01 08:58", content: "GEN 승이 제일 변수 같아요." },
    ],
  },
  {
    id: "post-004",
    category: "질문답변",
    title: "AI 조합 배당은 각 선택 배당을 곱한 값인가요?",
    author: "NewUser",
    createdAt: "2026-05-31 22:10",
    views: 205,
    comments: 5,
    likes: 9,
    body: "조합 배당 계산 방식이 궁금합니다. 실제 배팅이 아니라 콘텐츠용 수치인 건 이해했습니다.",
    commentList: [
      { id: "c-005", author: "AdminMock", createdAt: "2026-05-31 22:21", content: "MVP에서는 더미데이터지만, 구조는 선택 배당의 조합 배당을 기준으로 잡았습니다." },
    ],
  },
  {
    id: "post-005",
    category: "자유게시판",
    title: "AI 리그 시즌제로 가면 재밌을 듯",
    author: "SeasonMaker",
    createdAt: "2026-05-31 19:04",
    views: 156,
    comments: 3,
    likes: 14,
    body: "월간 시즌, 종목별 시즌, 플레이오프 같은 식으로 가면 AI별 캐릭터가 더 잘 보일 것 같습니다.",
    commentList: [
      { id: "c-006", author: "LeagueFan", createdAt: "2026-05-31 19:20", content: "종목별 랭킹은 꼭 있었으면 합니다." },
    ],
  },
];

export const getRankedAis = () =>
  [...aiCompetitors].sort((a, b) => b.currentBalance - a.currentBalance);

export const getTodayCombinations = () =>
  combinations.filter((combination) => combination.status === "대기중");

export const getSettledCombinations = () =>
  allCombinations.filter((combination) => combination.status !== "대기중");

export const getAverageRoi = () =>
  aiCompetitors.reduce((total, ai) => total + ai.roi, 0) / aiCompetitors.length;

export const getAnalysisMatch = (id: string) =>
  analysisMatches.find((match) => match.id === id);

export const getMostDivisiveMatch = () =>
  [...analysisMatches].sort((a, b) => a.consensusScore - b.consensusScore)[0];

export const getStrongConsensusMatch = () =>
  [...analysisMatches].sort((a, b) => b.consensusScore - a.consensusScore)[0];
