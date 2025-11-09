import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchCompetitionClubDrilldown } from "@/lib/services/competitions/fetchCompetitionClubDrilldown";
import { CompetitionClubDrilldownResponse } from "@/types/competitionClubDrilldown";

const DEFAULT_STALE_TIME = 60 * 1000;

export function useCompetitionClubDrilldown(
  clubId: number | undefined
): UseQueryResult<CompetitionClubDrilldownResponse, Error> {
  return useQuery<CompetitionClubDrilldownResponse, Error>({
    queryKey: ["competition", "club-drilldown", clubId],
    enabled: typeof clubId === "number" && !Number.isNaN(clubId),
    queryFn: () => fetchCompetitionClubDrilldown(clubId as number),
    staleTime: DEFAULT_STALE_TIME,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}
