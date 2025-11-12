import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { OrderDetailResponse } from "@/types/orderDetail";
import { fetchAdminOrderDetail } from "@/lib/services/orders/fetchAdminOrderDetail";

const DEFAULT_STALE_TIME = 60 * 1000; // 1 minute

export function useAdminOrderDetail(
  id: number | string | undefined
): UseQueryResult<OrderDetailResponse, Error> {
  return useQuery<OrderDetailResponse, Error>({
    queryKey: ["orders", "admin", "detail", id],
    queryFn: () => {
      if (id === undefined || id === null || id === "") {
        throw new Error("Order id is required to fetch admin order detail.");
      }
      return fetchAdminOrderDetail(id);
    },
    enabled: id !== undefined && id !== null && id !== "",
    staleTime: DEFAULT_STALE_TIME,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}
