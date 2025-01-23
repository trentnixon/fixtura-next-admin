import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchSchedulerById } from "@/lib/services/scheduler/fetchSchedulerById";
import { Scheduler } from "@/types/scheduler";

export function useSchedulerQuery(
  schedulerId: number
): UseQueryResult<Scheduler, Error> {
  return useQuery<Scheduler, Error>({
    queryKey: ["scheduler", schedulerId], // Unique key for this query
    queryFn: async () => {
      const response = await fetchSchedulerById(schedulerId);
      return response.data; // Unwrapping the `data` property
    },
    enabled: !!schedulerId, // Only fetch if ID is provided
    retry: 3, // Retry failed requests
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff
  });
}
