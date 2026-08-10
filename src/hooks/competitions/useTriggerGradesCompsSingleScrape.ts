import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { triggerGradesCompsSingleScrape } from "@/lib/services/data-collection/triggerGradesCompsSingleScrape";
import type {
  TriggerGradesCompsSingleScrapeRequest,
  TriggerGradesCompsSingleScrapeSuccessResponse,
} from "@/types/triggerGradesCompsSingleScrape";
import { toast } from "sonner";

/**
 * Hook for triggering single-competition grades scrape via POST /api/competition/trigger-grades-comps-single-scrape.
 *
 * CMS looks up the competition by ID, resolves PlayHQ grades URL from competition.url, and enqueues
 * a job to the Redis queue scrape:grades-comps-single. Bull-bridge-worker picks it up,
 * scrapes the PlayHQ grades page, and POSTs to /api/competition-grades/ingest.
 *
 * @returns Mutation hook with loading states, error handling, and toast notifications
 * @see src/app/dashboard/competitions/[competitionID]/.comms/admin-frontend-trigger-grades-comps-single-integration.md
 */
export function useTriggerGradesCompsSingleScrape(): UseMutationResult<
  TriggerGradesCompsSingleScrapeSuccessResponse,
  Error,
  TriggerGradesCompsSingleScrapeRequest
> {
  const queryClient = useQueryClient();

  return useMutation<
    TriggerGradesCompsSingleScrapeSuccessResponse,
    Error,
    TriggerGradesCompsSingleScrapeRequest
  >({
    mutationFn: async (request: TriggerGradesCompsSingleScrapeRequest) => {
      return await triggerGradesCompsSingleScrape(request);
    },
    onSuccess: (data: TriggerGradesCompsSingleScrapeSuccessResponse, variables) => {
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
        error.message || "Failed to trigger single competition grades scrape"
      );
    },
  });
}
