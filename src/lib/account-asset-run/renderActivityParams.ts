import type { AccountAssetRunAccountOrgType } from "@/lib/account-asset-run/accountRoutes";

export type RenderActivityWindowPreset = "7d" | "60d" | "90d";

const PRESET_MS: Record<RenderActivityWindowPreset, number> = {
  "7d": 7 * 24 * 60 * 60 * 1000,
  "60d": 60 * 24 * 60 * 60 * 1000,
  "90d": 90 * 24 * 60 * 60 * 1000,
};

/** UTC rolling window for render-activity report queries. */
export function buildRenderActivityWindow(preset: RenderActivityWindowPreset): {
  from: string;
  to: string;
} {
  const to = new Date();
  const from = new Date(to.getTime() - PRESET_MS[preset]);
  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
}

export function normalizeAccountOrgType(
  type: string | null | undefined
): AccountAssetRunAccountOrgType | undefined {
  if (type == null || type.trim() === "") return undefined;
  const normalized = type.trim().toLowerCase();
  if (normalized === "club") return "club";
  if (normalized === "association") return "association";
  return undefined;
}

export function getAccountOverviewHref(
  accountId: number,
  accountType: AccountAssetRunAccountOrgType | undefined
): string | null {
  if (!accountType) return null;
  return `/dashboard/accounts/${accountType}/${accountId}`;
}

export type RenderActivityStatusFilter = "all" | "running" | "completed" | "failed";

export function renderActivityStatusParam(
  filter: RenderActivityStatusFilter
): string | undefined {
  if (filter === "all") return undefined;
  return filter;
}
