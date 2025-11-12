import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  updateAdminOrder,
  UpdateAdminOrderRequest,
  OrderUpdateResponse,
} from "@/lib/services/orders/updateAdminOrder";

/**
 * Hook for updating an admin order via POST /api/orders/admin/:id
 *
 * @returns Mutation hook with loading states, error handling, and automatic cache invalidation
 */
export function useAdminOrderUpdate(): UseMutationResult<
  OrderUpdateResponse,
  Error,
  UpdateAdminOrderRequest
> {
  const queryClient = useQueryClient();

  return useMutation<OrderUpdateResponse, Error, UpdateAdminOrderRequest>({
    mutationFn: async (request: UpdateAdminOrderRequest) => {
      return await updateAdminOrder(request);
    },
    onSuccess: (data, variables) => {
      console.log("[Mutation Success] Order updated:", data);

      // Invalidate order detail query to refresh data
      queryClient.invalidateQueries({
        queryKey: ["adminOrderDetail", variables.id.toString()],
      });

      // Also invalidate order overview queries if needed
      queryClient.invalidateQueries({
        queryKey: ["adminOrderOverview"],
      });
    },
    onError: (error: Error) => {
      console.error("[Mutation Error] Failed to update order:", error);
    },
  });
}
