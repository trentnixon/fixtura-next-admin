import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchAccountRollupsSummary } from "@/lib/services/rollups/fetchAccountRollupsSummary";
import { AccountRollupsSummary } from "@/types/rollups";

export function useAccountRollupsSummary(
  accountId: number | null
): UseQueryResult<AccountRollupsSummary, Error> {
  return useQuery<AccountRollupsSummary, Error>({
    queryKey: ["rollups", "account", accountId, "summary"],
    queryFn: async () => {
      const res = await fetchAccountRollupsSummary(accountId as number);
      return res.data;
    },
    enabled: typeof accountId === "number" && !Number.isNaN(accountId),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}


