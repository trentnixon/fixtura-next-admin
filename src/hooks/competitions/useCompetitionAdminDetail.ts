import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { CompetitionAdminDetailResponse } from "@/types/competitionAdminDetail";
import { fetchCompetitionAdminDetail } from "@/lib/services/competitions/fetchCompetitionAdminDetail";

const DEFAULT_STALE_TIME = 60 * 1000;

export function useCompetitionAdminDetail(
  competitionId: number | undefined
): UseQueryResult<CompetitionAdminDetailResponse, Error> {
  return useQuery<CompetitionAdminDetailResponse, Error>({
    queryKey: ["competition", "admin-detail", competitionId],
    enabled: typeof competitionId === "number" && !Number.isNaN(competitionId),
    queryFn: () => fetchCompetitionAdminDetail(competitionId as number),
    staleTime: DEFAULT_STALE_TIME,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}
