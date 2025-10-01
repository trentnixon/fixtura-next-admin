import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchAllFetchTests } from "@/lib/services/fetch-test/fetchAllFetchTests";
import { TestReport } from "@/types/fetch-test";

export function useFetchTestsQuery(): UseQueryResult<TestReport, Error> {
  return useQuery<TestReport, Error>({
    queryKey: ["fetch-tests"], // Cache key for the query
    queryFn: async () => {
      return await fetchAllFetchTests();
    },
    // Global `staleTime` and `cacheTime` from `queryClient` apply here
  });
}
