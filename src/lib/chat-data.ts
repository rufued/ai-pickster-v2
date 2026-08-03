import "server-only";
import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@supabase/supabase-js";

export type ChatMessage = {
  id: string;
  aiModel: string;
  message: string;
  relatedGameId: string | null;
  turnOrder: number;
  chatDate: string;
  createdAt: string;
};

export async function getLatestChatMessages(): Promise<ChatMessage[]> {
  noStore();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return [];
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: latest, error: latestError } = await supabase.from("chat_messages").select("chat_date").order("chat_date", { ascending: false }).limit(1);
  if (latestError || !latest?.[0]?.chat_date) return [];
  const { data, error } = await supabase.from("chat_messages").select("id,ai_model,message,related_game_id,turn_order,chat_date,created_at").eq("chat_date", latest[0].chat_date).order("turn_order", { ascending: true }).limit(20);
  if (error) return [];
  return (data ?? []).map((row) => ({
    id: String(row.id),
    aiModel: row.ai_model,
    message: row.message,
    relatedGameId: row.related_game_id ? String(row.related_game_id) : null,
    turnOrder: row.turn_order,
    chatDate: row.chat_date,
    createdAt: row.created_at,
  }));
}
