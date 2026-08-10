"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAccountHealthAccountStatus } from "@/lib/services/account-health/fetchAccountHealthAccountStatus";
import type { AccountHealthAccountStatusResponse } from "@/types/accountHealth";
import { isHealthRunActive } from "@/lib/account-health/displayRules";

const STALE_MS = 60_000;
const POLL_ACTIVE_MS = 12_000;

export function useAccountHealthAccountStatus(accountId: number) {
  const enabled = Number.isFinite(accountId) && accountId > 0;

  return useQuery({
    queryKey: ["accountHealth", "account", accountId] as const,
    queryFn: () => fetchAccountHealthAccountStatus(accountId),
    enabled,
    staleTime: STALE_MS,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    refetchInterval: (query) => {
      const d = query.state.data as
        | AccountHealthAccountStatusResponse
        | undefined;
      const st = d?.data?.latestRun?.status;
      return st != null && isHealthRunActive(st) ? POLL_ACTIVE_MS : false;
    },
  });
}
