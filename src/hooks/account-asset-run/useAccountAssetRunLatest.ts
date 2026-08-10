"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAccountAssetRunLatest } from "@/lib/services/account-asset-run/fetchAccountAssetRunLatest";
import type { AccountAssetRunLatestResponse } from "@/types/accountAssetRun";
import { isAssetRunActive } from "@/lib/account-asset-run/displayRules";

const STALE_MS = 60_000;
const POLL_ACTIVE_MS = 12_000;

export function useAccountAssetRunLatest(accountId: number) {
  const enabled = Number.isFinite(accountId) && accountId > 0;

  return useQuery({
    queryKey: ["accountAssetRun", "account", accountId] as const,
    queryFn: () => fetchAccountAssetRunLatest(accountId),
    enabled,
    staleTime: STALE_MS,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    refetchInterval: (query) => {
      const d = query.state.data as AccountAssetRunLatestResponse | undefined;
      const st = d?.data?.status;
      return st != null && isAssetRunActive(st) ? POLL_ACTIVE_MS : false;
    },
  });
}
