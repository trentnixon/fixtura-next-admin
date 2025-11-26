import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ClubInsightsResponse, ClubSportFilter } from "@/types/clubInsights";
import { fetchClubInsights } from "@/lib/services/club/fetchClubInsights";

/**
 * React Query hook for fetching club admin insights
 *
 * Provides comprehensive analytics about clubs including overview statistics,
 * distributions, club listings, team/account insights, and competition timelines.
 *
 * @param sport - Required sport filter (Cricket, AFL, Hockey, Netball, Basketball)
 * @returns UseQueryResult with club insights data
 */
export function useClubInsights(
  sport: ClubSportFilter
): UseQueryResult<ClubInsightsResponse, Error> {
  return useQuery<ClubInsightsResponse, Error>({
    queryKey: ["club-insights", sport],
    queryFn: () => fetchClubInsights(sport),
    enabled: !!sport, // Only run query if sport is provided
    staleTime: 5 * 60 * 1000, // 5 minutes - data updates infrequently
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });
}
