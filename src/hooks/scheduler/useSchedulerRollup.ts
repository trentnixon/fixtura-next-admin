// useSchedulerRollup.ts

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchSchedulerRollup } from "@/lib/services/scheduler/fetchSchedulerRollup";
import { SchedulerRollup } from "@/types/scheduler";

// Define the return type of the API response
export function useSchedulerRollup(): UseQueryResult<SchedulerRollup, Error> {
  return useQuery<SchedulerRollup, Error>({
    queryKey: ["schedulerRollup"], // Unique key for this query
    queryFn: async () => {
      const response = await fetchSchedulerRollup();
      return response; // Unwrapping the `data` property
    },
    enabled: true, // Only fetch if ID is provided
    retry: 3, // Retry failed requests

    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff
  });
}
