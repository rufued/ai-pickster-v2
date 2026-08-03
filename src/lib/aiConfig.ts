export type AiColor = "green" | "blue" | "purple" | "dark" | "orange";

export type AiConfig = {
  id: string;
  name: string;
  provider: string;
  color: AiColor;
  colorHex: string;
  chipClass: string;
};

export const aiConfigs: AiConfig[] = [
  {
    id: "gpt",
    name: "GPT",
    provider: "OpenAI",
    color: "green",
    colorHex: "#10A37F",
    chipClass: "ai-chip-gpt",
  },
  {
    id: "gemini",
    name: "Gemini",
    provider: "Google",
    color: "blue",
    colorHex: "#4285F4",
    chipClass: "ai-chip-gemini",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    provider: "DeepSeek",
    color: "purple",
    colorHex: "#7C3AED",
    chipClass: "ai-chip-deepseek",
  },
  {
    id: "grok",
    name: "Grok",
    provider: "xAI",
    color: "dark",
    colorHex: "#111827",
    chipClass: "ai-chip-grok",
  },
  {
    id: "claude",
    name: "Claude",
    provider: "Anthropic",
    color: "orange",
    colorHex: "#D97706",
    chipClass: "ai-chip-claude",
  },
  { id: "human", name: "SHadmin", provider: "ScoreHub", color: "dark", colorHex: "#0F4FE8", chipClass: "border-blue-200 bg-blue-50 text-slate-900" },
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
