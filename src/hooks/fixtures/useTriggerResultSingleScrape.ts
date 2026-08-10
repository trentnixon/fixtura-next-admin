import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { triggerResultSingleScrape } from "@/lib/services/data-collection/triggerResultSingleScrape";
import type {
  TriggerResultSingleScrapeRequest,
  TriggerResultSingleScrapeSuccessResponse,
} from "@/types/triggerResultSingleScrape";
import { toast } from "sonner";

/**
 * Mutation hook for triggering single-fixture result scrape via
 * POST /api/game-meta-data/trigger-result-single-scrape (queue scrape:result-single).
 *
 * @see src/app/dashboard/fixtures/[id]/.docs/handoff/admin-frontend-trigger-result-single-scrape-integration.md
 */
export function useTriggerResultSingleScrape(): UseMutationResult<
  TriggerResultSingleScrapeSuccessResponse,
  Error,
  TriggerResultSingleScrapeRequest
> {
  const queryClient = useQueryClient();

  return useMutation<
    TriggerResultSingleScrapeSuccessResponse,
    Error,
    TriggerResultSingleScrapeRequest
  >({
    mutationFn: async (request: TriggerResultSingleScrapeRequest) => {
      return await triggerResultSingleScrape(request);
    },
    onSuccess: (
      data: TriggerResultSingleScrapeSuccessResponse,
      variables
    ) => {
      const message =
        data.message ||
        `Scrape job queued (Job ID: ${data.jobId}, Queue: ${data.queueName})`;
      toast.success(message);

      const fixtureKey =
        variables.cmsFixtureId ?? variables.fixtureId;
      if (typeof fixtureKey === "number") {
        queryClient.invalidateQueries({
          queryKey: ["single-fixture-detail", fixtureKey],
        });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to trigger result scrape");
    },
  });
}
