import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { triggerGradesLookupTeamsBatchScrape } from "@/lib/services/data-collection/triggerGradesLookupTeamsBatchScrape";
import type {
  TriggerGradesLookupTeamsBatchScrapeRequest,
  TriggerGradesLookupTeamsBatchScrapeSuccessResponse,
} from "@/types/triggerGradesLookupTeamsBatchScrape";
import { toast } from "sonner";

/**
 * Hook for triggering association-scoped grades lookup teams batch scrape via
 * POST /api/competition/trigger-grades-lookup-teams-batch-scrape (queue scrape:grades-lookup-teams-batch).
 */
export function useTriggerGradesLookupTeamsBatchScrape(): UseMutationResult<
  TriggerGradesLookupTeamsBatchScrapeSuccessResponse,
  Error,
  TriggerGradesLookupTeamsBatchScrapeRequest
> {
  const queryClient = useQueryClient();

  return useMutation<
    TriggerGradesLookupTeamsBatchScrapeSuccessResponse,
    Error,
    TriggerGradesLookupTeamsBatchScrapeRequest
  >({
    mutationFn: async (request: TriggerGradesLookupTeamsBatchScrapeRequest) => {
      return await triggerGradesLookupTeamsBatchScrape(request);
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
      toast.error(
        error.message || "Failed to trigger grades lookup teams batch scrape"
      );
    },
  });
}
