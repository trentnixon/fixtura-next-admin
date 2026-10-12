import { useQuery } from "@tanstack/react-query";
import { TeamData } from "@/types/teamsById";
import { fetchTeamById } from "@/lib/services/teams/fetchTeamsByID";

export function useTeamByID(teamID: number): {
  data: TeamData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => Promise<unknown>;
} {
  return useQuery<TeamData>({
    queryKey: ["team", teamID],
    queryFn: () => fetchTeamById(teamID),
    enabled: teamID > 0,
  });
}
