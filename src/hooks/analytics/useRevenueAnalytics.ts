import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { RevenueAnalytics } from "@/types/analytics";
import { fetchRevenueAnalytics } from "@/lib/services/analytics/fetchRevenueAnalytics";

/**
 * React Query hook for fetching revenue analytics
 *
 * Provides comprehensive revenue analysis including monthly/quarterly trends, revenue by subscription tier,
 * payment method analysis, billing cycles, revenue projections, customer lifetime value, and seasonal patterns.
 *
 * @returns UseQueryResult with revenue analytics data
 */
export function useRevenueAnalytics(): UseQueryResult<RevenueAnalytics, Error> {
  return useQuery<RevenueAnalytics, Error>({
    queryKey: ["analytics", "revenue"],
    queryFn: () => fetchRevenueAnalytics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });
}
