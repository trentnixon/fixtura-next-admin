import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchGetRendersForDate } from "@/lib/services/scheduler/fetchGetRendersForDate";
import type { SchedulerDueRender } from "@/types/scheduler";

export function useGetRendersForDate(
  date: string,
  options?: { refetchInterval?: number | false },
): UseQueryResult<SchedulerDueRender[], Error> {
  return useQuery<SchedulerDueRender[], Error>({
    queryKey: ["rendersForDate", date],
    queryFn: () => fetchGetRendersForDate({ date }),
    enabled: /^\d{4}-\d{2}-\d{2}$/.test(date),
    retry: 3,
    refetchInterval: options?.refetchInterval,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });
}
