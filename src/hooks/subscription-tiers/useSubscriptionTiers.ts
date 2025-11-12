import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchSubscriptionTiers } from "@/lib/services/subscription-tiers/fetchSubscriptionTiers";
import { SubscriptionTier } from "@/types/subscriptionTier";

interface SubscriptionTiersResponse {
  data: SubscriptionTier[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * React Query hook for fetching subscription tiers from the Strapi API
 *
 * Fetches all available subscription tiers for use in forms and dropdowns.
 * Caches the results for 10 minutes to reduce API calls.
 *
 * @returns UseQueryResult with subscription tiers data
 */
export function useSubscriptionTiers(): UseQueryResult<
  SubscriptionTiersResponse,
  Error
> {
  return useQuery<SubscriptionTiersResponse, Error>({
    queryKey: ["subscription-tiers"],
    queryFn: () => fetchSubscriptionTiers(),
    staleTime: 10 * 60 * 1000, // 10 minutes - subscription tiers don't change often
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });
}
