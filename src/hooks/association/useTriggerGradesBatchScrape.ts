import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { triggerGradesBatchScrape } from "@/lib/services/data-collection/triggerGradesBatchScrape";
import type {
  TriggerGradesBatchScrapeRequest,
  TriggerGradesBatchScrapeSuccessResponse,
} from "@/types/triggerGradesBatchScrape";
import { toast } from "sonner";

/**
 * Hook for triggering association-scoped grades batch scrape via
 * POST /api/competition/trigger-grades-batch-scrape (queue scrape:grades-batch).
 */
export function useTriggerGradesBatchScrape(): UseMutationResult<
  TriggerGradesBatchScrapeSuccessResponse,
  Error,
  TriggerGradesBatchScrapeRequest
> {
  const queryClient = useQueryClient();

  return useMutation<
    TriggerGradesBatchScrapeSuccessResponse,
    Error,
    TriggerGradesBatchScrapeRequest
  >({
    mutationFn: async (request: TriggerGradesBatchScrapeRequest) => {
      return await triggerGradesBatchScrape(request);
    },
    onSuccess: (data, variables) => {
      const message =
        data.message ||
        `Scrape job queued (Job ID: ${data.jobId}, Queue: ${data.queueName})`;
      toast.success(message);

      if (variables.associationId != null) {
        queryClient.invalidateQueries({
          queryKey: ["associationDetail", variables.associationId.toString()],
        });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to trigger grades batch scrape");
    },
  });
}
