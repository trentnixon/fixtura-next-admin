"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRerenderRequestStatus } from "@/lib/services/rerender-request/updateRerenderRequestStatus";
import {
  RerenderRequestDetailResponse,
  RerenderRequestAdminResponse,
  RerenderRequestStatus,
} from "@/types/rerender-request";

/**
 * React Query hook for updating rerender request status
 *
 * Provides mutation function to update the status of a rerender request
 * and automatically invalidates/updates relevant query caches
 */
export function useUpdateRerenderRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    RerenderRequestDetailResponse,
    Error,
    { id: number; status: RerenderRequestStatus }
  >({
    mutationFn: ({ id, status }) => updateRerenderRequestStatus(id, status),
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Invalidate and refetch rerender requests list
      queryClient.invalidateQueries({
        queryKey: ["rerenderRequests", "admin", "all"],
      });

      // Invalidate and refetch the specific rerender request detail
      queryClient.invalidateQueries({
        queryKey: ["rerenderRequest", "admin", id],
      });

      // Optimistically update the specific rerender request in list cache
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
                    status: data.data.status,
                    updatedAt: data.data.updatedAt,
                  }
                : request
            ),
          };
        }
      );

      // Optimistically update the specific rerender request detail cache
      queryClient.setQueryData<RerenderRequestDetailResponse>(
        ["rerenderRequest", "admin", id],
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              status: data.data.status,
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
          error.message.includes("Invalid request") ||
          error.message.includes("not available"))
      ) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

