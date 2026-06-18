"use client";

import clsx from "clsx";
import type { CombinationStatus } from "@/lib/types";

type StatusBadgeProps = {
  status: CombinationStatus;
};

const styles: Record<CombinationStatus, string> = {
  scheduled: "border-blue-400/40 bg-blue-400/10 text-blue-300",
  pending: "border-slate-500/40 bg-slate-500/10 text-slate-300",
  won: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  lost: "border-red-400/40 bg-red-400/10 text-red-300",
};

const labels: Record<CombinationStatus, string> = {
  scheduled: "예정",
  pending: "정산 대기",
  won: "당첨",
  lost: "낙첨",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex min-w-16 items-center justify-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        styles[status],
      )}
    >
      {labels[status]}
    </span>
  );
}
