import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchRenderById } from "@/lib/services/renders/fetchRenderByID";
import { Render } from "@/types/render";

export function useRendersQuery(
  renderId: string
): UseQueryResult<Render, Error> {
  return useQuery<Render, Error>({
    queryKey: ["render", renderId], // Unique key for this query
    queryFn: async () => {
      const response = await fetchRenderById(renderId);
      return response; // Unwrapping the `data` property
    },
    enabled: !!renderId, // Only fetch if ID is provided
    retry: 3, // Retry failed requests
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff
  });
}
