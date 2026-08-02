export type AiColor = "green" | "blue" | "purple" | "dark" | "orange";

export type AiConfig = {
  id: string;
  name: string;
  provider: string;
  total_picks: number;
  color: AiColor;
  colorHex: string;
  chipClass: string;
};

export const aiConfigs: AiConfig[] = [
  {
    id: "gpt",
    name: "GPT",
    provider: "OpenAI",
    total_picks: 1,
    color: "green",
    colorHex: "#10A37F",
    chipClass: "ai-chip-gpt",
  },
  {
    id: "gemini",
    name: "Gemini",
    provider: "Google",
    total_picks: 1,
    color: "blue",
    colorHex: "#4285F4",
    chipClass: "ai-chip-gemini",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    provider: "DeepSeek",
    total_picks: 0,
    color: "purple",
    colorHex: "#7C3AED",
    chipClass: "ai-chip-deepseek",
  },
  {
    id: "grok",
    name: "Grok",
    provider: "xAI",
    total_picks: 0,
    color: "dark",
    colorHex: "#111827",
    chipClass: "ai-chip-grok",
  },
  {
    id: "claude",
    name: "Claude",
    provider: "Anthropic",
    total_picks: 0,
    color: "orange",
    colorHex: "#D97706",
    chipClass: "ai-chip-claude",
  },
];

export const battleAiOrder = aiConfigs.map((ai) => ai.name);

export function getAiConfig(name: string) {
  return aiConfigs.find((ai) => ai.name.toLowerCase() === name.toLowerCase());
}

export function getAiChipClass(name: string) {
  return getAiConfig(name)?.chipClass ?? "border-slate-200 bg-slate-50 text-slate-700";
}

export function getAiColorHex(name: string) {
  return getAiConfig(name)?.colorHex ?? "#64748B";
}

export function isAiComingSoon(nameOrId: string) {
  const normalized = nameOrId.toLowerCase();
  const ai = aiConfigs.find(
    (item) => item.id === normalized || item.name.toLowerCase() === normalized,
  );

  return ai?.total_picks === 0;
}
