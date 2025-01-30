import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Competition } from "@/types";
import { fetchCompetitionById } from "@/lib/services/competitions/fetchCompetitionByID";

/**
 * Custom hook to fetch competitions for a specific account using react-query.
 * @param accountId - The ID of the account to fetch competitions for.
 * @returns UseQueryResult containing the competitions or an error.
 */
export function useCompetitionsQuery(
  competitionId: number
): UseQueryResult<Competition, Error> {
  return useQuery<Competition, Error>({
    queryKey: ["competitions", competitionId], // Cache key includes accountId
    queryFn: () => fetchCompetitionById(competitionId), // Fetch competitions by accountId
    enabled: !!competitionId, // Only fetch if accountId is provided
    retry: 3, // Retry failed requests up to 3 times
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff for retries
  });
}
