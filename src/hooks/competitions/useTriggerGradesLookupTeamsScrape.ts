import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { triggerGradesLookupTeamsScrape } from "@/lib/services/data-collection/triggerGradesLookupTeamsScrape";
import type {
  TriggerGradesLookupTeamsScrapeRequest,
  TriggerGradesLookupTeamsScrapeSuccessResponse,
} from "@/types/triggerGradesLookupTeamsScrape";
import { toast } from "sonner";

/**
 * Hook for triggering grade-teams scrape via POST /api/grade-teams/trigger-grades-lookup-teams-scrape.
 *
 * CMS enqueues a job to scrape:grades-lookup-teams. Bull-bridge-worker scrapes PlayHQ ladder pages
 * for teams per grade and POSTs to /api/grade-teams/response.
 *
 * @returns Mutation hook with loading states, error handling, and toast notifications
 * @see src/app/dashboard/competitions/[competitionID]/.comms/admin-frontend-trigger-grades-lookup-teams-integration.md
 */
export function useTriggerGradesLookupTeamsScrape(): UseMutationResult<
  TriggerGradesLookupTeamsScrapeSuccessResponse,
  Error,
  TriggerGradesLookupTeamsScrapeRequest
> {
  const queryClient = useQueryClient();

  return useMutation<
    TriggerGradesLookupTeamsScrapeSuccessResponse,
    Error,
    TriggerGradesLookupTeamsScrapeRequest
  >({
    mutationFn: async (request: TriggerGradesLookupTeamsScrapeRequest) => {
      return await triggerGradesLookupTeamsScrape(request);
    },
    onSuccess: (data: TriggerGradesLookupTeamsScrapeSuccessResponse) => {
      const message =
        data.message ||
        `Grade teams scrape job queued (Job ID: ${data.jobId}, Queue: ${data.queueName})`;
      toast.success(message);

      queryClient.invalidateQueries({ queryKey: ["scraperLogs"] });
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Failed to trigger grades lookup teams scrape"
      );
    },
  });
}
