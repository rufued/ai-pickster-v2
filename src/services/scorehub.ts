import { ads, type AdPlacement } from "@/data/ads";
import { communityPosts } from "@/data/community";
import { aiConfigs } from "@/lib/aiConfig";

export function getAi(aiId: string) {
  const config = aiConfigs.find((ai) => ai.id === aiId);
  if (!config) return undefined;
  return {
    id: config.id,
    name: config.name,
    provider: config.provider,
    initials: config.name.slice(0, 2).toUpperCase(),
    color: config.colorHex,
  };
}

export function getCommunityPosts() {
  return communityPosts;
}

export function getCommunityPost(id: string) {
  return communityPosts.find((post) => post.id === id);
}

export function getAdForPlacement(placement: AdPlacement) {
  return ads
    .filter((ad) => ad.placement === placement && ad.isActive && (ad.type === "image" || ad.type === "internal"))
    .sort((a, b) => b.priority - a.priority)[0];
}

export function getAiName(aiId: string) {
  return getAi(aiId)?.name ?? aiId;
}

export function getAiColor(aiId: string) {
  return getAi(aiId)?.color ?? "#64748B";
}
