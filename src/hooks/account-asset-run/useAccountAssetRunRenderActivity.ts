"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAccountAssetRunRenderActivity } from "@/lib/services/account-asset-run/fetchAccountAssetRunRenderActivity";
import { isAssetRunActive } from "@/lib/account-asset-run/displayRules";
import type {
  AccountAssetRunRenderActivityParams,
  AccountAssetRunRenderActivityResponse,
} from "@/types/accountAssetRun";

const STALE_MS = 60_000;
const POLL_ACTIVE_MS = 12_000;

export function useAccountAssetRunRenderActivity(
  params: AccountAssetRunRenderActivityParams,
  options?: { enabled?: boolean }
) {
  const enabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ["accountAssetRun", "renderActivity", params] as const,
    queryFn: () => fetchAccountAssetRunRenderActivity(params),
    enabled,
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
      const d = query.state.data as
        | AccountAssetRunRenderActivityResponse
        | undefined;
      const rows = d?.data ?? [];
      return rows.some((row) => isAssetRunActive(row.run.status))
        ? POLL_ACTIVE_MS
        : false;
    },
  });
}
