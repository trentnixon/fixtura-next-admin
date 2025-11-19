import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchDailyRollup } from "@/lib/services/rollups/fetchDailyRollup";
import { DailyRollup } from "@/types/rollups";

export function useDailyRollup(
  date: string | null
): UseQueryResult<DailyRollup, Error> {
  return useQuery<DailyRollup, Error>({
    queryKey: ["rollups", "daily", date],
    queryFn: async () => {
      const res = await fetchDailyRollup(date as string);
      return res.data;
    },
    enabled: !!date,
    staleTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}


