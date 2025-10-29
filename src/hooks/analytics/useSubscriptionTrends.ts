import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { SubscriptionTrends } from "@/types/analytics";
import { fetchSubscriptionTrends } from "@/lib/services/analytics/fetchSubscriptionTrends";

/**
 * React Query hook for fetching subscription trends analytics
 *
 * Analyzes subscription lifecycle patterns, renewal vs churn rates, tier migration trends,
 * subscription duration patterns, and customer journey analysis.
 *
 * @returns UseQueryResult with subscription trends analytics data
 */
export function useSubscriptionTrends(): UseQueryResult<
  SubscriptionTrends,
  Error
> {
  return useQuery<SubscriptionTrends, Error>({
    queryKey: ["analytics", "subscription-trends"],
    queryFn: () => fetchSubscriptionTrends(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });
}
