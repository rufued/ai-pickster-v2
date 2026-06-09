export type AiColor = "blue" | "purple" | "dark" | "orange" | "teal";
export type AiCountry = "US" | "CN";

export type AiConfig = {
  id: string;
  name: string;
  provider: string;
  country: AiCountry;
  color: AiColor;
  chipClass: string;
};

export const aiConfigs: AiConfig[] = [
  {
    id: "gpt",
    name: "GPT",
    provider: "OpenAI",
    country: "US",
    color: "blue",
    chipClass: "border-blue-200 bg-blue-50 text-blue-700",
  },
  {
    id: "gemini",
    name: "Gemini",
    provider: "Google",
    country: "US",
    color: "purple",
    chipClass: "border-violet-200 bg-violet-50 text-violet-700",
  },
  {
    id: "claude",
    name: "Claude",
    provider: "Anthropic",
    country: "US",
    color: "orange",
    chipClass: "border-orange-200 bg-orange-50 text-orange-700",
  },
  {
    id: "grok",
    name: "Grok",
    provider: "xAI",
    country: "US",
    color: "dark",
    chipClass: "border-slate-300 bg-slate-100 text-slate-800",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    provider: "DeepSeek",
    country: "CN",
    color: "teal",
    chipClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
];

export const battleAiOrder = aiConfigs.map((ai) => ai.name);

export function getCountryFlag(country?: string) {
  switch (country?.toUpperCase()) {
    case "US":
      return "🇺🇸";
    case "CN":
      return "🇨🇳";
    default:
      return "🏳️";
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
  return `${getCountryFlag(ai?.country)} ${ai?.name ?? name}`;
}
