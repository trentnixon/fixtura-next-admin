"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchGetRendersForDate } from "@/lib/services/scheduler/fetchGetRendersForDate";
import type { SchedulerDueRender } from "@/types/scheduler";

export function useGetRendersForDateRange(
  range: { from: string; to: string } | null,
  options?: { refetchInterval?: number | false },
): UseQueryResult<SchedulerDueRender[], Error> {
  return useQuery<SchedulerDueRender[], Error>({
    queryKey: ["rendersForDate", "range", range?.from ?? "", range?.to ?? ""],
    queryFn: () => {
      if (range == null) {
        throw new Error("Missing render date range");
      }
      return fetchGetRendersForDate({ from: range.from, to: range.to });
    },
    enabled: range != null,
    retry: 3,
    refetchInterval: options?.refetchInterval,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });
}
