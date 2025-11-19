import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchRenderRollupById } from "@/lib/services/rollups/fetchRenderRollupById";
import { RenderRollup } from "@/types/rollups";

export function useRenderRollup(
  renderId: number | null
): UseQueryResult<RenderRollup, Error> {
  return useQuery<RenderRollup, Error>({
    queryKey: ["rollups", "render", renderId],
    queryFn: async () => {
      const res = await fetchRenderRollupById(renderId as number);
      return res.data;
    },
    enabled: typeof renderId === "number" && !Number.isNaN(renderId),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });
}
