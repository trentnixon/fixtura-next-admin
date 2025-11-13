import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { RerenderRequestAdminResponse } from "@/types/rerender-request";
import { fetchRerenderRequests } from "@/lib/services/rerender-request/fetchRerenderRequests";

/**
 * React Query hook for fetching all rerender requests for admin
 *
 * Provides all rerender requests with metadata including total count.
 * Results are cached for 1 minute and refetched every 5 minutes for real-time updates.
 *
 * @returns UseQueryResult with rerender requests data
 */
export function useRerenderRequests(): UseQueryResult<
  RerenderRequestAdminResponse,
  Error
> {
  return useQuery<RerenderRequestAdminResponse, Error>({
    queryKey: ["rerenderRequests", "admin", "all"],
    queryFn: () => fetchRerenderRequests(),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });
}

/**
 * Convenience hook that returns just the data array and total count
 *
 * @returns Object with data array, total count, and all query state properties
 */
export function useRerenderRequestsData() {
  const { data, ...rest } = useRerenderRequests();

  return {
    ...rest,
    data: data?.data ?? [],
    total: data?.meta.total ?? 0,
  };
}

