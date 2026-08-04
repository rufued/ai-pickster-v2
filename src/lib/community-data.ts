import { supabaseAdmin } from "@/lib/supabase";
import { COMMUNITY_CATEGORIES } from "@/lib/community-auth";

export const COMMUNITY_PAGE_SIZE = 18;
export type CommunityCategory = (typeof COMMUNITY_CATEGORIES)[number];

export type CommunityPostSummary = {
  id: string; category: string; title: string; nickname: string;
  comment_count: number; created_at: string; updated_at: string;
  is_admin: boolean; is_pinned: boolean;
};

export type CommunityComment = { id: string; post_id: string; content: string; nickname: string; created_at: string };
export type CommunityPostDetail = CommunityPostSummary & { content: string; comments: CommunityComment[] };

function isMissingColumn(error: { code?: string; message?: string } | null | undefined) {
  return Boolean(error && (error.code === "42703" || /column .* does not exist/i.test(error.message ?? "")));
}

export async function getCommunityPosts(page: number, category?: CommunityCategory) {
  if (!supabaseAdmin) return { posts: [] as CommunityPostSummary[], count: 0 };
  const from = (page - 1) * COMMUNITY_PAGE_SIZE;
  let query = supabaseAdmin.from("community_posts")
    .select("id,category,title,nickname,comment_count,created_at,updated_at,is_admin,is_pinned", { count: "exact" })
    .order("is_pinned", { ascending: false }).order("created_at", { ascending: false }).range(from, from + COMMUNITY_PAGE_SIZE - 1);
  if (category) query = query.eq("category", category);
  const result = await query;
  let posts: CommunityPostSummary[] = result.data ?? [];
  let count = result.count;
  let error = result.error;
  if (isMissingColumn(error)) {
    let fallback = supabaseAdmin.from("community_posts")
      .select("id,category,title,nickname,comment_count,created_at,updated_at", { count: "exact" })
      .order("created_at", { ascending: false }).range(from, from + COMMUNITY_PAGE_SIZE - 1);
    if (category) fallback = fallback.eq("category", category);
    const fallbackResult = await fallback;
    count = fallbackResult.count;
    error = fallbackResult.error;
    posts = (fallbackResult.data ?? []).map((post) => ({ ...post, is_admin: false, is_pinned: false }));
  }
  if (error) {
    if (error.code === "42P01") return { posts: [], count: 0 };
    throw error;
  }
  return { posts, count: count ?? 0 };
}

export async function getCommunityPost(id: string): Promise<CommunityPostDetail | null> {
  if (!supabaseAdmin) return null;
  const [postResult, commentsResult] = await Promise.all([
    supabaseAdmin.from("community_posts").select("id,category,title,content,nickname,comment_count,created_at,updated_at,is_admin,is_pinned").eq("id", id).maybeSingle(),
    supabaseAdmin.from("community_comments").select("id,post_id,content,nickname,created_at").eq("post_id", id).order("created_at", { ascending: true }),
  ]);
  let post: (CommunityPostSummary & { content: string }) | null = postResult.data;
  let error = postResult.error;
  const { data: comments, error: commentsError } = commentsResult;
  if (isMissingColumn(error)) {
    const fallback = await supabaseAdmin.from("community_posts").select("id,category,title,content,nickname,comment_count,created_at,updated_at").eq("id", id).maybeSingle();
    error = fallback.error;
    post = fallback.data ? { ...fallback.data, is_admin: false, is_pinned: false } : null;
  }
  if (error || commentsError) {
    if (error?.code === "42P01" || commentsError?.code === "42P01") return null;
    throw error ?? commentsError;
  }
  return post ? { ...post, comments: comments ?? [] } : null;
}

