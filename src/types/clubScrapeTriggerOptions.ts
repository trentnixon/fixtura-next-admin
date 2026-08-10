import type { ClubScrapeSportSlug } from "@/constants/clubScrapeSportSlugs";

/**
 * Merged with CMS defaults (`dryRun`, `skipAccountSlot`, etc.) on trigger.
 */
export interface ClubScrapeTriggerOptions {
  sport?: ClubScrapeSportSlug;
  [key: string]: unknown;
}
