import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchRenderRollupsBatch } from "@/lib/services/rollups/fetchRenderRollupsBatch";
import { RenderRollup } from "@/types/rollups";

export function useRenderRollupsBatch(
  renderIds: number[]
): UseQueryResult<RenderRollup[], Error> {
  return useQuery<RenderRollup[], Error>({
    queryKey: ["rollups", "render", "batch", ...(renderIds || [])],
    queryFn: async () => {
      const res = await fetchRenderRollupsBatch(renderIds);
      return res.data;
    },
    enabled: Array.isArray(renderIds) && renderIds.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}
