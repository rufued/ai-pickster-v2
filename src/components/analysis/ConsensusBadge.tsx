import clsx from "clsx";
import type { ConsensusLabel } from "@/lib/types";

type ConsensusBadgeProps = {
  score: number;
  label: ConsensusLabel;
  size?: "sm" | "lg";
};

const labelText: Record<ConsensusLabel, string> = {
  "Strong Consensus": "강한 합의",
  "Partial Consensus": "부분 합의",
  "Split Opinion": "의견 분산",
};

const styles: Record<ConsensusLabel, string> = {
  "Strong Consensus": "border-emerald-300/40 bg-emerald-400/10 text-emerald-300",
  "Partial Consensus": "border-yellow-300/40 bg-yellow-400/10 text-yellow-300",
  "Split Opinion": "border-red-300/40 bg-red-400/10 text-red-300",
};

export function ConsensusBadge({ score, label, size = "sm" }: ConsensusBadgeProps) {
  return (
    <div
      className={clsx(
        "inline-flex shrink-0 items-center justify-center rounded-full border text-center font-black",
        styles[label],
        size === "lg" ? "h-28 w-28 flex-col gap-1" : "gap-2 px-3 py-1.5 text-sm",
      )}
    >
      <span className={size === "lg" ? "text-3xl" : "text-base"}>{score}%</span>
      <span className={size === "lg" ? "text-xs" : "text-xs font-bold"}>{labelText[label]}</span>
    </div>
  );
}

export function getConsensusTone(label: ConsensusLabel) {
  return styles[label];
}
