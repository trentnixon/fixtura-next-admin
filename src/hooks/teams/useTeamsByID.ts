import { useQuery } from "@tanstack/react-query";
import { TeamData } from "@/types/teamsById";
import { fetchTeamById } from "@/lib/services/teams/fetchTeamsByID";

export function useTeamByID(teamID: number): {
  data: TeamData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
} {
  return useQuery<TeamData>({
    queryKey: ["team", teamID],
    queryFn: () => fetchTeamById(teamID),
    enabled: teamID > 0, // Prevent query from running with empty IDs
  });
}
