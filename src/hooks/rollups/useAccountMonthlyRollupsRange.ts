import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchAccountMonthlyRollupsRange, AccountMonthlyRangeParams } from "@/lib/services/rollups/fetchAccountMonthlyRollupsRange";
import { MonthlyRollup } from "@/types/rollups";

export function useAccountMonthlyRollupsRange(
  accountId: number | null,
  params: AccountMonthlyRangeParams
): UseQueryResult<MonthlyRollup[], Error> {
  return useQuery<MonthlyRollup[], Error>({
    queryKey: ["rollups", "account", accountId, "months", params],
    queryFn: async () => {
      const res = await fetchAccountMonthlyRollupsRange(accountId as number, params);
      return res.data;
    },
    enabled:
      typeof accountId === "number" &&
      !Number.isNaN(accountId) &&
      !!params?.startYear &&
      !!params?.startMonth &&
      !!params?.endYear &&
      !!params?.endMonth,
    staleTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}


