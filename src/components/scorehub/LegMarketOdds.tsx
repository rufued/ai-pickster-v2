"use client";

import clsx from "clsx";
import { useI18n } from "@/components/i18n/I18nProvider";
import type { BetLeg, BetOddsOption } from "@/data/bets";

export function LegMarketOdds({ leg }: { leg: BetLeg }) {
  const { t } = useI18n();
  if (!leg.oddsOptions.length) return null;

  return (
    <div dir="ltr" className="mt-2 grid min-w-0 grid-cols-1 gap-1.5 sm:grid-cols-2 xl:grid-cols-3">
      {leg.oddsOptions.map((option) => {
        const selected = isSelected(leg.pickType, option.type);
        return (
          <span key={option.type} className={clsx(
            "flex min-w-0 items-center justify-between gap-2 rounded-md border px-2 py-1.5 text-[11px] leading-tight",
            selected
              ? "border-emerald-300 bg-emerald-50 font-black text-emerald-900 ring-1 ring-emerald-100"
              : "border-slate-200 bg-slate-50 font-bold text-slate-500",
          )}>
            <span className="min-w-0 whitespace-normal [overflow-wrap:anywhere]">{optionLabel(leg, option, t)}</span>
            <span className={clsx("shrink-0 tabular-nums", selected ? "text-emerald-700" : "text-slate-600")}>{option.odds.toFixed(2)}</span>
          </span>
        );
      })}
    </div>
  );
}

function optionLabel(leg: BetLeg, option: BetOddsOption, t: (key: string) => string) {
  const line = option.point == null ? "" : ` ${option.point > 0 ? "+" : ""}${option.point}`;
  if (option.type === "home") return `${leg.homeTeam}${line}`;
  if (option.type === "away") return `${leg.awayTeam}${line}`;
  if (option.type === "draw") return t("markets.draw");
  return `${option.type === "over" ? "O" : "U"}${line}`;
}

function isSelected(pickType: string | undefined, option: BetOddsOption["type"]) {
  if (option === "home") return pickType === "home_win" || pickType === "home_spread";
  if (option === "away") return pickType === "away_win" || pickType === "away_spread";
  return pickType === option;
}
