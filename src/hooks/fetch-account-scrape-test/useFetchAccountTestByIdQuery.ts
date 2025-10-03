import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchFetchTestAccountById } from "@/lib/services/fetch-account-scrape-test/fetchFetchTestAccountById";
import { IndividualTestResponse } from "@/types/fetch-account-scrape-test";

export function useFetchAccountTestByIdQuery(
  testId: string
): UseQueryResult<IndividualTestResponse, Error> {
  return useQuery<IndividualTestResponse, Error>({
    queryKey: ["fetch-account-test", testId], // Cache key for the query
    queryFn: async () => {
      return await fetchFetchTestAccountById(testId);
    },
    enabled: !!testId, // Only run query if testId is provided
    // Global `staleTime` and `cacheTime` from `queryClient` apply here
  });
}
