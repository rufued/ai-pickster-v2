import type { AIModel } from "@/lib/types";

// Legacy UI components may import this symbol, but performance data is never mocked.
// Live AI rows come from ai_assets through getLiveData().
export const aiModels: AIModel[] = [];
