import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AssociationDetailResponse } from "@/types/associationDetail";
import { fetchAssociationDetail } from "@/lib/services/association/fetchAssociationDetail";

/**
 * React Query hook for fetching association detail by ID
 *
 * Provides comprehensive detailed information about a single association by ID,
 * including all core association data, relational data (competitions, clubs, grades, accounts),
 * detailed statistics, and formatted responses for all related entities.
 *
 * @param id - Numeric association identifier (null, undefined, or invalid values will disable the query)
 * @returns UseQueryResult with association detail data
 */
export function useAssociationDetail(
  id: number | null | undefined
): UseQueryResult<AssociationDetailResponse, Error> {
  // Validate ID is numeric, positive, and finite
  const isValidId =
    typeof id === "number" &&
    !Number.isNaN(id) &&
    Number.isFinite(id) &&
    id > 0 &&
    Number.isInteger(id);

  return useQuery<AssociationDetailResponse, Error>({
    queryKey: ["association-detail", id],
    queryFn: () => fetchAssociationDetail(id as number),
    enabled: isValidId,
    staleTime: 5 * 60 * 1000, // 5 minutes as recommended in handover
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });
}
