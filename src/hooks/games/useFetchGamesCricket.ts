/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { fetchGamesCricket } from "@/lib/services/games/fetchGamesCricket";

export function useFetchGamesCricket(gameMetaData: string[]): {
  data: any;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
} {
  return useQuery<any>({
    queryKey: ["gameMetaData", ...gameMetaData],
    queryFn: () => fetchGamesCricket(gameMetaData),
    enabled: gameMetaData.length > 0, // Prevent query from running with empty IDs
  });
}
