export type CommunityCategory = "자유" | "경기분석" | "AI 토론";
export type CommunityComment = { id: string; author: string; body: string; createdAt: string };
export type CommunityPost = {
  id: string; category: CommunityCategory; title: string; author: string; createdAt: string;
  views: number; likes: number; reports: number; body: string; comments: CommunityComment[];
};

// No community table is configured, so fabricated posts are not displayed.
export const communityPosts: CommunityPost[] = [];
