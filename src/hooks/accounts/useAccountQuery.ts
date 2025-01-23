import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchAccountById } from "@/lib/services/accounts/fetchAccountById";
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";

export function useAccountQuery(
  accountId: string
): UseQueryResult<{ data: fixturaContentHubAccountDetails }, Error> {
  return useQuery<{ data: fixturaContentHubAccountDetails }, Error>({
    queryKey: ["fixturaContentHubAccountDetails", accountId], // Cache key based on accountId
    queryFn: () => fetchAccountById(accountId), // Fetch account by ID
    enabled: !!accountId, // Only run query if accountId is provided
    retry: 3, // Retry failed requests
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff
  });
}
