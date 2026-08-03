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
