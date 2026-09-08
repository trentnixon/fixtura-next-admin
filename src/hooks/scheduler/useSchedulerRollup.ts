// useSchedulerRollup.ts

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchSchedulerRollup } from "@/lib/services/scheduler/fetchSchedulerRollup";
import { SchedulerRollup } from "@/types/scheduler";

// Define the return type of the API response
export function useSchedulerRollup(options?: {
  refetchInterval?: number | false;
}): UseQueryResult<SchedulerRollup, Error> {
  return useQuery<SchedulerRollup, Error>({
    queryKey: ["schedulerRollup"],
    queryFn: async () => {
      const response = await fetchSchedulerRollup();
      return response;
    },
    enabled: true,
    retry: 3,
    refetchInterval: options?.refetchInterval,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });
}
