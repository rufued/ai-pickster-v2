import { createHash } from "node:crypto";

export const DEFAULT_AI_BALANCE = 100000;
export const MIN_STAKE = 200;
export const MAX_STAKE = 10000;
export const MAX_BALANCE_FRACTION = 0.1;
export const MIN_BALANCE_FRACTION = 0.01;
export const TARGET_MAX_BALANCE_FRACTION = 0.08;
const VARIATION = 0.1;

function styleAdjustedFraction(aiModel, baseFraction, confidence) {
  switch (String(aiModel || "").toLowerCase()) {
    case "gpt":
      return baseFraction + 0.007;
    case "claude":
      if (confidence < 75) return baseFraction * 0.65;
      if (confidence < 85) return baseFraction * 0.82;
      return baseFraction * 1.05;
    case "grok":
      return baseFraction + 0.015;
    case "deepseek":
      return baseFraction * 0.7;
    case "gemini":
    default:
      return baseFraction;
  }
}

function deterministicVariation(seed) {
  const sample = createHash("sha256").update(String(seed)).digest().readUInt32BE(0) / 0xffffffff;
  return 1 - VARIATION + sample * VARIATION * 2;
}

export function confidenceStake(
  confidence,
  { balance = DEFAULT_AI_BALANCE, seed = "stake", aiModel = "gemini" } = {},
) {
  const safeConfidence = Math.min(100, Math.max(50, Number(confidence) || 50));
  const safeBalance = Math.max(0, Number(balance) || 0);
  const maxForBalance = Math.min(MAX_STAKE, safeBalance * MAX_BALANCE_FRACTION);
  if (maxForBalance < MIN_STAKE) {
    throw new Error(`Insufficient balance for minimum stake: balance=${safeBalance}`);
  }

  const normalized = (safeConfidence - 50) / 50;
  const baseFraction =
    MIN_BALANCE_FRACTION +
    Math.pow(normalized, 1.15) * (TARGET_MAX_BALANCE_FRACTION - MIN_BALANCE_FRACTION);
  const styledFraction = styleAdjustedFraction(aiModel, baseFraction, safeConfidence);
  const varied = safeBalance * styledFraction * deterministicVariation(`${aiModel}:${seed}`);
  const roundingUnit = varied < 1000 ? 100 : 250;
  const rounded = Math.round(varied / roundingUnit) * roundingUnit;
  const cleanCap = Math.floor(maxForBalance / roundingUnit) * roundingUnit;
  const capped = Math.min(rounded, cleanCap || maxForBalance);

  return Math.max(MIN_STAKE, capped);
}

export async function getAiBalances(supabase) {
  const { data, error } = await supabase.from("ai_assets").select("ai_model,balance");
  if (error) throw new Error(`Failed to fetch AI balances: ${error.message}`);
  return new Map((data ?? []).map((asset) => {
    const balance = Number(asset.balance);
    return [asset.ai_model, Number.isFinite(balance) ? balance : DEFAULT_AI_BALANCE];
  }));
}
