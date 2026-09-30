import { isMappableOrgContactAddress } from "@/lib/utils/orgContactAddress";

export type MapCoordinates = {
  lat: number;
  lng: number;
};

export function isPlottableCoordinate(
  value: { lat: number; lng: number } | null | undefined,
): value is MapCoordinates {
  if (!value) return false;
  const { lat, lng } = value;
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

/** First address-like string long enough for the geocode route. */
export function pickClubGeocodeQuery(
  candidates: Array<string | null | undefined>,
): string | null {
  for (const candidate of candidates) {
    if (isMappableOrgContactAddress(candidate)) return candidate.trim();
  }
  return null;
}

export function readGeocodeResponse(body: unknown): MapCoordinates | null {
  if (typeof body !== "object" || body === null || !("data" in body)) {
    return null;
  }
  const data = body.data;
  if (typeof data !== "object" || data === null) return null;
  if (!("lat" in data) || !("lng" in data)) return null;
  const { lat, lng } = data;
  if (typeof lat !== "number" || typeof lng !== "number") return null;
  if (!isPlottableCoordinate({ lat, lng })) return null;
  return { lat, lng };
}
