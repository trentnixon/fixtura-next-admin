import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchAccountById } from "@/lib/services/accounts/fetchAccountById";
import { Account } from "@/types/account";

export function useAccountQuery(
  accountId: string
): UseQueryResult<{ data: Account }, Error> {
  return useQuery<{ data: Account }, Error>({
    queryKey: ["account", accountId], // Cache key based on accountId
    queryFn: () => fetchAccountById(accountId), // Fetch account by ID
    enabled: !!accountId, // Only run query if accountId is provided
    retry: 3, // Retry failed requests
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff
  });
}
