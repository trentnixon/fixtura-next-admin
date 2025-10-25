import { useQuery } from "@tanstack/react-query";
import { fetchGamesCricket } from "@/lib/services/games/fetchGamesCricket";
import { Fixture } from "@/types/fixture";

export function useFetchGamesCricket(renderId: string): {
  data: Fixture[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
} {
  return useQuery<Fixture[]>({
    queryKey: ["gameFixtures", renderId],
    queryFn: () => fetchGamesCricket(renderId),
    enabled: !!renderId,
  });
}
