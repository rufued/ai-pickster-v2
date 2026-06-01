import { ArrowRight } from "lucide-react";
import type { AIDecisionProcess } from "@/lib/types";

type DecisionProcessCardProps = {
  process: AIDecisionProcess;
};

export function DecisionProcessCard({ process }: DecisionProcessCardProps) {
  const steps = [
    { label: "검토 경기", value: `${process.reviewedMatches}` },
    { label: "후보 경기", value: `${process.candidateMatches}` },
    { label: "최종 선택", value: `${process.finalSelections}` },
    { label: "조합 생성", value: process.combinationOdds.toFixed(2) },
  ];

  return (
    <article className="panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-accent-green">{process.aiName}</p>
          <h3 className="mt-1 text-xl font-black text-white">AI 의사결정 프로세스</h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">제외 경기</p>
          <p className="text-xl font-black text-slate-300">{process.excludedMatches}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center gap-3">
            <div className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-slate-500">{step.label}</p>
              <p className={step.label === "조합 생성" ? "mt-1 text-2xl font-black text-accent-green" : "mt-1 text-2xl font-black text-white"}>
                {step.value}
              </p>
            </div>
            {index < steps.length - 1 ? <ArrowRight className="shrink-0 text-slate-600" size={18} /> : null}
          </div>
        ))}
      </div>
    </article>
  );
}
