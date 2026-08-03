export const adPlacements = [
  "home_top", "home_middle", "home_sidebar", "picks_top", "picks_inline",
  "records_top", "games_top", "community_top", "community_inline",
] as const;
export type AdPlacement = (typeof adPlacements)[number];
export type AdType = "image" | "internal" | "affiliate" | "adsense" | "html";
export type Ad = {
  id: string; placement: AdPlacement; type: AdType; name?: string; title: string;
  subtitle?: string; buttonText?: string; targetUrl?: string; imageUrl?: string;
  href?: string; isActive: boolean; startsAt?: string; endsAt?: string; priority: number;
};

// No ads table is configured, so fabricated banners are not displayed.
export const ads: Ad[] = [];
