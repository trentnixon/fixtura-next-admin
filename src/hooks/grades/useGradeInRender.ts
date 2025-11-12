import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchGradesInRenderById } from "@/lib/services/grades/fetchGradesInRenderByID";
import { GradesInRender } from "@/types/gradesInRender";

export function useGradeInRender(gradesInRender: string[]): {
  data: GradesInRender[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: UseQueryResult<GradesInRender[]>["refetch"];
} {
  const queryResult = useQuery<GradesInRender[]>({
    queryKey: ["gradeInRender", ...gradesInRender],
    queryFn: () => fetchGradesInRenderById(gradesInRender),
    enabled: gradesInRender.length > 0, // Prevent query from running with empty IDs
  });

  return {
    data: queryResult.data,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error,
    refetch: queryResult.refetch,
  };
}
