import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AccountSummary } from "@/types/account";
import { fetchAccountsSummary } from "@/lib/services/accounts/fetchAccountsSummary";

export function useAccountSummaryQuery(): UseQueryResult<
  { data: AccountSummary },
  Error
> {
  return useQuery<{ data: AccountSummary }, Error>({
    queryKey: ["accountSummary"], // Cache key based on accountId
    queryFn: () => fetchAccountsSummary(), // Fetch account by ID
    enabled: true, // Only run query if accountId is provided
    retry: 3, // Retry failed requests
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff
  });
}
