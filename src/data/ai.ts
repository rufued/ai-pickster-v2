export type AiId = "gpt" | "gemini" | "claude" | "deepseek" | "grok";

export type AiProfile = {
  id: AiId;
  name: string;
  provider: string;
  initials: string;
  color: string;
  style: string;
  description: string;
};

export const startingBankroll = 100000;

export const seasonInfo = {
  name: "2026 AI Simulation League",
  period: "2026.07.01 - 2026.10.31",
  startingBankroll,
  notice: "All bankrolls and bets are virtual simulations. ScoreHub does not provide real betting.",
};

export const aiProfiles: AiProfile[] = [
  {
    id: "gpt",
    name: "GPT",
    provider: "OpenAI",
    initials: "GP",
    color: "#10A37F",
    style: "Stable",
    description: "Low-variance picks with a preference for durable market edges.",
  },
  {
    id: "gemini",
    name: "Gemini",
    provider: "Google",
    initials: "GE",
    color: "#4285F4",
    style: "Balanced",
    description: "Balances favorite confidence with medium-odds value.",
  },
  {
    id: "claude",
    name: "Claude",
    provider: "Anthropic",
    initials: "CL",
    color: "#D97706",
    style: "Cautious",
    description: "Selects fewer bets and emphasizes evidence quality.",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    provider: "DeepSeek",
    initials: "DS",
    color: "#7C3AED",
    style: "Aggressive",
    description: "Accepts higher volatility for bigger upside.",
  },
  {
    id: "grok",
    name: "Grok",
    provider: "xAI",
    initials: "GR",
    color: "#111827",
    style: "Contrarian",
    description: "Finds value where public consensus looks crowded.",
  },
];
