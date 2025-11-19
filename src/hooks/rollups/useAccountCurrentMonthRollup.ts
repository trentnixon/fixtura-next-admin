import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchAccountCurrentMonthRollup } from "@/lib/services/rollups/fetchAccountCurrentMonthRollup";
import { MonthlyRollup } from "@/types/rollups";

export function useAccountCurrentMonthRollup(
  accountId: number | null
): UseQueryResult<MonthlyRollup, Error> {
  return useQuery<MonthlyRollup, Error>({
    queryKey: ["rollups", "account", accountId, "current-month"],
    queryFn: async () => {
      const res = await fetchAccountCurrentMonthRollup(accountId as number);
      return res.data;
    },
    enabled: typeof accountId === "number" && !Number.isNaN(accountId),
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}
