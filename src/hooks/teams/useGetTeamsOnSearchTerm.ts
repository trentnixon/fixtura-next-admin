// TODO: Add useGetTeamsOnSearchTerm
import { useQuery } from "@tanstack/react-query";
import { fetchGetTeamsOnSearchTerm } from "@/lib/services/teams/fetchGetTeamsOnSearchTerm";
import { FormattedTeam } from "@/types/team";

export function useGetTeamsOnSearchTerm(searchTerm: string): {
  data: FormattedTeam[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
} {
  return useQuery<FormattedTeam[]>({
    queryKey: ["team", searchTerm],
    queryFn: async () => {
      const teams = await fetchGetTeamsOnSearchTerm(searchTerm);
      return teams; // Return the array directly
    },
    enabled: searchTerm.length > 5, // Prevent query from running with empty IDs
    refetchOnWindowFocus: false, // Disable refetching on window focus
    refetchOnReconnect: false, // Disable refetching on reconnect
  });
}
