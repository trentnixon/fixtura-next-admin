import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  syncAccountResults,
  SyncAccountResultsRequest,
  SyncAccountResultsResponse,
} from "@/lib/services/data-collection/syncAccountResults";

/**
 * React Query mutation hook for syncing account results-only scrape.
 *
 * This hook triggers a results-only scrape that updates fixture results without
 * triggering asset creation. After successful queue, it invalidates the account
 * data collection query to trigger a refetch.
 *
 * @returns UseMutationResult with sync function and loading/error states
 */
export function useSyncAccountResults(): UseMutationResult<
  SyncAccountResultsResponse,
  Error,
  SyncAccountResultsRequest
> {
  const queryClient = useQueryClient();

  return useMutation<
    SyncAccountResultsResponse,
    Error,
    SyncAccountResultsRequest
  >({
    mutationFn: syncAccountResults,
    onSuccess: (data, variables) => {
      console.log("[useSyncAccountResults] Sync successful:", data);

      // Invalidate and refetch the account data collection query
      queryClient.invalidateQueries({
        queryKey: ["accountDataCollection", variables.accountId.toString()],
      });

      // Optionally invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["account", variables.accountId.toString()],
      });
    },
    onError: (error) => {
      console.error("[useSyncAccountResults] Sync failed:", error);
    },
  });
}
