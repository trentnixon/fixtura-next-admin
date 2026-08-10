import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchAdminInvoiceDetail } from "@/lib/services/orders/fetchAdminInvoiceDetail";
import { adminInvoiceDetailQueryKey } from "@/lib/services/orders/adminInvoicePayloads";
import { CmsApiError } from "@/lib/services/utils/cms-api-error";
import type { AdminInvoiceAggregate } from "@/types/adminInvoice";

export function useAdminInvoiceDetail(
  invoiceRequestId: number | string | undefined
): UseQueryResult<AdminInvoiceAggregate, CmsApiError> {
  const hasId = invoiceRequestId != null && invoiceRequestId !== "";

  return useQuery({
    queryKey: adminInvoiceDetailQueryKey(invoiceRequestId ?? ""),
    queryFn: () => {
      if (!hasId) {
        throw new Error("Invoice request id is required.");
      }
      return fetchAdminInvoiceDetail(invoiceRequestId);
    },
    enabled: hasId,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
