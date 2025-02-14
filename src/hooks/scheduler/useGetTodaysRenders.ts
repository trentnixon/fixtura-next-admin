// useSchedulerRollup.ts

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { TodaysRenders } from "@/types/scheduler";
import { fetchGetTodaysRenders } from "@/lib/services/scheduler/fetchGetTodaysRenders";

// Define the return type of the API response
export function useGetTodaysRenders(): UseQueryResult<TodaysRenders[], Error> {
  return useQuery<TodaysRenders[], Error>({
    queryKey: ["todaysRenders"], // Unique key for this query
    queryFn: async () => {
      const response = await fetchGetTodaysRenders();
      return response; // Unwrapping the `data` property
    },
    enabled: true, // Only fetch if ID is provided
    retry: 3, // Retry failed requests

    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff
  });
}
