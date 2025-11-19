import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  fetchRenderRollupsByScheduler,
  FetchRenderRollupsBySchedulerParams,
} from "@/lib/services/rollups/fetchRenderRollupsByScheduler";
import { RenderRollup } from "@/types/rollups";

export function useRenderRollupsByScheduler(
  schedulerId: number | null,
  params: FetchRenderRollupsBySchedulerParams = {}
): UseQueryResult<
  {
    data: RenderRollup[];
    meta?: { total: number; limit: number; offset: number; hasMore: boolean };
  },
  Error
> {
  return useQuery({
    queryKey: ["rollups", "render", "scheduler", schedulerId, params],
    queryFn: async () => {
      const res = await fetchRenderRollupsByScheduler(
        schedulerId as number,
        params
      );
      return res;
    },
    enabled: typeof schedulerId === "number" && !Number.isNaN(schedulerId),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}
