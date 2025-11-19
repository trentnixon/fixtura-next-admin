import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchWeeklyRollupsRange, WeeklyRangeParams } from "@/lib/services/rollups/fetchWeeklyRollupsRange";
import { WeeklyRollup } from "@/types/rollups";

export function useWeeklyRollupsRange(
  params: WeeklyRangeParams
): UseQueryResult<WeeklyRollup[], Error> {
  return useQuery<WeeklyRollup[], Error>({
    queryKey: ["rollups", "weekly-range", params],
    queryFn: async () => {
      const res = await fetchWeeklyRollupsRange(params);
      return res.data;
    },
    enabled:
      !!params?.startYear &&
      !!params?.startWeek &&
      !!params?.endYear &&
      !!params?.endWeek,
    staleTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}


