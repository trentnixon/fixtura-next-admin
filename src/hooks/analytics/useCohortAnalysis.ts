import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { CohortAnalysis } from "@/types/analytics";
import { fetchCohortAnalysis } from "@/lib/services/analytics/fetchCohortAnalysis";

/**
 * React Query hook for fetching cohort analysis
 *
 * Provides comprehensive customer cohort analysis including acquisition cohorts, retention analysis,
 * lifecycle stages, revenue patterns, churn analysis, and customer segmentation.
 *
 * @returns UseQueryResult with cohort analysis data
 */
export function useCohortAnalysis(): UseQueryResult<CohortAnalysis, Error> {
  return useQuery<CohortAnalysis, Error>({
    queryKey: ["analytics", "cohort"],
    queryFn: () => fetchCohortAnalysis(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });
}
