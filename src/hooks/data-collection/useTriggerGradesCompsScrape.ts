import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { triggerGradesCompsScrape } from "@/lib/services/data-collection/triggerGradesCompsScrape";
import type {
  TriggerGradesCompsScrapeRequest,
  TriggerGradesCompsScrapeSuccessResponse,
} from "@/types/triggerGradesCompsScrape";
import { toast } from "sonner";

/**
 * Hook for triggering grades-to-competition scrape via POST /api/competition/trigger-grades-comps-scrape.
 *
 * CMS enqueues a job to scrape:grades-comps. Bull-bridge-worker scrapes PlayHQ grades pages
 * and POSTs to /api/competition-grades/ingest.
 *
 * @returns Mutation hook with loading states, error handling, and toast notifications
 * @see src/app/dashboard/data/.comms/admin-frontend-trigger-grades-comps-scrape-integration.md
 */
export function useTriggerGradesCompsScrape(): UseMutationResult<
  TriggerGradesCompsScrapeSuccessResponse,
  Error,
  TriggerGradesCompsScrapeRequest
> {
  const queryClient = useQueryClient();

  return useMutation<
    TriggerGradesCompsScrapeSuccessResponse,
    Error,
    TriggerGradesCompsScrapeRequest
  >({
    mutationFn: async (request: TriggerGradesCompsScrapeRequest) => {
      return await triggerGradesCompsScrape(request);
    },
    onSuccess: (data: TriggerGradesCompsScrapeSuccessResponse) => {
      const message =
        data.message ||
        `Grades scrape job queued (Job ID: ${data.jobId}, Queue: ${data.queueName})`;
      toast.success(message);

      queryClient.invalidateQueries({ queryKey: ["scraperLogs"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to trigger grades comps scrape");
    },
  });
}
