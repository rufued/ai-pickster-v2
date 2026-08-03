export type AiId = "gpt" | "gemini" | "claude" | "deepseek" | "grok";

export type AiProfile = {
  id: AiId;
  name: string;
  provider: string;
  initials: string;
  color: string;
  style: string;
  description: string;
  total_picks: number;
};

export const startingBankroll = 100000;

export const seasonInfo = {
  name: "AI Simulation League",
  period: "",
  startingBankroll,
  notice: "모든 자산과 픽은 실제 Supabase 정산 데이터를 기준으로 표시됩니다.",
};
