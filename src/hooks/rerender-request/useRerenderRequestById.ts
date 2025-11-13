import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { RerenderRequestDetailResponse, RerenderRequestDetail } from "@/types/rerender-request";
import { fetchRerenderRequestById } from "@/lib/services/rerender-request/fetchRerenderRequestById";

/**
 * React Query hook for fetching a single rerender request by ID with full details
 *
 * Provides complete rerender request information including account and render details.
 * Results are cached for 1-2 minutes.
 *
 * @param id - The rerender request ID
 * @returns Object with rerender request detail data and query state properties
 */
export function useRerenderRequestById(id: number): {
  data: RerenderRequestDetail | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isFetching: boolean;
  refetch: UseQueryResult<RerenderRequestDetailResponse>["refetch"];
} {
  const queryResult = useQuery<RerenderRequestDetailResponse, Error>({
    queryKey: ["rerenderRequest", "admin", id],
    queryFn: () => fetchRerenderRequestById(id),
    enabled: !!id, // Prevent query from running with invalid ID
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });

  return {
    data: queryResult.data?.data,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error,
    isFetching: queryResult.isFetching,
    refetch: queryResult.refetch,
  };
}

