import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { TrialAnalytics } from "@/types/analytics";
import { fetchTrialAnalytics } from "@/lib/services/analytics/fetchTrialAnalytics";

/**
 * React Query hook for fetching trial analytics
 *
 * Provides detailed insights into trial usage patterns, conversion funnels, trial success predictors,
 * engagement metrics, and trial performance analysis.
 *
 * @returns UseQueryResult with trial analytics data
 */
export function useTrialAnalytics(): UseQueryResult<TrialAnalytics, Error> {
  return useQuery<TrialAnalytics, Error>({
    queryKey: ["analytics", "trial"],
    queryFn: () => fetchTrialAnalytics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });
}
