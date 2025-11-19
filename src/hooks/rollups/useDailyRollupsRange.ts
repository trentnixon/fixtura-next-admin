import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchDailyRollupsRange, DailyRangeParams } from "@/lib/services/rollups/fetchDailyRollupsRange";
import { DailyRollup } from "@/types/rollups";

export function useDailyRollupsRange(
  params: DailyRangeParams
): UseQueryResult<DailyRollup[], Error> {
  return useQuery<DailyRollup[], Error>({
    queryKey: ["rollups", "daily-range", params],
    queryFn: async () => {
      const res = await fetchDailyRollupsRange(params);
      return res.data;
    },
    enabled: !!params?.startDate && !!params?.endDate,
    staleTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}


