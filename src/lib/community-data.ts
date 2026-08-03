import { supabaseAdmin } from "@/lib/supabase";
import { COMMUNITY_CATEGORIES } from "@/lib/community-auth";

export const COMMUNITY_PAGE_SIZE = 18;
export type CommunityCategory = (typeof COMMUNITY_CATEGORIES)[number];

export async function getCommunityPosts(page: number, category?: CommunityCategory) {
  if (!supabaseAdmin) return { posts: [], count: 0 };
  const from = (page - 1) * COMMUNITY_PAGE_SIZE;
  let query = supabaseAdmin.from("community_posts")
    .select("id,category,title,nickname,comment_count,created_at,updated_at", { count: "exact" })
    .order("created_at", { ascending: false }).range(from, from + COMMUNITY_PAGE_SIZE - 1);
  if (category) query = query.eq("category", category);
  const { data, count, error } = await query;
  if (error) {
    if (error.code === "42P01") return { posts: [], count: 0 };
    throw error;
  }
  return { posts: data ?? [], count: count ?? 0 };
}

export async function getCommunityPost(id: string) {
  if (!supabaseAdmin) return null;
  const [{ data: post, error }, { data: comments, error: commentsError }] = await Promise.all([
    supabaseAdmin.from("community_posts").select("id,category,title,content,nickname,comment_count,created_at,updated_at").eq("id", id).maybeSingle(),
    supabaseAdmin.from("community_comments").select("id,post_id,content,nickname,created_at").eq("post_id", id).order("created_at", { ascending: true }),
  ]);
  if (error || commentsError) {
    if (error?.code === "42P01" || commentsError?.code === "42P01") return null;
    throw error ?? commentsError;
  }
  return post ? { ...post, comments: comments ?? [] } : null;
}

