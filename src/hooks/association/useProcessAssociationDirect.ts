import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { triggerAssociationSingleScrape } from "@/lib/services/data-collection/triggerAssociationSingleScrape";
import type {
  TriggerAssociationSingleScrapeRequest,
  TriggerAssociationSingleScrapeSuccessResponse,
} from "@/types/triggerAssociationSingleScrape";
import { toast } from "sonner";

/**
 * Hook for triggering single-association scrape via POST /api/association-overview-queues/trigger-association-single-scrape
 *
 * This hook queues a background job to scrape the association's PlayHQ page directly.
 * The CMS resolves the URL from association.href and enqueues to scrape:association-single.
 *
 * @returns Mutation hook with loading states, error handling, and toast notifications
 */
export function useProcessAssociationDirect(): UseMutationResult<
  TriggerAssociationSingleScrapeSuccessResponse,
  Error,
  TriggerAssociationSingleScrapeRequest
> {
  const queryClient = useQueryClient();

  return useMutation<
    TriggerAssociationSingleScrapeSuccessResponse,
    Error,
    TriggerAssociationSingleScrapeRequest
  >({
    mutationFn: async (request: TriggerAssociationSingleScrapeRequest) => {
      return await triggerAssociationSingleScrape(request);
    },
    onSuccess: (data, variables) => {
      console.log(
        "[Mutation Success] Single association scrape queued:",
        data
      );

      // Show success notification with job details
      toast.success(
        data.message ||
          `Scrape job queued (Job ID: ${data.jobId}, Queue: ${data.queueName})`
      );

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["associationDetail", variables.associationId.toString()],
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
