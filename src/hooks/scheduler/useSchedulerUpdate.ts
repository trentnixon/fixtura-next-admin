import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { updateSchedulerById } from "@/lib/services/scheduler/updateSchedulerById";
import { Scheduler, SchedulerAttributes } from "@/types/scheduler";

// Define the input and response types for the update mutation
interface UpdateSchedulerInput {
  schedulerId: number;
  payload: Partial<SchedulerAttributes>;
}

export function useSchedulerUpdate(): UseMutationResult<
  Scheduler, // The response type
  Error, // The error type
  UpdateSchedulerInput // The input type
> {
  return useMutation<Scheduler, Error, UpdateSchedulerInput>({
    mutationFn: async (input: UpdateSchedulerInput): Promise<Scheduler> => {
      const { schedulerId, payload } = input;
      const response = await updateSchedulerById(schedulerId, payload);
      return response.data; // Ensure the correct data property is returned
    },
    onError: error => {
      console.error("[Mutation Error] Failed to update scheduler:", error);
    },
    onSuccess: data => {
      console.log("[Mutation Success] Scheduler updated:", data);
    },
  });
}
