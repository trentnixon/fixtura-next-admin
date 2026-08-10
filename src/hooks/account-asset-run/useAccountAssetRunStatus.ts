"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAccountAssetRunStatus } from "@/lib/services/account-asset-run/fetchAccountAssetRunStatus";
import type { AccountAssetRunDetailResponse } from "@/types/accountAssetRun";
import { isAssetRunActive } from "@/lib/account-asset-run/displayRules";

const STALE_MS = 60_000;
const POLL_ACTIVE_MS = 12_000;

export function useAccountAssetRunStatus(runId: number) {
  const enabled = Number.isFinite(runId) && runId > 0;

  return useQuery({
    queryKey: ["accountAssetRun", "run", runId] as const,
    queryFn: () => fetchAccountAssetRunStatus(runId),
    enabled,
    staleTime: STALE_MS,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    refetchInterval: (query) => {
      const d = query.state.data as AccountAssetRunDetailResponse | undefined;
      const st = d?.data?.status;
      return st != null && isAssetRunActive(st) ? POLL_ACTIVE_MS : false;
    },
  });
}
