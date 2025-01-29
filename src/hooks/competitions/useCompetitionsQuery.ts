import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { fetchAccountCompetitions } from "@/lib/services/competitions/fetchCompetitions";
import { ValidCompetitionsResponse } from "@/types/validCompetitions";

/**
 * Custom hook to fetch competitions for a specific account using react-query.
 * @param accountId - The ID of the account to fetch competitions for.
 * @returns UseQueryResult containing the competitions or an error.
 */
export function useCompetitionsQuery(
  organizationId: number,
  account_type: number
): UseQueryResult<ValidCompetitionsResponse, Error> {
  return useQuery<ValidCompetitionsResponse, Error>({
    queryKey: ["competitions", organizationId], // Cache key includes accountId
    queryFn: () => fetchAccountCompetitions(organizationId, account_type), // Fetch competitions by accountId
    enabled: !!organizationId, // Only fetch if accountId is provided
    retry: 3, // Retry failed requests up to 3 times
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff for retries
  });
}
