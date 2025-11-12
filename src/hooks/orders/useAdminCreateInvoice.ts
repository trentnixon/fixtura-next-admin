import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { createAdminInvoice } from "@/lib/services/orders/createAdminInvoice";
import type {
  AdminCreateInvoicePayload,
  AdminCreateInvoiceResponse,
} from "@/types/orderDetail";

/**
 * Hook for creating an admin invoice order via POST /api/orders/admin/create-invoice
 *
 * @returns Mutation hook with loading states, error handling, and automatic cache invalidation
 */
export function useAdminCreateInvoice(): UseMutationResult<
  AdminCreateInvoiceResponse,
  Error,
  AdminCreateInvoicePayload
> {
  const queryClient = useQueryClient();

  return useMutation<
    AdminCreateInvoiceResponse,
    Error,
    AdminCreateInvoicePayload
  >({
    mutationFn: async (payload: AdminCreateInvoicePayload) => {
      return await createAdminInvoice(payload);
    },
    onSuccess: (data) => {
      console.log("[Mutation Success] Invoice created:", data);

      // Invalidate order overview query to refresh list with new invoice
      queryClient.invalidateQueries({
        queryKey: ["adminOrderOverview"],
      });

      // Invalidate order detail queries (in case we navigate to the created order)
      queryClient.invalidateQueries({
        queryKey: ["adminOrderDetail"],
      });

      // Optionally invalidate account-specific queries if needed
      // This would require accountId in the response or payload
    },
    onError: (error: Error) => {
      console.error("[Mutation Error] Failed to create invoice:", error);
    },
  });
}

