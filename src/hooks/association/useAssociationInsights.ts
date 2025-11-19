import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  AssociationInsightsResponse,
  SportFilter,
} from "@/types/associationInsights";
import { fetchAssociationInsights } from "@/lib/services/association/fetchAssociationInsights";

/**
 * React Query hook for fetching association admin insights
 *
 * Provides comprehensive analytics about associations including overview statistics,
 * grade/club distributions, competition insights, and detailed per-association metrics.
 *
 * @param sport - Optional sport filter (Cricket, AFL, Hockey, Netball, Basketball)
 * @returns UseQueryResult with association insights data
 */
export function useAssociationInsights(
  sport?: SportFilter
): UseQueryResult<AssociationInsightsResponse, Error> {
  return useQuery<AssociationInsightsResponse, Error>({
    queryKey: ["association-insights", sport],
    queryFn: () => fetchAssociationInsights(sport),
    staleTime: 5 * 60 * 1000, // 5 minutes as recommended in handover
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });
}
