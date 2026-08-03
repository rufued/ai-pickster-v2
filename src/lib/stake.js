import { createHash } from "node:crypto";

export const DEFAULT_AI_BALANCE = 100000;
export const MIN_STAKE = 500;
export const TARGET_MIN_STAKE = 1000;
export const MAX_STAKE = 10000;
export const MAX_BALANCE_FRACTION = 0.1;
const VARIATION = 0.12;

function deterministicVariation(seed) {
  const sample = createHash("sha256").update(String(seed)).digest().readUInt32BE(0) / 0xffffffff;
  return 1 - VARIATION + sample * VARIATION * 2;
}

export function confidenceStake(confidence, { balance = DEFAULT_AI_BALANCE, seed = "stake" } = {}) {
  const safeConfidence = Math.min(100, Math.max(50, Number(confidence) || 50));
  const safeBalance = Math.max(0, Number(balance) || 0);
  const maxForBalance = Math.min(MAX_STAKE, safeBalance * MAX_BALANCE_FRACTION);
  if (maxForBalance < MIN_STAKE) {
    throw new Error(`Insufficient balance for minimum stake: balance=${safeBalance}`);
  }

  const normalized = (safeConfidence - 50) / 50;
  const confidenceWeighted = TARGET_MIN_STAKE + Math.pow(normalized, 1.35) * (MAX_STAKE - TARGET_MIN_STAKE);
  const varied = confidenceWeighted * deterministicVariation(seed);
  const rounded = Math.round(varied / 100) * 100;
  const capped = Math.min(rounded, Math.floor(maxForBalance / 100) * 100);
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
