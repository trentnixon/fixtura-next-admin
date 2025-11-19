import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchWeeklyRollup } from "@/lib/services/rollups/fetchWeeklyRollup";
import { WeeklyRollup } from "@/types/rollups";

export function useWeeklyRollup(
  year: number | null,
  week: number | null
): UseQueryResult<WeeklyRollup, Error> {
  return useQuery<WeeklyRollup, Error>({
    queryKey: ["rollups", "weekly", year, week],
    queryFn: async () => {
      const res = await fetchWeeklyRollup(year as number, week as number);
      return res.data;
    },
    enabled:
      typeof year === "number" &&
      typeof week === "number" &&
      !Number.isNaN(year) &&
      !Number.isNaN(week),
    staleTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}


