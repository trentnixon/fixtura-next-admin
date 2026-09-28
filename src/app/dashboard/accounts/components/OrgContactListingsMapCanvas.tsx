"use client";

import { useEffect, useMemo } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { OrgContactMapLocation } from "@/lib/utils/orgContactAddress";
import { buildGoogleMapsSearchUrl } from "@/lib/utils/orgContactAddress";
import "leaflet/dist/leaflet.css";

type PlottedMarker = OrgContactMapLocation & { lat: number; lng: number };

type OrgContactListingsMapCanvasProps = {
  markers: PlottedMarker[];
};

const AU_CENTER: [number, number] = [-25.2744, 133.7751];
const DEFAULT_ZOOM = 4;

function FitBounds({ markers }: { markers: PlottedMarker[] }) {
  const map = useMap();

  useEffect(() => {
    if (markers.length === 0) {
      map.setView(AU_CENTER, DEFAULT_ZOOM);
      return;
    }
    if (markers.length === 1) {
      map.setView([markers[0].lat, markers[0].lng], 12);
      return;
    }
    const bounds = markers.map(
      (marker) => [marker.lat, marker.lng] as [number, number],
    );
    map.fitBounds(bounds, { padding: [32, 32], maxZoom: 12 });
  }, [map, markers]);

  return null;
}

export function OrgContactListingsMapCanvas({
  markers,
}: OrgContactListingsMapCanvasProps) {
  const center = useMemo(() => {
    if (markers.length === 0) return AU_CENTER;
    if (markers.length === 1) return [markers[0].lat, markers[0].lng] as [number, number];
    const lat =
      markers.reduce((sum, marker) => sum + marker.lat, 0) / markers.length;
    const lng =
      markers.reduce((sum, marker) => sum + marker.lng, 0) / markers.length;
    return [lat, lng] as [number, number];
  }, [markers]);

  return (
    <MapContainer
      center={center}
      zoom={DEFAULT_ZOOM}
      className="z-0 h-[320px] w-full rounded-md border border-slate-200"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds markers={markers} />
      {markers.map((marker) => (
        <CircleMarker
          key={marker.id}
          center={[marker.lat, marker.lng]}
          radius={7}
          pathOptions={{ color: "#1d4ed8", fillColor: "#3b82f6", fillOpacity: 0.85 }}
        >
          <Popup>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{marker.name ?? `ID ${marker.id}`}</p>
              <p className="text-muted-foreground">{marker.address}</p>
              <a
                href={buildGoogleMapsSearchUrl(marker.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-2 hover:underline"
              >
                Google Maps
              </a>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
