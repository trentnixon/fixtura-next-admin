"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAccountAssetRunGlobalStatus } from "@/lib/services/account-asset-run/fetchAccountAssetRunGlobalStatus";
import type { AccountAssetRunGlobalStatusResponse } from "@/types/accountAssetRun";
import { isAssetRunActive } from "@/lib/account-asset-run/displayRules";

const STALE_MS = 60_000;
const POLL_ACTIVE_MS = 12_000;

export function useAccountAssetRunGlobalStatus(limit = 25) {
  return useQuery({
    queryKey: ["accountAssetRun", "global", limit] as const,
    queryFn: () => fetchAccountAssetRunGlobalStatus(limit),
    staleTime: STALE_MS,
    retry: (failureCount, error) => {
      const message =
        error instanceof Error ? error.message.toLowerCase() : "";
      if (message.includes("not found") || message.includes("404")) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    refetchInterval: (query) => {
      const d = query.state.data as AccountAssetRunGlobalStatusResponse | undefined;
      const rows = d?.data ?? [];
      return rows.some((r) => isAssetRunActive(r.status))
        ? POLL_ACTIVE_MS
        : false;
    },
  });
}
