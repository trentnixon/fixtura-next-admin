import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchAdminInvoices } from "@/lib/services/orders/fetchAdminInvoices";
import {
  ADMIN_INVOICES_QUERY_PREFIX,
} from "@/lib/services/orders/adminInvoicePayloads";
import { CmsApiError } from "@/lib/services/utils/cms-api-error";
import type {
  AdminInvoiceListResponse,
  FetchAdminInvoicesParams,
} from "@/types/adminInvoice";

export function useAdminInvoices(
  params: FetchAdminInvoicesParams = {},
  options?: { refetchInterval?: number | false }
): UseQueryResult<AdminInvoiceListResponse, CmsApiError> {
  return useQuery({
    queryKey: [...ADMIN_INVOICES_QUERY_PREFIX, params],
    queryFn: () => fetchAdminInvoices(params),
    staleTime: 60_000,
    refetchInterval: options?.refetchInterval,
    refetchOnWindowFocus: false,
  });
}

export function useAdminInvoicesData(
  params: FetchAdminInvoicesParams = {},
  options?: { refetchInterval?: number | false }
) {
  const query = useAdminInvoices(params, options);
  return {
    ...query,
    items: query.data?.items ?? [],
    total: query.data?.meta.total ?? 0,
    meta: query.data?.meta,
  };
}
