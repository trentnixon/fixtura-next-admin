import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminInvoice } from "@/lib/services/orders/updateAdminInvoice";
import {
  adminInvoiceDetailQueryKey,
  isAdminInvoiceListQueryKey,
} from "@/lib/services/orders/adminInvoicePayloads";
import { CmsApiError, toCmsApiError } from "@/lib/services/utils/cms-api-error";
import type {
  AdminInvoicePatchPayload,
  AdminInvoicePatchResponse,
} from "@/types/adminInvoice";

export function useAdminInvoiceUpdate() {
  const queryClient = useQueryClient();

  return useMutation<
    AdminInvoicePatchResponse,
    CmsApiError,
    { invoiceRequestId: number | string; payload: AdminInvoicePatchPayload }
  >({
    mutationFn: async ({ invoiceRequestId, payload }) => {
      try {
        return await updateAdminInvoice(invoiceRequestId, payload);
      } catch (error) {
        throw toCmsApiError(error);
      }
    },
    retry: false,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        adminInvoiceDetailQueryKey(variables.invoiceRequestId),
        data.aggregate
      );

      queryClient.invalidateQueries({
        predicate: (query) => isAdminInvoiceListQueryKey(query.queryKey),
      });
    },
  });
}
