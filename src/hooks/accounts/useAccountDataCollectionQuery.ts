import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AccountStatsResponse } from "@/types/dataCollection";
import { fetchAccountDataCollection } from "@/lib/services/data-collection/fetchAccountDataCollection";

/**
 * React Query hook for fetching account-specific data collection statistics
 *
 * Provides comprehensive account-specific data collection insights including entity statistics,
 * performance metrics, error analysis, temporal patterns, account health scoring, and time series data.
 *
 * @param accountId - The account ID to fetch data collection statistics for
 * @returns UseQueryResult with account data collection statistics
 */
export function useAccountDataCollectionQuery(
  accountId: string
): UseQueryResult<AccountStatsResponse, Error> {
  return useQuery<AccountStatsResponse, Error>({
    queryKey: ["accountDataCollection", accountId],
    queryFn: () => fetchAccountDataCollection(accountId),
    enabled: !!accountId, // Only run query if accountId is provided
    staleTime: 3 * 60 * 1000, // 3 minutes - data collection stats update infrequently
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });
}
