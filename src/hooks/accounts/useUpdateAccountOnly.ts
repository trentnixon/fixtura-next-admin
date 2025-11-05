import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { updateAccountOnly } from "@/lib/services/data-collection/updateAccountOnly";
import {
  UpdateAccountOnlyRequest,
  UpdateAccountOnlyResponse,
} from "@/types/dataCollection";

/**
 * Hook for triggering lightweight account metadata updates via the updateAccountOnly Redis Bull queue.
 * This is a lighter alternative to the full account sync endpoint and only updates account
 * metadata without processing competitions, teams, or games.
 *
 * @returns Mutation hook with loading states, error handling, and automatic cache invalidation
 */
export function useUpdateAccountOnly(): UseMutationResult<
  UpdateAccountOnlyResponse, // The response type
  Error, // The error type
  UpdateAccountOnlyRequest // The input type
> {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateAccountOnlyResponse,
    Error,
    UpdateAccountOnlyRequest
  >({
    mutationFn: async (
      data: UpdateAccountOnlyRequest
    ): Promise<UpdateAccountOnlyResponse> => {
      return await updateAccountOnly(data);
    },
    onSuccess: (data: UpdateAccountOnlyResponse) => {
      console.log("[Mutation Success] Account update queued:", data);

      // Invalidate account queries to refresh data after sync
      queryClient.invalidateQueries({
        queryKey: [
          "fixturaContentHubAccountDetails",
          data.accountId.toString(),
        ],
      });

      // Also invalidate account summary queries if needed
      queryClient.invalidateQueries({
        queryKey: ["accountSummary"],
      });
    },
    onError: (error: Error) => {
      console.error("[Mutation Error] Failed to queue account update:", error);
    },
  });
}
