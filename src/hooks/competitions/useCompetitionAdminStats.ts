import { useQuery, UseQueryResult } from "@tanstack/react-query";

import {
  CompetitionAdminStatsResponse,
  FetchCompetitionAdminStatsParams,
} from "@/types/competitionAdminStats";
import { fetchCompetitionAdminStats } from "@/lib/services/competitions/fetchCompetitionAdminStats";

const DEFAULT_STALE_TIME = 60 * 1000; // 1 minute

export function useCompetitionAdminStats(
  params: FetchCompetitionAdminStatsParams = {}
): UseQueryResult<CompetitionAdminStatsResponse, Error> {
  return useQuery<CompetitionAdminStatsResponse, Error>({
    queryKey: ["competition", "admin-stats", params],
    queryFn: () => fetchCompetitionAdminStats(params),
    staleTime: DEFAULT_STALE_TIME,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}
