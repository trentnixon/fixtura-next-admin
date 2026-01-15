import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchSchedulerDetails } from "@/lib/services/scheduler/fetchSchedulerDetails";
import { SchedulerDetails } from "@/types/scheduler";

export function useSchedulerQuery(
  schedulerId: number
): UseQueryResult<SchedulerDetails, Error> {
  return useQuery<SchedulerDetails, Error>({
    queryKey: ["scheduler", schedulerId, "details"], // Unique key for this query
    queryFn: async () => {
      const response = await fetchSchedulerDetails(schedulerId);
      return response.data; // Unwrapping the `data` property
    },
    enabled: !!schedulerId, // Only fetch if ID is provided
    retry: 3, // Retry failed requests
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff
  });
}
