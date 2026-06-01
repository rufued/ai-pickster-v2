import { ArrowRight } from "lucide-react";
import type { AIDecisionProcess } from "@/lib/types";

type DecisionProcessCardProps = {
  process: AIDecisionProcess;
};

export function DecisionProcessCard({ process }: DecisionProcessCardProps) {
  const steps = [
    { label: "경기 분석", value: `${process.reviewedMatches}` },
    { label: "후보 선정", value: `${process.candidateMatches}` },
    { label: "최종 선택", value: `${process.finalSelections}` },
  ];

  return (
    <article className="panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-accent-green">{process.aiName}</p>
          <h3 className="mt-1 text-xl font-black text-white">오늘의 선별 과정</h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">조합 배당</p>
          <p className="text-xl font-black text-accent-green">{process.combinationOdds.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center gap-2">
            <div className="min-w-0 flex-1 rounded-md border border-white/10 bg-black/20 p-3">
              <p className="text-xs text-slate-500">{step.label}</p>
              <p className="mt-1 text-2xl font-black text-white">{step.value}</p>
            </div>
            {index < steps.length - 1 ? <ArrowRight className="shrink-0 text-slate-600" size={18} /> : null}
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm text-slate-400">
        {process.reviewedMatches}경기 분석 → {process.candidateMatches}경기 후보 → {process.finalSelections}경기 조합 선택
      </p>
    </article>
  );
}
