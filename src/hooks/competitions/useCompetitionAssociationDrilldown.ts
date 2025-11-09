import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchCompetitionAssociationDrilldown } from "@/lib/services/competitions/fetchCompetitionAssociationDrilldown";
import { CompetitionAssociationDrilldownResponse } from "@/types/competitionAssociationDrilldown";

const DEFAULT_STALE_TIME = 60 * 1000;

export function useCompetitionAssociationDrilldown(
  associationId: number | undefined
): UseQueryResult<CompetitionAssociationDrilldownResponse, Error> {
  return useQuery<CompetitionAssociationDrilldownResponse, Error>({
    queryKey: ["competition", "association-drilldown", associationId],
    enabled: typeof associationId === "number" && !Number.isNaN(associationId),
    queryFn: () =>
      fetchCompetitionAssociationDrilldown(associationId as number),
    staleTime: DEFAULT_STALE_TIME,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}
