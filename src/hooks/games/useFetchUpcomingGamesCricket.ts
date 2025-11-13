import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchUpcomingGamesCricket } from "@/lib/services/games/fetchUpcomingGamesCricket";
import { Fixture } from "@/types/fixture";

export function useFetchUpcomingGamesCricket(renderId: string): {
  data: Fixture[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: UseQueryResult<Fixture[]>["refetch"];
} {
  const queryResult = useQuery<Fixture[]>({
    queryKey: ["upcomingGameFixtures", renderId],
    queryFn: () => fetchUpcomingGamesCricket(renderId),
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

