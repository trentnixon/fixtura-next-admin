"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAccountHealthRunStatus } from "@/lib/services/account-health/fetchAccountHealthRunStatus";
import type { AccountHealthRunStatusResponse } from "@/types/accountHealth";
import { isHealthRunActive } from "@/lib/account-health/displayRules";

const STALE_MS = 60_000;
const POLL_ACTIVE_MS = 12_000;

export function useAccountHealthRunStatus(runId: number) {
  const enabled = Number.isFinite(runId) && runId > 0;

  return useQuery({
    queryKey: ["accountHealth", "run", runId] as const,
    queryFn: () => fetchAccountHealthRunStatus(runId),
    enabled,
    staleTime: STALE_MS,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    refetchInterval: (query) => {
      const d = query.state.data as AccountHealthRunStatusResponse | undefined;
      const st = d?.data?.status;
      return st != null && isHealthRunActive(st) ? POLL_ACTIVE_MS : false;
    },
  });
}
