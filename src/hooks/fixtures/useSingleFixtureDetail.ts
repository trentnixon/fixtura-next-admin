import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { SingleFixtureDetailResponse } from "@/types/fixtureDetail";
import { fetchSingleFixtureDetail } from "@/lib/services/fixtures/fetchSingleFixtureDetail";

/**
 * React Query hook for fetching single fixture detail
 *
 * Returns comprehensive detailed information about a single cricket fixture by ID,
 * including all core fixture data, related entities (grade, teams, downloads, render status),
 * validation scoring, and administrative metadata.
 *
 * Caching Strategy:
 * - Stale time: 2 minutes (similar to fixture details endpoint, more dynamic data)
 * - Cache time: 5 minutes
 * - Retries: 3 attempts with exponential backoff
 * - Query is disabled when ID is invalid (not numeric)
 *
 * @param id - Fixture ID (number)
 * @returns UseQueryResult with single fixture detail data
 */
export function useSingleFixtureDetail(
  id: number | null | undefined
): UseQueryResult<SingleFixtureDetailResponse, Error> {
  // Validate ID is numeric
  const isValidId = id !== null && id !== undefined && typeof id === "number" && !isNaN(id);

  return useQuery<SingleFixtureDetailResponse, Error>({
    queryKey: ["single-fixture-detail", id],
    queryFn: () => {
      if (!isValidId) {
        throw new Error("Invalid fixture ID. Must be a number");
      }
      return fetchSingleFixtureDetail(id);
    },
    enabled: isValidId,
    staleTime: 2 * 60 * 1000, // 2 minutes as recommended in documentation
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });
}

