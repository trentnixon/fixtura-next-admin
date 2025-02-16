// useSchedulerRollup.ts

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { TodaysRenders } from "@/types/scheduler";
import { fetchGetTomorrowsRenders } from "@/lib/services/scheduler/fetchGetTomorrowsRenders";

// Define the return type of the API response
export function useGetTomorrowsRenders(): UseQueryResult<
  TodaysRenders[],
  Error
> {
  return useQuery<TodaysRenders[], Error>({
    queryKey: ["tomorrowsRenders"], // Unique key for this query
    queryFn: async () => {
      const response = await fetchGetTomorrowsRenders();
      return response; // Unwrapping the `data` property
    },
    enabled: true, // Only fetch if ID is provided
    retry: 3, // Retry failed requests

    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff
  });
}
