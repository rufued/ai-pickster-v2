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

export function AiIdentity({ name, showBadge = true, className, nameClassName, flagClassName }: AiIdentityProps) {
  const ai = getAiConfig(name);

  return (
    <span className={clsx("inline-flex min-w-0 items-center gap-2 whitespace-nowrap", className)}>
      <AiFlag name={name} className={flagClassName} />
      <span className={clsx("min-w-0 truncate font-extrabold text-slate-900", nameClassName)}>{name}</span>
      {showBadge ? <AiBadge name={name} /> : null}
      {ai ? <span className="sr-only">{ai.countryName}</span> : null}
    </span>
  );
}

export function AiFlag({ name, className }: { name: string; className?: string }) {
  const ai = getAiConfig(name);
  const country = ai?.country.toUpperCase();

  if (country === "US") {
    return (
      <span
        className={clsx("relative inline-flex h-4 w-6 shrink-0 overflow-hidden rounded-[2px] border border-slate-200 shadow-sm", className)}
        aria-hidden
        style={{
          backgroundImage: "repeating-linear-gradient(to bottom, #b91c1c 0 2px, #ffffff 2px 4px)",
        }}
      >
        <span className="absolute left-0 top-0 h-[54%] w-[46%] bg-blue-700" />
      </span>
    );
  }

  if (country === "CN") {
    return (
      <span className={clsx("relative inline-flex h-4 w-6 shrink-0 overflow-hidden rounded-[2px] border border-slate-200 bg-red-600 shadow-sm", className)} aria-hidden>
        <span className="absolute left-[3px] top-[-1px] text-[9px] leading-none text-yellow-300">★</span>
      </span>
    );
  }

  return (
    <span className={clsx("inline-flex h-5 w-5 shrink-0 items-center justify-center text-lg leading-none", className)} aria-hidden>
      {getCountryFlag(ai?.country)}
    </span>
  );
}

export function AiBadge({ name }: { name: string }) {
  return <span className={clsx("inline-flex rounded-full border px-2 py-0.5 text-[11px] font-black", getAiChipClass(name))}>{name}</span>;
}
