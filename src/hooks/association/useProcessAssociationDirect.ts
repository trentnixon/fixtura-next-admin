import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  processAssociationDirect,
  ProcessAssociationDirectRequest,
  ProcessAssociationDirectResponse,
} from "@/lib/services/association/processAssociationDirect";
import { toast } from "sonner";

/**
 * Hook for triggering direct association processing via POST /api/association/process-direct
 *
 * This hook queues a background job to process association data directly by organization ID,
 * without requiring an associated user account. The job is processed asynchronously
 * by the ScrapeAccountSync worker.
 *
 * @returns Mutation hook with loading states, error handling, and toast notifications
 */
export function useProcessAssociationDirect(): UseMutationResult<
  ProcessAssociationDirectResponse,
  Error,
  ProcessAssociationDirectRequest
> {
  const queryClient = useQueryClient();

  return useMutation<
    ProcessAssociationDirectResponse,
    Error,
    ProcessAssociationDirectRequest
  >({
    mutationFn: async (request: ProcessAssociationDirectRequest) => {
      return await processAssociationDirect(request);
    },
    onSuccess: (data: ProcessAssociationDirectResponse) => {
      console.log(
        "[Mutation Success] Association direct processing queued:",
        data
      );

      // Show success notification
      toast.success(
        data.message || "Association processing job queued successfully"
      );

      // Optionally invalidate related queries if needed
      queryClient.invalidateQueries({
        queryKey: ["associationDetail", data.associationId.toString()],
      });
    },
    onError: (error: Error) => {
      console.error(
        "[Mutation Error] Failed to queue association direct processing:",
        error
      );

      // Show error notification
      toast.error(error.message || "Failed to queue association processing");
    },
  });
}
