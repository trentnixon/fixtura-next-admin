import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MarkHandledResponse,
  RerenderRequestAdminResponse,
  RerenderRequestDetailResponse,
} from "@/types/rerender-request";
import { markRerenderRequestHandled } from "@/lib/services/rerender-request/markRerenderRequestHandled";

/**
 * React Query mutation hook for marking a rerender request as handled
 *
 * Updates the hasBeenHandled boolean field to true for a rerender request.
 * Automatically invalidates and refetches both the rerender requests list and
 * the specific request detail after successful update.
 *
 * @returns Mutation hook with mutate, mutateAsync, and state properties
 */
export function useMarkRerenderRequestHandled() {
  const queryClient = useQueryClient();

  return useMutation<MarkHandledResponse, Error, number>({
    mutationFn: (id: number) => markRerenderRequestHandled(id),
    onSuccess: (data, id) => {
      // Invalidate and refetch rerender requests list
      queryClient.invalidateQueries({
        queryKey: ["rerenderRequests", "admin", "all"],
      });

      // Invalidate and refetch the specific rerender request detail
      queryClient.invalidateQueries({
        queryKey: ["rerenderRequest", "admin", id],
      });

      // Optionally update the specific rerender request in list cache optimistically
      queryClient.setQueryData<RerenderRequestAdminResponse>(
        ["rerenderRequests", "admin", "all"],
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((request) =>
              request.id === id
                ? {
                    ...request,
                    hasBeenHandled: data.data.hasBeenHandled,
                    updatedAt: data.data.updatedAt,
                  }
                : request
            ),
          };
        }
      );

      // Optionally update the specific rerender request detail cache optimistically
      queryClient.setQueryData<RerenderRequestDetailResponse>(
        ["rerenderRequest", "admin", id],
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              hasBeenHandled: data.data.hasBeenHandled,
              updatedAt: data.data.updatedAt,
            },
          };
        }
      );
    },
    retry: (failureCount, error) => {
      // Don't retry on 400 or 404 errors
      if (
        error instanceof Error &&
        (error.message.includes("not found") ||
          error.message.includes("Invalid request"))
      ) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

