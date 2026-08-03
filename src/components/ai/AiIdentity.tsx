"use client";

import clsx from "clsx";
import { AiBrandIcon } from "@/components/ai/AiBrandIcon";
import { getAiChipClass } from "@/lib/aiConfig";
import { useI18n } from "@/components/i18n/I18nProvider";

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
  const { t } = useI18n();
  return (
    <span className={clsx("inline-flex shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-black text-amber-700", className)}>
      {t("common.comingSoon")}
    </span>
  );
}

export function AiColorDot({ name, className }: { name: string; className?: string }) {
  return <AiBrandIcon ai={name} size="xs" className={className} />;
}

export function AiBadge({ name }: { name: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-black", getAiChipClass(name))}>
      <AiBrandIcon ai={name} size="xs" />
      {name}
    </span>
  );
}
