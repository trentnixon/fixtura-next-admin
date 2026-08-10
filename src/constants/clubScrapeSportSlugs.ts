/**
 * CMS `sport` slug values for club queue jobs (recon/data filters, `options.sport`).
 * Must match `/api/club/data` club rows and Python scraper contract.
 *
 * @see .comms/admin-frontend-club-scrape-sport-filter-handoff.md
 */
export const CLUB_SCRAPE_SPORTS = [
  { slug: "cricket-australia", label: "Cricket" },
  { slug: "afl", label: "AFL" },
  { slug: "hockey", label: "Hockey" },
  { slug: "netball", label: "Netball" },
  { slug: "basketball", label: "Basketball" },
  { slug: "football", label: "Football" },
  { slug: "rugby", label: "Rugby" },
] as const;

export type ClubScrapeSportSlug = (typeof CLUB_SCRAPE_SPORTS)[number]["slug"];
