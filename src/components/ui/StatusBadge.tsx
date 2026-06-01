import clsx from "clsx";
import type { CombinationStatus } from "@/lib/types";

type StatusBadgeProps = {
  status: CombinationStatus;
};

const styles: Record<CombinationStatus, string> = {
  대기중: "border-slate-500/40 bg-slate-500/10 text-slate-300",
  적중: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  미적중: "border-red-400/40 bg-red-400/10 text-red-300",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex min-w-16 items-center justify-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}
