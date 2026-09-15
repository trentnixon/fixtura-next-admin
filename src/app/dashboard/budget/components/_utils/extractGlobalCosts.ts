import type { CostBreakdown } from "@/types/rollups";

/** Read lambda / AI amounts from rollup `costBreakdown.global` with API key variants. */
export function extractGlobalLambdaAi(costBreakdown: CostBreakdown | undefined): {
  lambda: number | null;
  ai: number | null;
} {
  const global = costBreakdown?.global;
  if (!global) return { lambda: null, ai: null };

  const lambda =
    global.lambda ??
    global["lambda"] ??
    global["lambdaCost"] ??
    global["totalLambdaCost"] ??
    null;
  const ai =
    global.ai ??
    global["ai"] ??
    global["aiCost"] ??
    global["totalAiCost"] ??
    null;

  return {
    lambda: typeof lambda === "number" ? lambda : null,
    ai: typeof ai === "number" ? ai : null,
  };
}
