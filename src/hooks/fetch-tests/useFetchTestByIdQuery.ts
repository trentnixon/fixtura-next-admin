import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchFetchTestById } from "@/lib/services/fetch-test/fetchFetchTestById";
import { ByIDResponse } from "@/types/fetch-test";

export function useFetchTestByIdQuery(
  testId: string
): UseQueryResult<ByIDResponse, Error> {
  return useQuery<ByIDResponse, Error>({
    queryKey: ["fetch-test", testId], // Cache key for the query
    queryFn: async () => {
      return await fetchFetchTestById(testId);
    },
    enabled: !!testId, // Only run query if testId is provided
    // Global `staleTime` and `cacheTime` from `queryClient` apply here
  });
}
