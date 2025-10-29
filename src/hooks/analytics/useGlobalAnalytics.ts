import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { GlobalAnalytics } from "@/types/analytics";
import { fetchGlobalAnalytics } from "@/lib/services/analytics/fetchGlobalAnalytics";

/**
 * React Query hook for fetching global analytics summary
 *
 * Provides system-wide metrics including accounts, subscriptions, trials, revenue, and churn analysis.
 *
 * @returns UseQueryResult with global analytics data
 */
export function useGlobalAnalytics(): UseQueryResult<GlobalAnalytics, Error> {
  return useQuery<GlobalAnalytics, Error>({
    queryKey: ["analytics", "global"],
    queryFn: () => fetchGlobalAnalytics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });
}
