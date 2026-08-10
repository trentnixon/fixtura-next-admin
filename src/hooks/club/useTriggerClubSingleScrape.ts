import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { triggerClubSingleScrape } from "@/lib/services/data-collection/triggerClubSingleScrape";
import type {
  TriggerClubSingleScrapeRequest,
  TriggerClubSingleScrapeSuccessResponse,
} from "@/types/triggerClubSingleScrape";
import { toast } from "sonner";

/**
 * Hook for triggering single-club scrape via POST /api/club/trigger-club-single-scrape.
 *
 * CMS looks up the club by ID, resolves PlayHQ URL from club.href, and enqueues
 * a job to the Redis queue scrape:club-single. Bull-bridge-worker picks it up,
 * scrapes the PlayHQ page, and POSTs to club-to-competition ingest.
 *
 * @returns Mutation hook with loading states, error handling, and toast notifications
 * @see src/app/dashboard/club/[id]/.comms/admin-frontend-trigger-club-single-integration.md
 */
export function useTriggerClubSingleScrape(): UseMutationResult<
  TriggerClubSingleScrapeSuccessResponse,
  Error,
  TriggerClubSingleScrapeRequest
> {
  const queryClient = useQueryClient();

  return useMutation<
    TriggerClubSingleScrapeSuccessResponse,
    Error,
    TriggerClubSingleScrapeRequest
  >({
    mutationFn: async (request: TriggerClubSingleScrapeRequest) => {
      return await triggerClubSingleScrape(request);
    },
    onSuccess: (data: TriggerClubSingleScrapeSuccessResponse, variables) => {
      const message =
        data.message ||
        `Scrape job queued (Job ID: ${data.jobId}, Queue: ${data.queueName})`;
      toast.success(message);

      queryClient.invalidateQueries({
        queryKey: ["clubAdminDetail", variables.clubId.toString()],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to trigger single club scrape");
    },
  });
}
