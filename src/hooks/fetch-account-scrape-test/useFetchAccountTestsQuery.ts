import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchAllFetchTestAccounts } from "@/lib/services/fetch-account-scrape-test/fetchAllFetchTestAccounts";
import { TestResponse } from "@/types/fetch-account-scrape-test";

export function useFetchAccountTestsQuery(): UseQueryResult<
  TestResponse,
  Error
> {
  return useQuery<TestResponse, Error>({
    queryKey: ["fetch-account-tests"], // Cache key for the query
    queryFn: async () => {
      return await fetchAllFetchTestAccounts();
    },
    // Global `staleTime` and `cacheTime` from `queryClient` apply here
  });
}
