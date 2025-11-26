import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { FixtureInsightsResponse } from "@/types/fixtureInsights";
import { fetchFixtureInsights } from "@/lib/services/fixtures/fetchFixtureInsights";

/**
 * React Query hook for fetching fixture insights
 *
 * Provides comprehensive analytics about fixtures including overview statistics,
 * categorized summaries (by association, competition, grade), charts, and distributions.
 *
 * Caching Strategy:
 * - Stale time: 5 minutes (insights endpoint is slow, 10-15s response time)
 * - Cache time: 10 minutes
 * - Retries: 3 attempts with exponential backoff
 *
 * @returns UseQueryResult with fixture insights data
 */
export function useFixtureInsights(): UseQueryResult<
  FixtureInsightsResponse,
  Error
> {
  return useQuery<FixtureInsightsResponse, Error>({
    queryKey: ["fixture-insights"],
    queryFn: () => fetchFixtureInsights(),
    staleTime: 5 * 60 * 1000, // 5 minutes as recommended in documentation
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });
}

