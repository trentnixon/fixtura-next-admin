import { useQuery, UseQueryResult } from "@tanstack/react-query";
import type { ClubScrapeSportSlug } from "@/constants/clubScrapeSportSlugs";
import { fetchClubContactInfo } from "@/lib/services/accounts/fetchClubContactInfo";
import { FetchClubContactInfoResponse } from "@/types/clubContactInfo";

export function useGetClubEmails(
  sportSlug?: ClubScrapeSportSlug,
): UseQueryResult<FetchClubContactInfoResponse, Error> {
  return useQuery({
    queryKey: ["clubContactInfo", sportSlug ?? "default"],
    queryFn: () => fetchClubContactInfo(sportSlug),
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });
}
