import type { OrgContactListingRow } from "@/types/orgContactListing";

export type AssociationContactInfo = OrgContactListingRow;

export interface FetchAssociationContactInfoResponse {
  data: AssociationContactInfo[];
  meta?: { total: number };
}
