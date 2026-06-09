"use client";

import clsx from "clsx";
import type { CombinationStatus } from "@/lib/types";

type StatusBadgeProps = {
  status: CombinationStatus;
};

const styles: Record<string, string> = {
  대기중: "border-blue-200 bg-blue-50 text-blue-700",
  적중: "border-emerald-200 bg-emerald-50 text-emerald-700",
  미적중: "border-red-200 bg-red-50 text-red-700",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={clsx("inline-flex min-w-16 items-center justify-center rounded-full border px-2.5 py-1 text-xs font-bold", styles[status] ?? "border-slate-200 bg-slate-50 text-slate-600")}>
      {status}
    </span>
  );
}
