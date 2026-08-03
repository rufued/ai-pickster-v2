import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { supabaseAdmin } from "@/lib/supabase";

const scrypt = promisify(scryptCallback);
const RATE_LIMIT_SECONDS = 30;

export function requestIpHash(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  const pepper = process.env.COMMUNITY_IP_SALT || process.env.CRON_SECRET || process.env.ADMIN_PASSWORD || "scorehub-community";
  return createHash("sha256").update(`${pepper}:${ip}`).digest("hex");
}

export async function hashCommunityPassword(password: string) {
  const salt = randomBytes(16);
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;
}

export async function verifyCommunityPassword(password: string, stored: string) {
  const [algorithm, saltHex, hashHex] = stored.split(":");
  if (algorithm !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = (await scrypt(password, Buffer.from(saltHex, "hex"), expected.length)) as Buffer;
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function assertCommunityRateLimit(ipHash: string) {
  if (!supabaseAdmin) throw new Error("SERVER_CONFIG");
  const since = new Date(Date.now() - RATE_LIMIT_SECONDS * 1000).toISOString();
  const [posts, comments] = await Promise.all([
    supabaseAdmin.from("community_posts").select("id", { count: "exact", head: true }).eq("author_ip_hash", ipHash).gte("created_at", since),
    supabaseAdmin.from("community_comments").select("id", { count: "exact", head: true }).eq("author_ip_hash", ipHash).gte("created_at", since),
  ]);
  if (posts.error) throw posts.error;
  if (comments.error) throw comments.error;
  if ((posts.count ?? 0) + (comments.count ?? 0) > 0) throw new Error("RATE_LIMIT");
}

export function cleanCommunityInput(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export const COMMUNITY_CATEGORIES = ["free", "game_analysis", "ai_discussion"] as const;
export function isCommunityCategory(value: unknown): value is (typeof COMMUNITY_CATEGORIES)[number] {
  return typeof value === "string" && COMMUNITY_CATEGORIES.includes(value as (typeof COMMUNITY_CATEGORIES)[number]);
}

