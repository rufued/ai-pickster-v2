"use client";

import clsx from "clsx";
import { getAiChipClass, getAiConfig, getCountryFlag } from "@/lib/aiConfig";

type AiIdentityProps = {
  name: string;
  showBadge?: boolean;
  className?: string;
  nameClassName?: string;
  flagClassName?: string;
};

export function AiIdentity({ name, showBadge = false, className, nameClassName, flagClassName }: AiIdentityProps) {
  const ai = getAiConfig(name);
  const displayName = ai?.name ?? name;

  return (
    <span className={clsx("inline-flex min-w-0 items-center gap-1.5 whitespace-nowrap", className)}>
      <span className={clsx("shrink-0 text-base leading-none", flagClassName)} aria-hidden>
        {getCountryFlag(ai?.country)}
      </span>
      <span className={clsx("min-w-0 truncate font-extrabold text-slate-900", nameClassName)}>{displayName}</span>
      {showBadge ? <AiBadge name={displayName} /> : null}
    </span>
  );
}

export function AiBadge({ name }: { name: string }) {
  return <span className={clsx("inline-flex rounded-full border px-2 py-0.5 text-[11px] font-black", getAiChipClass(name))}>AI</span>;
}
