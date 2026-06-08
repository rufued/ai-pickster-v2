import type { Sport } from "@/lib/types";

export type SportCategory = {
  id: string;
  label: string;
  icon: string;
  sport?: Sport;
  isNew?: boolean;
};

export const sportCategories: SportCategory[] = [
  { id: "all", label: "전체", icon: "ALL" },
  { id: "football", label: "축구", icon: "축", sport: "축구" },
  { id: "baseball", label: "야구", icon: "야", sport: "야구" },
  { id: "basketball", label: "농구", icon: "농", sport: "농구" },
  { id: "volleyball", label: "배구", icon: "배", sport: "배구" },
  { id: "esports", label: "e스포츠", icon: "E", sport: "e스포츠", isNew: true },
];

export function getSportFromParam(value?: string): Sport | undefined {
  return sportCategories.find((category) => category.id === value)?.sport;
}

export function normalizeSportCategoryId(value?: string | string[] | null): string {
  const sportId = Array.isArray(value) ? value[0] : value;
  return typeof sportId === "string" && sportCategories.some((category) => category.id === sportId) ? sportId : "all";
}
