"use client";

import clsx from "clsx";
import { getAiChipClass, getAiColorHex, getAiConfig } from "@/lib/aiConfig";

type AiIdentityProps = {
  name: string;
  showBadge?: boolean;
  className?: string;
  nameClassName?: string;
  markerClassName?: string;
};

export function AiIdentity({ name, showBadge = true, className, nameClassName, markerClassName }: AiIdentityProps) {
  return (
    <span className={clsx("inline-flex min-w-0 items-center gap-2 whitespace-nowrap", className)}>
      <AiColorDot name={name} className={markerClassName} />
      <span className={clsx("min-w-0 truncate font-extrabold text-slate-900", nameClassName)}>{name}</span>
      {showBadge ? <AiBadge name={name} /> : null}
    </span>
  );
}

export function ComingSoonBadge({ className }: { className?: string }) {
  return (
    <span className={clsx("inline-flex shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-black text-amber-700", className)}>
      준비중
    </span>
  );
}

export function AiColorDot({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={clsx("inline-flex h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_0_3px_rgba(15,23,42,0.06)]", className)}
      style={{ backgroundColor: getAiColorHex(name) }}
      aria-hidden
    />
  );
}

export function AiBadge({ name }: { name: string }) {
  const ai = getAiConfig(name);

  return (
    <span className={clsx("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-black", getAiChipClass(name))}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ai?.colorHex ?? "#64748B" }} aria-hidden />
      {name}
    </span>
  );
}
