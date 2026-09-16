/** Person row from CMS contactDetails.contacts (org contact scrape). */
export interface OrgContactPerson {
  name?: string | null;
  role?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface OrgContactListingRow {
  id: number;
  name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  website: string | null;
  contacts: OrgContactPerson[];
  lastOrgContactScrapeAt: string | null;
}
