import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MarkAsReadRequest,
  MarkAsReadResponse,
  ContactFormAdminResponse,
} from "@/types/contact-form";
import { markContactFormAsRead } from "@/lib/services/contact-form/markContactFormAsRead";

/**
 * React Query mutation hook for marking a contact form submission as read/acknowledged
 *
 * Updates the hasSeen and/or Acknowledged boolean fields for a contact form submission.
 * Automatically invalidates and refetches the contact forms list after successful update.
 *
 * @returns Mutation hook with mutate, mutateAsync, and state properties
 */
export function useMarkContactFormAsRead() {
  const queryClient = useQueryClient();

  return useMutation<
    MarkAsReadResponse,
    Error,
    { id: number; updates: MarkAsReadRequest }
  >({
    mutationFn: ({ id, updates }) => markContactFormAsRead(id, updates),
    onSuccess: (data, variables) => {
      // Invalidate and refetch contact forms list
      queryClient.invalidateQueries({
        queryKey: ["contactForms", "admin", "all"],
      });

      // Optionally update the specific contact form in cache optimistically
      queryClient.setQueryData<ContactFormAdminResponse>(
        ["contactForms", "admin", "all"],
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((form) =>
              form.id === variables.id
                ? {
                    ...form,
                    hasSeen: data.data.hasSeen,
                    Acknowledged: data.data.Acknowledged,
                  }
                : form
            ),
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
