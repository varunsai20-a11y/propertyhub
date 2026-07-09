import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import type { Property } from "../types";
import { Icon } from "./icons";
import { formatINR, haversineKm } from "../lib/format";
import { getHubs } from "../api/propertiesApi";

interface MapProps {
  properties: Property[];
  activeId: string | null;
  hoverId: string | null;
  onHover: (id: string | null) => void;
}

const BANGALORE_CENTER: [number, number] = [12.95, 77.62];
const BANGALORE_ZOOM = 12;

function FitToProperties({ properties }: { properties: Property[] }) {
  const map = useMap();
  useEffect(() => {
    if (properties.length === 0) return;
    if (properties.length === 1) {
      map.setView([properties[0].lat, properties[0].lng], 14, { animate: true });
      return;
    }
    const bounds = L.latLngBounds(properties.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties.map((p) => p.id).join("|")]);
  return null;
}

function FlyToActive({
  activeId,
  properties,
}: {
  activeId: string | null;
  properties: Property[];
}) {
  const map = useMap();
  useEffect(() => {
    if (!activeId) return;
    const p = properties.find((x) => x.id === activeId);
    if (!p) return;
    map.flyTo([p.lat, p.lng], Math.max(map.getZoom(), 14), { duration: 0.6 });
  }, [activeId, properties, map]);
  return null;
}

function makePriceIcon(label: string, active: boolean) {
  return L.divIcon({
    className: `price-marker ${active ? "active" : ""}`,
    html: `<div class="wrap"><div class="pulse"></div><div class="pill">${label}</div></div>`,
    iconSize: [60, 24],
    iconAnchor: [30, 12],
  });
}

function TravelTimeControl({
  properties,
  activeId,
}: {
  properties: Property[];
  activeId: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [hub, setHub] = useState<string>("");
  const hubs = useMemo(() => getHubs(), []);
  const [duration, setDuration] = useState<{ km: number; mins: number; hub: string } | null>(null);

  const compute = () => {
    const p = properties.find((x) => x.id === activeId);
    const h = hubs.find((x) => x.name === hub);
    if (!p || !h) return;
    const km = haversineKm({ lat: p.lat, lng: p.lng }, { lat: h.lat, lng: h.lng });
    // Assume urban average of 25 km/h by car with 1.3x detour
    const roadKm = km * 1.3;
    const mins = Math.round((roadKm / 25) * 60);
    setDuration({ km: roadKm, mins, hub: h.name });
  };

  return (
    <div className="absolute right-3 top-3 z-[400]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-brand-deep shadow-card hover:shadow-card-hover"
      >
        <Icon.Clock size={14} /> Travel Time
      </button>
      {open && (
        <div className="mt-2 w-72 rounded-xl border border-brand-line bg-white p-3 shadow-card-hover animate-fade-in">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-deep">
            Travel from this property
          </div>
          <p className="mt-1 text-[11px] text-brand-mute">
            {activeId
              ? "Showing live estimate for the highlighted listing."
              : "Hover or scroll a listing to compute travel time."}
          </p>
          <div className="mt-2 flex gap-2">
            <select
              value={hub}
              onChange={(e) => setHub(e.target.value)}
              className="flex-1 rounded-lg border border-brand-line bg-white px-2 py-1.5 text-sm outline-none focus:border-brand-deep"
            >
              <option value="">Choose a hub</option>
              {hubs.map((h) => (
                <option key={h.name} value={h.name}>
                  {h.name}
                </option>
              ))}
            </select>
            <button
              onClick={compute}
              disabled={!activeId || !hub}
              className="rounded-lg bg-brand-orange px-3 py-1.5 text-sm font-bold text-white transition hover:bg-brand-orange-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              Go
            </button>
          </div>
          {duration && (
            <div className="mt-3 rounded-lg bg-brand-slate p-2 text-sm">
              <div className="font-bold text-brand-deep">
                {duration.mins} min
              </div>
              <div className="text-xs text-brand-mute">
                ~{duration.km.toFixed(1)} km to {duration.hub} (driving est.)
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function MiniMap({ properties, activeId, hoverId, onHover }: MapProps) {
  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={BANGALORE_CENTER}
        zoom={BANGALORE_ZOOM}
        scrollWheelZoom
        className="h-full w-full"
        style={{ minHeight: 400 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((p) => {
          const isActive = p.id === activeId || p.id === hoverId;
          return (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={makePriceIcon(formatINR(p.rent), isActive)}
              eventHandlers={{
                mouseover: () => onHover(p.id),
                mouseout: () => onHover(null),
              }}
            >
              <Popup>
                <div className="min-w-[180px]">
                  <div className="text-xs font-bold text-brand-deep">
                    {p.title}
                  </div>
                  <div className="mt-0.5 text-sm font-extrabold text-brand-orange">
                    {formatINR(p.rent)} / month
                  </div>
                  <div className="text-[11px] text-brand-mute">
                    {p.locality} · {p.type}
                  </div>
                  <a
                    href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${p.lat},${p.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-[11px] font-bold text-brand-deep underline"
                  >
                    Open Street View
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
        <FitToProperties properties={properties} />
        <FlyToActive activeId={activeId} properties={properties} />
      </MapContainer>

      <TravelTimeControl
        properties={properties}
        activeId={activeId}
      />

      <div className="absolute bottom-3 left-3 z-[400] flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-brand-deep shadow-card">
        <span className="h-2 w-2 rounded-full bg-brand-orange" />
        {properties.length} {properties.length === 1 ? "property" : "properties"} on map
      </div>
    </div>
  );
}
