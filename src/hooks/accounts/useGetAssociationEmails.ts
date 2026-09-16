import { useQuery, UseQueryResult } from "@tanstack/react-query";
import type { ClubScrapeSportSlug } from "@/constants/clubScrapeSportSlugs";
import { fetchAssociationContactInfo } from "@/lib/services/accounts/fetchAssociationContactInfo";
import { FetchAssociationContactInfoResponse } from "@/types/associationContactInfo";

export function useGetAssociationEmails(
  sportSlug?: ClubScrapeSportSlug,
): UseQueryResult<FetchAssociationContactInfoResponse, Error> {
  return useQuery({
    queryKey: ["associationContactInfo", sportSlug ?? "default"],
    queryFn: () => fetchAssociationContactInfo(sportSlug),
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });
}
