"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAccountHealthGlobalStatus } from "@/lib/services/account-health/fetchAccountHealthGlobalStatus";
import type { AccountHealthGlobalStatusResponse } from "@/types/accountHealth";

const GLOBAL_STALE_MS = 60_000;
const POLL_MS = 60_000;

export function useAccountHealthGlobalStatus() {
  return useQuery({
    queryKey: ["accountHealth", "global"] as const,
    queryFn: fetchAccountHealthGlobalStatus,
    staleTime: GLOBAL_STALE_MS,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    refetchInterval: (query) => {
      const d = query.state.data as AccountHealthGlobalStatusResponse | undefined;
      const active = d?.data?.activeCount ?? 0;
      return active > 0 ? POLL_MS : false;
    },
  });
}
