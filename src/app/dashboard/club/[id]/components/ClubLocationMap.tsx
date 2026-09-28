"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { buildGoogleMapsSearchUrl } from "@/lib/utils/orgContactAddress";
import {
  isPlottableCoordinate,
  readGeocodeResponse,
  type MapCoordinates,
} from "./clubLocationMap";

type ClubLocationMapProps = {
  name: string;
  addressLabel: string | null;
  geocodeQuery: string | null;
  coordinates: { lat: number; lng: number } | null;
};

const MapCanvas = dynamic(
  () => import("./ClubLocationMapCanvas").then((mod) => mod.ClubLocationMapCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[320px] items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50 text-sm text-muted-foreground">
        Loading map…
      </div>
    ),
  },
);

function mapsUrlFor(
  coordinates: MapCoordinates | null,
  addressLabel: string | null,
): string | null {
  if (coordinates) {
    return `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;
  }
  if (addressLabel) return buildGoogleMapsSearchUrl(addressLabel);
  return null;
}

export function ClubLocationMap({
  name,
  addressLabel,
  geocodeQuery,
  coordinates,
}: ClubLocationMapProps) {
  const direct = isPlottableCoordinate(coordinates) ? coordinates : null;
  const directLat = direct?.lat ?? null;
  const directLng = direct?.lng ?? null;
  const [pin, setPin] = useState<MapCoordinates | null>(direct);
  const [phase, setPhase] = useState<"ready" | "locating" | "unavailable">(
    direct ? "ready" : "locating",
  );

  useEffect(() => {
    if (directLat !== null && directLng !== null) {
      setPin({ lat: directLat, lng: directLng });
      setPhase("ready");
      return;
    }

    if (!geocodeQuery) {
      setPin(null);
      setPhase("unavailable");
      return;
    }

    let cancelled = false;
    setPin(null);
    setPhase("locating");

    const run = async () => {
      try {
        const params = new URLSearchParams({ address: geocodeQuery });
        const response = await fetch(`/api/org-contact/geocode?${params}`);
        const body: unknown = response.ok ? await response.json() : null;
        const next = readGeocodeResponse(body);
        if (cancelled) return;
        if (next) {
          setPin(next);
          setPhase("ready");
          return;
        }
        setPhase("unavailable");
      } catch {
        if (!cancelled) setPhase("unavailable");
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [directLat, directLng, geocodeQuery]);

  const mapsUrl = mapsUrlFor(pin ?? direct, addressLabel);

  if (phase === "locating") {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50 text-sm text-muted-foreground">
        <MapPin className="mr-2 h-4 w-4" aria-hidden />
        Placing pin…
      </div>
    );
  }

  if (phase === "unavailable" || !pin) {
    return (
      <div className="rounded-md border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-muted-foreground">
        <MapPin className="mr-2 inline h-4 w-4 opacity-60" aria-hidden />
        Could not place a pin for this address.
        {mapsUrl ? (
          <>
            {" "}
            <a
              className="text-primary underline-offset-2 hover:underline"
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps
            </a>
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="px-1 text-xs text-muted-foreground">
        Pin shows this club on OpenStreetMap
        {direct ? " from stored coordinates" : " from the club address"}.
      </p>
      <MapCanvas
        name={name}
        addressLabel={addressLabel}
        lat={pin.lat}
        lng={pin.lng}
        mapsUrl={mapsUrl}
      />
    </div>
  );
}
