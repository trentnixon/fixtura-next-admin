import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { triggerRemoveFixturesScrape } from "@/lib/services/data-collection/triggerRemoveFixturesScrape";
import type {
  TriggerRemoveFixturesScrapeRequest,
  TriggerRemoveFixturesScrapeSuccessResponse,
} from "@/types/triggerRemoveFixturesScrape";
import { toast } from "sonner";

/**
 * Mutation hook for triggering remove-fixtures scrape enqueue via
 * POST /api/game-meta-data/trigger-remove-fixtures-scrape (queue scrape:remove-fixtures).
 *
 * @see .comms/admin-frontend-trigger-remove-fixtures-scrape-integration.md
 */
export function useTriggerRemoveFixturesScrape(): UseMutationResult<
  TriggerRemoveFixturesScrapeSuccessResponse,
  Error,
  TriggerRemoveFixturesScrapeRequest
> {
  const queryClient = useQueryClient();

  return useMutation<
    TriggerRemoveFixturesScrapeSuccessResponse,
    Error,
    TriggerRemoveFixturesScrapeRequest
  >({
    mutationFn: async (request: TriggerRemoveFixturesScrapeRequest) => {
      return await triggerRemoveFixturesScrape(request);
    },
    onSuccess: (data, variables) => {
      if (data.jobsQueued > 0) {
        const message =
          data.message ||
          `${data.targetsEnqueued} fixture(s) enqueued, ${data.jobsQueued} job(s), run ${data.runId}`;
        toast.success(message);
      } else {
        toast.info(
          `No jobs enqueued. Discovered ${data.targetsDiscovered}, skipped ${data.targetsSkipped}.`
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
      toast.error(error.message || "Failed to trigger remove-fixtures scrape");
    },
  });
}
