import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchGlobalCostTrends, TrendGranularity } from "@/lib/services/rollups/fetchGlobalCostTrends";
import { GlobalCostTrends } from "@/types/rollups";

export function useGlobalCostTrends(params: {
  granularity?: TrendGranularity;
  startDate: string;
  endDate: string;
}): UseQueryResult<GlobalCostTrends, Error> {
  return useQuery<GlobalCostTrends, Error>({
    queryKey: ["rollups", "global", "trends", params],
    queryFn: async () => {
      const res = await fetchGlobalCostTrends(params);
      return res.data;
    },
    enabled: !!params?.startDate && !!params?.endDate,
    staleTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}


