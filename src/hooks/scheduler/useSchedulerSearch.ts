import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchListSchedulers } from "@/lib/services/scheduler/fetchListSchedulers";
import { Scheduler } from "@/types/scheduler";

export function useSchedulerSearch(searchTerm: string): UseQueryResult<Scheduler[], Error> {
  return useQuery<Scheduler[], Error>({
    queryKey: ["schedulerSearch", searchTerm],
    queryFn: () => fetchListSchedulers(searchTerm),
    enabled: searchTerm.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
