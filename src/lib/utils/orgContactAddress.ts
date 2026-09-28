const NO_ADDRESS_PLACEHOLDER = "no address";

/** PlayHQ scrape address suitable for geocoding / map links. */
export function isMappableOrgContactAddress(
  address: string | null | undefined,
): address is string {
  if (!address) return false;
  const trimmed = address.trim();
  if (trimmed.length < 8) return false;
  if (trimmed.toLowerCase() === NO_ADDRESS_PLACEHOLDER) return false;
  return true;
}

/** Bias AU/NZ org addresses toward OpenStreetMap results. */
export function normalizeOrgContactAddressForGeocode(address: string): string {
  const trimmed = address.trim();
  const lower = trimmed.toLowerCase();
  if (
    lower.includes("australia") ||
    lower.includes("new zealand") ||
    /\b(nsw|vic|qld|sa|wa|tas|nt|act)\b/i.test(trimmed)
  ) {
    return trimmed;
  }
  return `${trimmed}, Australia`;
}

export function buildGoogleMapsSearchUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address.trim(),
  )}`;
}

export type OrgContactMapLocation = {
  id: number;
  name: string | null;
  address: string;
};

export const ORG_CONTACT_MAP_MAX_MARKERS = 50;

export function orgContactRowsToMapLocations<
  T extends { id: number; name: string | null; address: string | null },
>(rows: T[], max = ORG_CONTACT_MAP_MAX_MARKERS): OrgContactMapLocation[] {
  const locations: OrgContactMapLocation[] = [];
  for (const row of rows) {
    if (!isMappableOrgContactAddress(row.address)) continue;
    locations.push({
      id: row.id,
      name: row.name,
      address: row.address.trim(),
    });
    if (locations.length >= max) break;
  }
  return locations;
}
