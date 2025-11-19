import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchMonthlyRollup } from "@/lib/services/rollups/fetchMonthlyRollup";
import { MonthlyRollup } from "@/types/rollups";

export function useMonthlyRollup(
  year: number | null,
  month: number | null
): UseQueryResult<MonthlyRollup, Error> {
  return useQuery<MonthlyRollup, Error>({
    queryKey: ["rollups", "monthly", year, month],
    queryFn: async () => {
      const res = await fetchMonthlyRollup(year as number, month as number);
      return res.data;
    },
    enabled:
      typeof year === "number" &&
      typeof month === "number" &&
      !Number.isNaN(year) &&
      !Number.isNaN(month),
    staleTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}


