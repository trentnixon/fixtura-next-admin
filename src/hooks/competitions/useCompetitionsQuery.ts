import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { fetchAccountCompetitions } from "@/lib/services/competitions/fetchCompetitions";
import { ValidCompetitionsResponse } from "@/types/validCompetitions";

/**
 * Custom hook to fetch competitions for a specific account using react-query.
 * @param organizationId - The ID of the organization to fetch competitions for.
 * @param account_type - The type of account (club or association).
 * @returns UseQueryResult containing the competitions or an error.
 */
export function useCompetitionsQuery(
  organizationId: number | undefined,
  account_type: number | undefined
): UseQueryResult<ValidCompetitionsResponse, Error> {
  return useQuery<ValidCompetitionsResponse, Error>({
    queryKey: ["competitions", organizationId], // Cache key includes organizationId
    queryFn: () => fetchAccountCompetitions(organizationId!, account_type!), // Fetch competitions by organizationId
    enabled: !!organizationId && account_type !== undefined, // Only fetch if both are provided
    retry: 3, // Retry failed requests up to 3 times
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff for retries
  });
}
