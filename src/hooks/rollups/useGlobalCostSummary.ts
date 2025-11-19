import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchGlobalCostSummary, GlobalSummaryPeriod } from "@/lib/services/rollups/fetchGlobalCostSummary";
import { GlobalCostSummary } from "@/types/rollups";

export function useGlobalCostSummary(
  period: GlobalSummaryPeriod = "current-month"
): UseQueryResult<GlobalCostSummary, Error> {
  return useQuery<GlobalCostSummary, Error>({
    queryKey: ["rollups", "global", "summary", period],
    queryFn: async () => {
      const res = await fetchGlobalCostSummary(period);
      return res.data;
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}


