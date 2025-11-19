import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchTopAccountsByCost, TopAccountsPeriod, TopAccountsSortBy, SortOrder } from "@/lib/services/rollups/fetchTopAccountsByCost";
import { TopAccount } from "@/types/rollups";

export function useTopAccountsByCost(params: {
  period?: TopAccountsPeriod;
  limit?: number;
  sortBy?: TopAccountsSortBy;
  sortOrder?: SortOrder;
} = {}): UseQueryResult<{ data: TopAccount[]; meta?: { period: string; totalAccounts: number; limit: number } }, Error> {
  return useQuery({
    queryKey: ["rollups", "global", "top-accounts", params],
    queryFn: async () => {
      const res = await fetchTopAccountsByCost(params);
      return res;
    },
    enabled: true,
    staleTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}


