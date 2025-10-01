import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchClubContactInfo } from "@/lib/services/accounts/fetchClubContactInfo";
import { FetchClubContactInfoResponse } from "@/types/clubContactInfo";

export function useGetClubEmails(): UseQueryResult<
  FetchClubContactInfoResponse,
  Error
> {
  return useQuery({
    queryKey: ["clubContactInfo"], // Cache key for the query
    queryFn: () => fetchClubContactInfo(), // Fetch club contact info
    enabled: true, // Always enabled
    retry: 3, // Retry failed requests
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff
  });
}
