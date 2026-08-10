import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { triggerResultBatchScrape } from "@/lib/services/data-collection/triggerResultBatchScrape";
import type {
  TriggerResultBatchScrapeRequest,
  TriggerResultBatchScrapeSuccessResponse,
} from "@/types/triggerResultBatchScrape";
import { toast } from "sonner";

/**
 * Mutation hook for triggering batch result scrape via
 * POST /api/game-meta-data/trigger-result-batch-scrape (queue scrape:result-batch).
 *
 * @see src/app/dashboard/competitions/.comms/admin-frontend-trigger-result-batch-scrape-integration.md
 */
export function useTriggerResultBatchScrape(): UseMutationResult<
  TriggerResultBatchScrapeSuccessResponse,
  Error,
  TriggerResultBatchScrapeRequest
> {
  const queryClient = useQueryClient();

  return useMutation<
    TriggerResultBatchScrapeSuccessResponse,
    Error,
    TriggerResultBatchScrapeRequest
  >({
    mutationFn: async (request: TriggerResultBatchScrapeRequest) => {
      return await triggerResultBatchScrape(request);
    },
    onSuccess: (
      data: TriggerResultBatchScrapeSuccessResponse,
      variables
    ) => {
      if (data.jobsQueued > 0) {
        const message =
          data.message ||
          `${data.targetsEnqueued} fixture(s) enqueued, ${data.jobsQueued} job(s), run ${data.runId}`;
        toast.success(message);
      } else {
        toast.info(
          `No fixtures enqueued. Discovered ${data.targetsDiscovered}, skipped ${data.targetsSkipped}.`
        );
      }

      if (variables.sourceType === "grade") {
        queryClient.invalidateQueries({
          queryKey: ["gradeInRender", variables.sourceId],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["competition", "admin-detail", variables.sourceId],
        });
      }

      queryClient.invalidateQueries({ queryKey: ["scraperLogs"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to trigger result batch scrape");
    },
  });
}
