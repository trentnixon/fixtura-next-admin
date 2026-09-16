import type { OrgContactListingRow } from "@/types/orgContactListing";

export type ClubContactInfo = OrgContactListingRow;

export interface FetchClubContactInfoResponse {
  data: ClubContactInfo[];
  meta?: { total: number };
}
