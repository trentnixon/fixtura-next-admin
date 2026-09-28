import { NextRequest, NextResponse } from "next/server";
import {
  isMappableOrgContactAddress,
  normalizeOrgContactAddressForGeocode,
} from "@/lib/utils/orgContactAddress";

type GeocodeResult = { lat: number; lng: number } | null;

const cache = new Map<string, GeocodeResult>();
let lastNominatimRequestAt = 0;

const NOMINATIM_MIN_INTERVAL_MS = 1100;

async function geocodeWithNominatim(query: string): Promise<GeocodeResult> {
  const cached = cache.get(query);
  if (cached !== undefined) return cached;

  const now = Date.now();
  const waitMs = Math.max(0, NOMINATIM_MIN_INTERVAL_MS - (now - lastNominatimRequestAt));
  if (waitMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
  lastNominatimRequestAt = Date.now();

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("q", query);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "User-Agent": "Fixtura-Admin/1.0 (org contact listings map)",
      },
      next: { revalidate: 60 * 60 * 24 * 7 },
    });

    if (!response.ok) {
      cache.set(query, null);
      return null;
    }

    const payload = (await response.json()) as { lat?: string; lon?: string }[];
    const hit = payload[0];
    if (!hit?.lat || !hit?.lon) {
      cache.set(query, null);
      return null;
    }

    const result: GeocodeResult = {
      lat: Number.parseFloat(hit.lat),
      lng: Number.parseFloat(hit.lon),
    };
    cache.set(query, result);
    return result;
  } catch {
    cache.set(query, null);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address")?.trim();
  if (!address || !isMappableOrgContactAddress(address)) {
    return NextResponse.json(
      { error: "A valid address query is required." },
      { status: 400 },
    );
  }

  const query = normalizeOrgContactAddressForGeocode(address);
  const coords = await geocodeWithNominatim(query);

  if (!coords) {
    return NextResponse.json({ data: null });
  }

  return NextResponse.json({ data: coords });
}
