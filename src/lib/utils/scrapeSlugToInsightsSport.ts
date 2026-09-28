import type { ClubScrapeSportSlug } from "@/constants/clubScrapeSportSlugs";
import type { ClubSportFilter } from "@/types/clubInsights";
import type { SportFilter } from "@/types/associationInsights";

const SLUG_TO_INSIGHTS_SPORT: Partial<
  Record<ClubScrapeSportSlug, ClubSportFilter>
> = {
  "cricket-australia": "Cricket",
  afl: "AFL",
  hockey: "Hockey",
  netball: "Netball",
  basketball: "Basketball",
};

/** Maps org-contact scrape slug to club/association insights API sport param. */
export function scrapeSlugToInsightsSport(
  slug: ClubScrapeSportSlug | undefined,
): ClubSportFilter {
  if (!slug) return "Cricket";
  return SLUG_TO_INSIGHTS_SPORT[slug] ?? "Cricket";
}

export function scrapeSlugToAssociationInsightsSport(
  slug: ClubScrapeSportSlug | undefined,
): SportFilter {
  return scrapeSlugToInsightsSport(slug);
}

export function insightsSportSupportedForTimeline(
  slug: ClubScrapeSportSlug | undefined,
): boolean {
  if (!slug) return true;
  return slug in SLUG_TO_INSIGHTS_SPORT;
}
