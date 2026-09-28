"use client";

import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type ClubLocationMapCanvasProps = {
  name: string;
  addressLabel: string | null;
  lat: number;
  lng: number;
  mapsUrl: string | null;
};

const PIN_ZOOM = 14;

const clubPinIcon = L.divIcon({
  className: "border-0 bg-transparent",
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -40],
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42" aria-hidden="true">
    <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 26 16 26s16-14 16-26C32 7.16 24.84 0 16 0z" fill="#1d4ed8"/>
    <circle cx="16" cy="15" r="6" fill="#ffffff"/>
  </svg>`,
});

function FocusPin({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], PIN_ZOOM);
  }, [map, lat, lng]);

  return null;
}

export function ClubLocationMapCanvas({
  name,
  addressLabel,
  lat,
  lng,
  mapsUrl,
}: ClubLocationMapCanvasProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={PIN_ZOOM}
      className="z-0 h-[320px] w-full rounded-md border border-slate-200"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FocusPin lat={lat} lng={lng} />
      <Marker position={[lat, lng]} icon={clubPinIcon}>
        <Popup>
          <div className="space-y-1 text-sm">
            <p className="font-medium">{name}</p>
            {addressLabel ? <p>{addressLabel}</p> : null}
            {mapsUrl ? (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-2 hover:underline"
              >
                Google Maps
              </a>
            ) : null}
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
