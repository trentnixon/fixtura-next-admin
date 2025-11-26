import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  FixtureDetailsResponse,
  FixtureFilters,
} from "@/types/fixtureInsights";
import { fetchFixtureDetails } from "@/lib/services/fixtures/fetchFixtureDetails";

/**
 * React Query hook for fetching fixture details
 *
 * Returns a filtered list of fixtures based on optional filters (association, grade, competition).
 *
 * Caching Strategy:
 * - Stale time: 2 minutes (details endpoint is faster, more dynamic data)
 * - Cache time: 5 minutes
 * - Retries: 3 attempts with exponential backoff
 * - Different filters create separate cache entries
 *
 * @param filters - Optional filters to apply (association, grade, competition)
 * @returns UseQueryResult with filtered fixture details data
 */
export function useFixtureDetails(
  filters?: FixtureFilters
): UseQueryResult<FixtureDetailsResponse, Error> {
  return useQuery<FixtureDetailsResponse, Error>({
    queryKey: ["fixture-details", filters],
    queryFn: () => fetchFixtureDetails(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes as recommended in documentation
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });
}

