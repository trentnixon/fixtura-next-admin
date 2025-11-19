import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchAccountMonthlyRollup } from "@/lib/services/rollups/fetchAccountMonthlyRollup";
import { MonthlyRollup } from "@/types/rollups";

export function useAccountMonthlyRollup(
  accountId: number | null,
  year: number | null,
  month: number | null
): UseQueryResult<MonthlyRollup, Error> {
  return useQuery<MonthlyRollup, Error>({
    queryKey: ["rollups", "account", accountId, "month", year, month],
    queryFn: async () => {
      const res = await fetchAccountMonthlyRollup(
        accountId as number,
        year as number,
        month as number
      );
      return res.data;
    },
    enabled:
      typeof accountId === "number" &&
      typeof year === "number" &&
      typeof month === "number" &&
      !Number.isNaN(accountId) &&
      !Number.isNaN(year) &&
      !Number.isNaN(month),
    staleTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}


