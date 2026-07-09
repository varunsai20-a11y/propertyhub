import propertiesJson from "../data/properties.json";
import type { Property } from "../types";

// When the backend is ready, swap this for a real fetch:
//   const BASE = import.meta.env.VITE_API_BASE ?? "/api";
//   const res = await fetch(`${BASE}/properties`); ...
// Keep the signatures identical so consumers don't change.

const allProperties = propertiesJson as Property[];

export async function getProperties(): Promise<Property[]> {
  // Simulated latency for realism on first call
  return Promise.resolve(allProperties);
}

export async function getPropertyById(id: string): Promise<Property | null> {
  return Promise.resolve(allProperties.find((p) => p.id === id) ?? null);
}

export function getLocalities(): string[] {
  return Array.from(new Set(allProperties.map((p) => p.locality))).sort();
}

export function getHubs(): Array<{ name: string; lat: number; lng: number }> {
  return [
    { name: "Whitefield IT Hub", lat: 12.9698, lng: 77.7499 },
    { name: "Electronic City", lat: 12.8452, lng: 77.6602 },
    { name: "Majestic Railway Station", lat: 12.9766, lng: 77.5712 },
    { name: "KIAL Airport", lat: 13.1986, lng: 77.7066 },
    { name: "Manyata Tech Park", lat: 13.0458, lng: 77.6197 },
  ];
}
