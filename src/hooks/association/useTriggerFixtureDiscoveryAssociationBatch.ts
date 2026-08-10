import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { triggerFixtureDiscoveryAssociationBatch } from "@/lib/services/data-collection/triggerFixtureDiscoveryAssociationBatch";
import type {
  TriggerFixtureDiscoveryAssociationBatchRequest,
  TriggerFixtureDiscoveryAssociationBatchSuccessResponse,
} from "@/types/triggerFixtureDiscoveryAssociationBatch";

function successDescription(
  data: TriggerFixtureDiscoveryAssociationBatchSuccessResponse
): string {
  const runLine = `Run ID: ${data.runId}`;
  if (data.queued === 0 && data.gradesFound > 0) {
    return `No jobs queued — grades may be missing URLs in CMS. ${runLine}`;
  }
  if (data.gradesFound === 0) {
    return `No grades found — association may have no competitions or grades. ${runLine}`;
  }
  return runLine;
}

export function useTriggerFixtureDiscoveryAssociationBatch(): UseMutationResult<
  TriggerFixtureDiscoveryAssociationBatchSuccessResponse,
  Error,
  TriggerFixtureDiscoveryAssociationBatchRequest
> {
  const queryClient = useQueryClient();

  return useMutation<
    TriggerFixtureDiscoveryAssociationBatchSuccessResponse,
    Error,
    TriggerFixtureDiscoveryAssociationBatchRequest
  >({
    mutationFn: async (request) =>
      await triggerFixtureDiscoveryAssociationBatch(request),
    onSuccess: (data, variables) => {
      toast.success(
        `Queued ${data.queued} fixture discovery job(s) (${data.skipped} skipped)`,
        {
          description: successDescription(data),
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["association-detail", variables.associationId],
      });
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          "Failed to trigger association fixture discovery batch"
      );
    },
  });
}
