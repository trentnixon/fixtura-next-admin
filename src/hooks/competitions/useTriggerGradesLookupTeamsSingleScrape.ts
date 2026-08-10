import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { triggerGradesLookupTeamsSingleScrape } from "@/lib/services/data-collection/triggerGradesLookupTeamsSingleScrape";
import type {
  TriggerGradesLookupTeamsSingleScrapeRequest,
  TriggerGradesLookupTeamsSingleScrapeSuccessResponse,
} from "@/types/triggerGradesLookupTeamsSingleScrape";
import { toast } from "sonner";

/**
 * Hook for triggering single-competition grades-teams scrape via POST /api/competition/trigger-grades-lookup-teams-single-scrape.
 *
 * CMS enqueues a job to scrape:grades-lookup-teams-single. Bull-bridge-worker picks it up,
 * Python fetches grades from CMS via GET /api/grade-teams/by-competition, scrapes each grade's
 * ladder for teams, and POSTs to /api/grade-teams/response.
 *
 * @returns Mutation hook with loading states, error handling, and toast notifications
 * @see src/app/dashboard/competitions/[competitionID]/.comms/admin-frontend-trigger-grades-lookup-teams-single-integration.md
 */
export function useTriggerGradesLookupTeamsSingleScrape(): UseMutationResult<
  TriggerGradesLookupTeamsSingleScrapeSuccessResponse,
  Error,
  TriggerGradesLookupTeamsSingleScrapeRequest
> {
  const queryClient = useQueryClient();

  return useMutation<
    TriggerGradesLookupTeamsSingleScrapeSuccessResponse,
    Error,
    TriggerGradesLookupTeamsSingleScrapeRequest
  >({
    mutationFn: async (
      request: TriggerGradesLookupTeamsSingleScrapeRequest
    ) => {
      return await triggerGradesLookupTeamsSingleScrape(request);
    },
    onSuccess: (
      data: TriggerGradesLookupTeamsSingleScrapeSuccessResponse,
      variables
    ) => {
      const message =
        data.message ||
        `Scrape job queued (Job ID: ${data.jobId}, Queue: ${data.queueName})`;
      toast.success(message);

      queryClient.invalidateQueries({
        queryKey: ["competition", "admin-detail", variables.competitionId],
      });
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Failed to trigger grades lookup teams single scrape"
      );
    },
  });
}
