import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ClubAdminDetailResponse } from "@/types/clubAdminDetail";
import { fetchClubAdminDetail } from "@/lib/services/club/fetchClubAdminDetail";

/**
 * React Query hook for fetching club admin detail by ID.
 *
 * Wraps the Club Admin Detail endpoint (`/api/club/admin/:id`) and returns
 * a bundled snapshot of a single club including statistics, associations,
 * teams, competitions, accounts, and insights.
 *
 * @param id - Numeric club identifier (null/undefined/invalid disables query)
 */
export function useClubAdminDetail(
  id: number | null | undefined
): UseQueryResult<ClubAdminDetailResponse, Error> {
  const isValidId =
    typeof id === "number" &&
    !Number.isNaN(id) &&
    Number.isFinite(id) &&
    id > 0 &&
    Number.isInteger(id);

  return useQuery<ClubAdminDetailResponse, Error>({
    queryKey: ["club-admin-detail", id],
    queryFn: () => fetchClubAdminDetail(id as number),
    enabled: isValidId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
}
