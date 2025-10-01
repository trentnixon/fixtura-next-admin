import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchAssociationContactInfo } from "@/lib/services/accounts/fetchAssociationContactInfo";
import { FetchAssociationContactInfoResponse } from "@/types/associationContactInfo";

export function useGetAssociationEmails(): UseQueryResult<
  FetchAssociationContactInfoResponse,
  Error
> {
  return useQuery({
    queryKey: ["associationContactInfo"], // Cache key for the query
    queryFn: () => fetchAssociationContactInfo(), // Fetch association contact info
    enabled: true, // Always enabled
    retry: 3, // Retry failed requests
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff
  });
}
