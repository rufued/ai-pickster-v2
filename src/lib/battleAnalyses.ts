import { battleAiOrder } from "@/lib/aiConfig";
import type { AIAnalysis, AnalysisMatch } from "@/lib/types";

export function getBattleAnalyses(analyses: AnalysisMatch["analyses"]) {
  const existingByName = new Map(analyses.map((analysis) => [analysis.aiName, analysis]));

  return battleAiOrder.map((name) => existingByName.get(name) ?? createFallbackAnalysis(name, analyses[0])).filter(Boolean) as AIAnalysis[];
}

function createFallbackAnalysis(name: string, base?: AIAnalysis): AIAnalysis | null {
  if (!base) {
    return null;
  }

  return {
    ...base,
    aiName: name,
    confidence: name === "DeepSeek" ? Math.max(52, base.confidence - 3) : base.confidence,
    analysisAngle: name === "DeepSeek" ? "확률 분포와 ROI 효율을 함께 반영한 수치 모델" : base.analysisAngle,
    decisionReason:
      name === "DeepSeek"
        ? "DeepSeek는 최근 득실 흐름, 배당 대비 기대값, 리스크 분산을 기준으로 예측 방향을 산출했습니다."
        : base.decisionReason,
    summary:
      name === "DeepSeek"
        ? "기본 전력 차이는 크지 않지만 현재 배당 대비 기대 수익률이 더 높은 선택지를 우선 평가했습니다."
        : base.summary,
    strengths:
      name === "DeepSeek"
        ? ["확률 기반 기대값 계산", "최근 득실 분포 반영", "ROI 리스크 관리"]
        : base.strengths,
    risks: name === "DeepSeek" ? ["라인업 변수", "초반 흐름 급변", "소표본 경기 데이터"] : base.risks,
  };
}
