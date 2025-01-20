import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchRenderById } from "@/lib/services/renders/fetchRenderByID";
import { RenderAttributes } from "@/types/render";
import { Download } from "@/types/download";

interface EnhancedRender extends Omit<RenderAttributes, "downloads"> {
  downloads: Download[];
  gameResults: Array<string>;
  upcomingGames: Array<string>;
  grades: Array<string>;
}

type UseRendersQueryResult = UseQueryResult<EnhancedRender, Error> & {
  downloads: Download[];
  gameResults: Array<string>;
  upcomingGames: Array<string>;
  grades: Array<string>;
};

export function useRendersQuery(renderId: string): UseRendersQueryResult {
  const queryResult = useQuery<EnhancedRender, Error>({
    queryKey: ["render", renderId],
    queryFn: async () => {
      const response = await fetchRenderById(renderId);

      // Transform grades to be an array of strings
      const grades = response.attributes.grades_in_renders.data.map(grade =>
        grade.id.toString()
      );

      const gameResults =
        response.attributes.game_results_in_renders?.data?.map(result =>
          result.id.toString()
        );
      const upcomingGames =
        response?.attributes.upcoming_games_in_renders?.data?.map(game =>
          game.id.toString()
        );
      // Extract and format nested data
      const downloads =
        response?.attributes.downloads?.data?.map(download => ({
          ...download,
        })) || [];

      // Return the enhanced render data
      return {
        ...response.attributes,
        downloads,
        gameResults,
        upcomingGames,
        grades,
      };
    },
    enabled: !!renderId,
    retry: 3,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff
  });

  const { data } = queryResult;

  return {
    ...queryResult,
    downloads: data?.downloads || [],
    gameResults: data?.gameResults || [],
    upcomingGames: data?.upcomingGames || [],
    grades: data?.grades || [],
  };
}
