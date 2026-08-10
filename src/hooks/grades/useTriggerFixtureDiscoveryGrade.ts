import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { triggerFixtureDiscoveryGrade } from "@/lib/services/data-collection/triggerFixtureDiscoveryGrade";
import type {
  TriggerFixtureDiscoveryGradeRequest,
  TriggerFixtureDiscoveryGradeSuccessResponse,
} from "@/types/triggerFixtureDiscoveryGrade";
import { toast } from "sonner";

export function useTriggerFixtureDiscoveryGrade(): UseMutationResult<
  TriggerFixtureDiscoveryGradeSuccessResponse,
  Error,
  TriggerFixtureDiscoveryGradeRequest
> {
  const queryClient = useQueryClient();

  return useMutation<
    TriggerFixtureDiscoveryGradeSuccessResponse,
    Error,
    TriggerFixtureDiscoveryGradeRequest
  >({
    mutationFn: async (request: TriggerFixtureDiscoveryGradeRequest) => {
      return await triggerFixtureDiscoveryGrade(request);
    },
    onSuccess: (
      data: TriggerFixtureDiscoveryGradeSuccessResponse,
      variables
    ) => {
      const message =
        data.message ||
        `Fixture discovery job queued (Job ID: ${data.jobId}, Queue: ${data.queueName})`;
      toast.success(message);

      queryClient.invalidateQueries({
        queryKey: ["gradeInRender", variables.id],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to trigger fixture discovery");
    },
  });
}
