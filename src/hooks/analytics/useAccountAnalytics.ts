import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AccountAnalytics } from "@/types/analytics";
import { fetchAccountAnalytics } from "@/lib/services/analytics/fetchAccountAnalytics";

/**
 * React Query hook for fetching account-specific analytics
 *
 * Provides detailed insights for individual accounts including order history, subscription timeline,
 * trial usage, payment status, renewal patterns, and account health scoring.
 *
 * @param accountId - The account ID to fetch analytics for
 * @returns UseQueryResult with account analytics data
 */
export function useAccountAnalytics(
  accountId: string
): UseQueryResult<AccountAnalytics, Error> {
  return useQuery<AccountAnalytics, Error>({
    queryKey: ["analytics", "account", accountId],
    queryFn: () => fetchAccountAnalytics(accountId),
    enabled: !!accountId, // Only run query if accountId is provided
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });
}
