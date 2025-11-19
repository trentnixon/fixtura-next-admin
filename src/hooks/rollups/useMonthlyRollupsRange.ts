import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchMonthlyRollupsRange, MonthlyRangeParams } from "@/lib/services/rollups/fetchMonthlyRollupsRange";
import { MonthlyRollup } from "@/types/rollups";

export function useMonthlyRollupsRange(
  params: MonthlyRangeParams
): UseQueryResult<MonthlyRollup[], Error> {
  return useQuery<MonthlyRollup[], Error>({
    queryKey: ["rollups", "monthly-range", params],
    queryFn: async () => {
      const res = await fetchMonthlyRollupsRange(params);
      return res.data;
    },
    enabled:
      !!params?.startYear &&
      !!params?.startMonth &&
      !!params?.endYear &&
      !!params?.endMonth,
    staleTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}


