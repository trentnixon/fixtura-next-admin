import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { YesterdaysRenders } from "@/types/scheduler";
import { fetchGetYesterdaysRenders } from "@/lib/services/scheduler/fetchGetYesterdaysRenders";

export function useGetYesterdaysRenders(): UseQueryResult<YesterdaysRenders[], Error> {
  return useQuery<YesterdaysRenders[], Error>({
    queryKey: ["yesterdaysRenders"],
    queryFn: async () => {
      const response = await fetchGetYesterdaysRenders();
      return response;
    },
    enabled: true,
    retry: 3,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000),
  });
}
