import { useQuery } from "@tanstack/react-query";
import { fetchGradeById } from "@/lib/services/grades/fetchGradesByID";
import { Grade } from "@/types";

export function useGradeByID(gradeID: number): {
  data: Grade | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
} {
  return useQuery<Grade>({
    queryKey: ["gradeInRender", gradeID],
    queryFn: () => fetchGradeById(gradeID),
    enabled: gradeID > 0, // Prevent query from running with empty IDs
  });
}
