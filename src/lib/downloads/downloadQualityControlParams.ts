export type DownloadQcWindowPreset =
  | "24h"
  | "48h"
  | "7d"
  | "14d"
  | "21d";

const PRESET_MS: Record<DownloadQcWindowPreset, number> = {
  "24h": 24 * 60 * 60 * 1000,
  "48h": 48 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "14d": 14 * 24 * 60 * 60 * 1000,
  "21d": 21 * 24 * 60 * 60 * 1000,
};

/** Rolling window on download `updatedAt` (UTC ISO instants). */
export function buildDownloadQcWindow(preset: DownloadQcWindowPreset): {
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

export type DownloadQcQueueScope = "needs_attention" | "all";

export type DownloadQcGroupBy =
  | "none"
  | "groupingCategory"
  | "assetCategoryIdentifier"
  | "assetCategoryName";
