import { useQuery } from "@tanstack/react-query";
import { fetchGetAccountDetailsFromRenderId } from "@/lib/services/renders/fetchGetAccountDetailsFromRenderId";
import { GetAccountFromRender } from "@/types";

export function useGetAccountDetailsFromRenderId(renderId: string): {
  data: GetAccountFromRender | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
} {
  return useQuery<GetAccountFromRender>({
    queryKey: ["accountDetailsFromRender", renderId],
    queryFn: () => fetchGetAccountDetailsFromRenderId(renderId),
    enabled: !!renderId, // Prevent query from running with empty IDs
  });
}
