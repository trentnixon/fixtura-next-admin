import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchGamesCricket } from "@/lib/services/games/fetchGamesCricket";
import { Fixture } from "@/types/fixture";

export function useFetchGamesCricket(renderId: string): {
  data: Fixture[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: UseQueryResult<Fixture[]>["refetch"];
} {
  const queryResult = useQuery<Fixture[]>({
    queryKey: ["gameFixtures", renderId],
    queryFn: () => fetchGamesCricket(renderId),
    enabled: !!renderId,
  });

  return {
    data: queryResult.data,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error,
    refetch: queryResult.refetch,
  };
}
