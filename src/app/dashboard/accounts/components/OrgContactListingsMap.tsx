"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { OrgContactMapLocation } from "@/lib/utils/orgContactAddress";
import {
  ORG_CONTACT_MAP_MAX_MARKERS,
  buildGoogleMapsSearchUrl,
  isMappableOrgContactAddress,
  orgContactRowsToMapLocations,
} from "@/lib/utils/orgContactAddress";
import { MapPin } from "lucide-react";

type PlottedMarker = OrgContactMapLocation & { lat: number; lng: number };

type OrgContactListingsMapProps = {
  filteredRows: {
    id: number;
    name: string | null;
    address: string | null;
  }[];
  entityLabel: string;
};

const MapCanvas = dynamic(
  () => import("./OrgContactListingsMapCanvas").then((mod) => mod.OrgContactListingsMapCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[320px] items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50 text-sm text-muted-foreground">
        Loading map…
      </div>
    ),
  },
);

export function OrgContactListingsMap({
  filteredRows,
  entityLabel,
}: OrgContactListingsMapProps) {
  const totalFiltered = filteredRows.length;
  const mappableCount = useMemo(
    () =>
      filteredRows.filter((row) => isMappableOrgContactAddress(row.address))
        .length,
    [filteredRows],
  );

  const targets = useMemo(
    () => orgContactRowsToMapLocations(filteredRows),
    [filteredRows],
  );

  const [markers, setMarkers] = useState<PlottedMarker[]>([]);
  const [geocoding, setGeocoding] = useState(false);
  const [failedCount, setFailedCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (targets.length === 0) {
        setMarkers([]);
        setFailedCount(0);
        setGeocoding(false);
        return;
      }

      setGeocoding(true);
      setMarkers([]);
      setFailedCount(0);

      const plotted: PlottedMarker[] = [];
      let failures = 0;

      for (const location of targets) {
        if (cancelled) return;

        try {
          const params = new URLSearchParams({ address: location.address });
          const response = await fetch(`/api/org-contact/geocode?${params}`);
          if (!response.ok) {
            failures += 1;
            continue;
          }
          const body = (await response.json()) as {
            data: { lat: number; lng: number } | null;
          };
          if (body.data) {
            plotted.push({ ...location, ...body.data });
            setMarkers([...plotted]);
          } else {
            failures += 1;
          }
        } catch {
          failures += 1;
        }
      }

      if (!cancelled) {
        setFailedCount(failures);
        setGeocoding(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [targets]);

  if (mappableCount === 0) {
    return (
      <div className="rounded-md border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-muted-foreground">
        <MapPin className="mr-2 inline h-4 w-4 shrink-0 opacity-60" aria-hidden />
        No mappable addresses in the current filter. Addresses come from PlayHQ org
        contact scrapes (not lat/lng from CMS yet).
      </div>
    );
  }

  const capped = mappableCount > ORG_CONTACT_MAP_MAX_MARKERS;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-1 text-sm text-muted-foreground">
        <p>
          Map uses scraped street addresses (geocoded via OpenStreetMap). Showing up
          to {ORG_CONTACT_MAP_MAX_MARKERS} of {mappableCount.toLocaleString()}{" "}
          mappable {entityLabel}
          {totalFiltered !== mappableCount
            ? ` (${totalFiltered.toLocaleString()} in filter)`
            : ""}
          .
        </p>
        {geocoding ? (
          <span className="text-xs">Plotting {markers.length} / {targets.length}…</span>
        ) : (
          <span className="text-xs">
            {markers.length} marker{markers.length === 1 ? "" : "s"}
            {failedCount > 0 ? ` · ${failedCount} not found` : ""}
          </span>
        )}
      </div>
      {capped ? (
        <p className="px-1 text-xs text-muted-foreground">
          Narrow filters to plot a specific region; geocoding is rate-limited.
        </p>
      ) : null}
      <MapCanvas markers={markers} />
      {markers.length === 1 ? (
        <p className="px-1 text-xs">
          <a
            className="text-primary underline-offset-2 hover:underline"
            href={buildGoogleMapsSearchUrl(markers[0].address)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Google Maps
          </a>
        </p>
      ) : null}
    </div>
  );
}
