export type AiColor = "blue" | "purple" | "dark" | "orange" | "teal";
export type AiCountry = "US" | "CN" | string;

export type AiConfig = {
  id: string;
  name: string;
  provider: string;
  country: AiCountry;
  countryName: string;
  color: AiColor;
  chipClass: string;
};

export const aiConfigs: AiConfig[] = [
  {
    id: "gpt",
    name: "GPT",
    provider: "OpenAI",
    country: "US",
    countryName: "미국",
    color: "blue",
    chipClass: "ai-chip-gpt",
  },
  {
    id: "gemini",
    name: "Gemini",
    provider: "Google",
    country: "US",
    countryName: "미국",
    color: "purple",
    chipClass: "ai-chip-gemini",
  },
  {
    id: "claude",
    name: "Claude",
    provider: "Anthropic",
    country: "US",
    countryName: "미국",
    color: "orange",
    chipClass: "ai-chip-claude",
  },
  {
    id: "grok",
    name: "Grok",
    provider: "xAI",
    country: "US",
    countryName: "미국",
    color: "dark",
    chipClass: "ai-chip-grok",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    provider: "DeepSeek",
    country: "CN",
    countryName: "중국",
    color: "teal",
    chipClass: "ai-chip-deepseek",
  },
];

export const battleAiOrder = aiConfigs.map((ai) => ai.name);

export function getCountryFlag(country?: string) {
  switch (country?.toUpperCase()) {
    case "US":
      return "\uD83C\uDDFA\uD83C\uDDF8";
    case "CN":
      return "\uD83C\uDDE8\uD83C\uDDF3";
    default:
      return "\uD83C\uDFF3\uFE0F";
  }
}

export function getAiConfig(name: string) {
  return aiConfigs.find((ai) => ai.name.toLowerCase() === name.toLowerCase());
}

export function getAiChipClass(name: string) {
  return getAiConfig(name)?.chipClass ?? "border-slate-200 bg-slate-50 text-slate-700";
}

export function formatAiNameWithFlag(name: string) {
  const ai = getAiConfig(name);
  return `${getCountryFlag(ai?.country)} ${name}`;
}
