import type { Sport } from "@/lib/types";

export type SportCategory = {
  id: string;
  label: string;
  icon: string;
  sport?: Sport;
  isNew?: boolean;
};

export const sportCategories: SportCategory[] = [
  { id: "all", label: "All Sports", icon: "◎" },
  { id: "football", label: "Football", icon: "⚽", sport: "축구" },
  { id: "basketball", label: "Basketball", icon: "🏀", sport: "농구" },
  { id: "baseball", label: "Baseball", icon: "⚾", sport: "야구" },
  { id: "tennis", label: "Tennis", icon: "🎾", sport: "테니스" },
  { id: "formula-1", label: "Formula 1", icon: "🏁", sport: "Formula 1" },
  { id: "ice-hockey", label: "Ice Hockey", icon: "🏒", sport: "아이스하키" },
  { id: "esports", label: "Esports", icon: "🎮", sport: "e스포츠", isNew: true },
];

export function getSportFromParam(value?: string): Sport | undefined {
  return sportCategories.find((category) => category.id === value)?.sport;
}
