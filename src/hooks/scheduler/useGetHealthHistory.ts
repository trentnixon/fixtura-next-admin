import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { HealthHistory } from "@/types/scheduler";
import { fetchGetHealthHistory } from "@/lib/services/scheduler/fetchGetHealthHistory";

export function useGetHealthHistory(days: number = 14): UseQueryResult<HealthHistory[], Error> {
  return useQuery<HealthHistory[], Error>({
    queryKey: ["healthHistory", days],
    queryFn: () => fetchGetHealthHistory(days),
    enabled: true,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}
