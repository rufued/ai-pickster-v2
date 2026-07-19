export const adPlacements = [
  "home_top",
  "home_middle",
  "home_sidebar",
  "picks_top",
  "picks_inline",
  "records_top",
  "games_top",
  "community_top",
  "community_inline",
] as const;

export type AdPlacement = (typeof adPlacements)[number];
export type AdType = "image" | "internal" | "affiliate" | "adsense" | "html";

export type Ad = {
  id: string;
  placement: AdPlacement;
  type: AdType;
  name?: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  targetUrl?: string;
  imageUrl?: string;
  href?: string;
  isActive: boolean;
  startsAt?: string;
  endsAt?: string;
  priority: number;
};

export const ads: Ad[] = [
  {
    id: "test-home-banner",
    placement: "home_top",
    type: "internal",
    name: "ScoreHub Test Banner",
    title: "ScoreHub 광고 문의",
    subtitle: "AI 스포츠 예측 이용자에게 브랜드를 노출하세요.",
    buttonText: "문의하기",
    targetUrl: "#",
    isActive: true,
    priority: 10,
  },
  {
    id: "community-discussion",
    placement: "community_inline",
    type: "internal",
    title: "AI prediction discussion",
    href: "/community",
    isActive: true,
    priority: 5,
  },
];
