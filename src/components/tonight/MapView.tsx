import { useEffect, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "@tanstack/react-router";
import type { DbEvent } from "@/lib/events";
import { CATEGORIES } from "@/data/events";
import type { Lang } from "@/data/i18n";

const FRIBOURG: [number, number] = [46.806, 7.1614];

// Custom neon-styled marker icon (avoids broken default Leaflet asset URLs)
const eventIcon = L.divIcon({
  className: "tonight-marker",
  html: `<div style="
    width:30px;height:30px;border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    background:linear-gradient(135deg,#ff2db8 0%,#7c3aed 100%);
    box-shadow:0 0 0 3px rgba(11,4,16,0.85),0 6px 16px rgba(255,45,184,0.45);
    display:grid;place-items:center;">
    <div style="width:10px;height:10px;border-radius:50%;background:white;transform:rotate(45deg);"></div>
  </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -28],
});

const userIcon = L.divIcon({
  className: "tonight-user-marker",
  html: `<div style="
    width:18px;height:18px;border-radius:50%;
    background:#3b82f6;border:3px solid white;
    box-shadow:0 0 0 3px rgba(59,130,246,0.35);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function FitToMarkers({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    if (points.length === 1) {
      map.setView(points[0], 15);
    } else {
      map.fitBounds(points, { padding: [40, 40], maxZoom: 15 });
    }
  }, [map, points]);
  return null;
}

export function MapView({
  events,
  userCoords,
  lang,
}: {
  events: DbEvent[];
  userCoords: { lat: number; lng: number } | null;
  lang: Lang;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const points = events
    .filter((e): e is DbEvent & { lat: number; lng: number } => e.lat != null && e.lng != null)
    .map((e) => [e.lat, e.lng] as [number, number]);

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-200px)] min-h-[420px] w-full overflow-hidden rounded-2xl border border-border/40 shadow-elevated"
    >
      <MapContainer
        center={FRIBOURG}
        zoom={14}
        scrollWheelZoom
        className="h-full w-full"
        style={{ background: "#0b0410" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <FitToMarkers points={userCoords ? [...points, [userCoords.lat, userCoords.lng]] : points} />

        {userCoords && (
          <Marker position={[userCoords.lat, userCoords.lng]} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {events
          .filter((e) => e.lat != null && e.lng != null)
          .map((e) => {
            const cat = CATEGORIES.find((c) => c.key === e.category);
            const time = new Date(e.starts_at).toLocaleTimeString(
              lang === "fr" ? "fr-CH" : lang === "de" ? "de-CH" : "en-GB",
              { hour: "2-digit", minute: "2-digit" },
            );
            return (
              <Marker key={e.id} position={[e.lat!, e.lng!]} icon={eventIcon}>
                <Popup>
                  <div className="space-y-1 font-sans">
                    {cat && (
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-pink-500">
                        {cat.label[lang]}
                      </div>
                    )}
                    <div className="text-sm font-semibold leading-tight">{e.title}</div>
                    <div className="text-xs text-gray-600">
                      {e.venue} · {time}
                    </div>
                    <Link
                      to="/event/$id"
                      params={{ id: e.id }}
                      className="mt-1 inline-block text-xs font-semibold text-pink-600 hover:underline"
                    >
                      Voir les détails →
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
}
