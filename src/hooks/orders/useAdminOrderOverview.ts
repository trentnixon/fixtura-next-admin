import { useQuery, UseQueryResult } from "@tanstack/react-query";

import {
  FetchOrderOverviewParams,
  OrderOverviewResponse,
} from "@/types/orderOverview";
import { fetchAdminOrderOverview } from "@/lib/services/orders/fetchAdminOrderOverview";

const DEFAULT_STALE_TIME = 60 * 1000; // 1 minute

export function useAdminOrderOverview(
  params: FetchOrderOverviewParams = {}
): UseQueryResult<OrderOverviewResponse, Error> {
  return useQuery<OrderOverviewResponse, Error>({
    queryKey: ["orders", "admin-overview", params],
    queryFn: () => fetchAdminOrderOverview(params),
    staleTime: DEFAULT_STALE_TIME,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}
