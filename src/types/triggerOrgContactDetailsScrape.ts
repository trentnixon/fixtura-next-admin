/**
 * POST /api/organisation/trigger-org-contact-details-scrape
 * @see src/app/dashboard/data/.comms/admin-frontend-trigger-org-contact-details-integration.md
 */

import type { ClubScrapeSportSlug } from "@/constants/clubScrapeSportSlugs";

/** Fixed on admin-triggered jobs; CMS applies via recon/data filter. */
export const ORG_CONTACT_STALE_DAYS = 30;

export interface TriggerOrgContactDetailsScrapeOptions {
  sport: ClubScrapeSportSlug;
  contactStaleDays?: typeof ORG_CONTACT_STALE_DAYS;
  dryRun?: boolean;
  skipAccountSlot?: boolean;
  maxTargets?: number;
}

export interface TriggerOrgContactDetailsScrapeRequest {
  jobId?: string;
  runId?: string;
  kind?: "fixture";
  scope?: "org_contact_details";
  targets?: [];
  options: TriggerOrgContactDetailsScrapeOptions;
}

export interface TriggerOrgContactDetailsScrapeSuccessResponse {
  success: boolean;
  jobId: string | number;
  runId: string;
  message: string;
  queueName: "scrape:org-contact-details";
}
