import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  processClubDirect,
  ProcessClubDirectRequest,
  ProcessClubDirectResponse,
} from "@/lib/services/club/processClubDirect";
import { toast } from "sonner";

/**
 * Hook for triggering direct club processing via POST /api/club/process-direct
 *
 * This hook queues a background job to process club data directly by organization ID,
 * without requiring an associated user account. The job is processed asynchronously
 * by the ScrapeAccountSync worker.
 *
 * @returns Mutation hook with loading states, error handling, and toast notifications
 */
export function useProcessClubDirect(): UseMutationResult<
  ProcessClubDirectResponse,
  Error,
  ProcessClubDirectRequest
> {
  const queryClient = useQueryClient();

  return useMutation<
    ProcessClubDirectResponse,
    Error,
    ProcessClubDirectRequest
  >({
    mutationFn: async (request: ProcessClubDirectRequest) => {
      return await processClubDirect(request);
    },
    onSuccess: (data: ProcessClubDirectResponse) => {
      console.log("[Mutation Success] Club direct processing queued:", data);

      // Show success notification
      toast.success(data.message || "Club processing job queued successfully");

      // Optionally invalidate related queries if needed
      queryClient.invalidateQueries({
        queryKey: ["clubAdminDetail", data.clubId.toString()],
      });
    },
    onError: (error: Error) => {
      console.error(
        "[Mutation Error] Failed to queue club direct processing:",
        error
      );

      // Show error notification
      toast.error(error.message || "Failed to queue club processing");
    },
  });
}
