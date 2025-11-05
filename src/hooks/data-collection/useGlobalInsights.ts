import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  GlobalInsightsData,
  UseGlobalInsightsOptions,
} from "@/types/dataCollection";
import { fetchGlobalInsights } from "@/lib/services/data-collection/fetchGlobalInsights";

/**
 * React Query hook for fetching global data collection insights
 *
 * Provides high-level performance and monitoring metrics across all data collections
 * in the system, focusing on time, performance, and operational metrics.
 *
 * @param options - Optional query parameters for filtering and sorting results
 * @returns UseQueryResult with global insights data
 */
export function useGlobalInsights(
  options?: UseGlobalInsightsOptions
): UseQueryResult<GlobalInsightsData, Error> {
  return useQuery<GlobalInsightsData, Error>({
    queryKey: ["globalDataCollectionInsights", JSON.stringify(options || {})],
    queryFn: async () => {
      const response = await fetchGlobalInsights(options);
      return response.data; // Extract the data property from the response wrapper
    },
    staleTime: 3 * 60 * 1000, // 3 minutes - global insights update infrequently
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff (up to 10 seconds)
  });
}
