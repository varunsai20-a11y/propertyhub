import { useMemo } from "react";
import type { Filters, Property, PropertyType, Furnishing, Availability, Amenity } from "../types";
import { getLocalities } from "../api/propertiesApi";
import { Icon } from "./icons";
import { formatINR } from "../lib/format";

const TYPES: PropertyType[] = ["1RK", "1BHK", "2BHK", "3BHK", "PG"];
const FURNISHINGS: Furnishing[] = ["Fully", "Semi", "Unfurnished"];
const AVAILABILITIES: Availability[] = ["Immediate", "Within 30 Days"];
const AMENITIES: { key: Amenity; label: string }[] = [
  { key: "parking", label: "Parking" },
  { key: "gym", label: "Gym" },
  { key: "pool", label: "Pool" },
  { key: "lift", label: "Lift" },
  { key: "power", label: "Power Backup" },
  { key: "security", label: "Security" },
  { key: "balcony", label: "Balcony" },
  { key: "pet", label: "Pet-Friendly" },
];

export function FilterBar({
  filters,
  setFilters,
  resultsCount,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  resultsCount: number;
}) {
  const localities = useMemo(() => getLocalities(), []);

  const toggleArr = <T extends string>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  return (
    <div className="rounded-2xl border border-brand-line bg-white p-4 shadow-card">
      <div className="flex flex-wrap items-center gap-3">
        {/* Budget slider */}
        <div className="flex min-w-[240px] flex-1 flex-col">
          <div className="flex items-center justify-between text-xs font-semibold text-brand-deep">
            <span>Budget</span>
            <span className="text-brand-orange">
              {formatINR(filters.minBudget)} – {formatINR(filters.maxBudget)}
            </span>
          </div>
          <div className="relative mt-1 h-6">
            <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand-line" />
            <div
              className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand-orange"
              style={{
                left: `${((filters.minBudget - 0) / 100000) * 100}%`,
                right: `${100 - ((filters.maxBudget - 0) / 100000) * 100}%`,
              }}
            />
            <input
              type="range"
              min={0}
              max={100000}
              step={1000}
              value={filters.minBudget}
              onChange={(e) => {
                const v = Math.min(
                  Number(e.target.value),
                  filters.maxBudget - 1000
                );
                setFilters({ ...filters, minBudget: v });
              }}
              className="range-input pointer-events-auto absolute left-0 top-0 h-6 w-full appearance-none bg-transparent"
            />
            <input
              type="range"
              min={0}
              max={100000}
              step={1000}
              value={filters.maxBudget}
              onChange={(e) => {
                const v = Math.max(
                  Number(e.target.value),
                  filters.minBudget + 1000
                );
                setFilters({ ...filters, maxBudget: v });
              }}
              className="range-input pointer-events-auto absolute left-0 top-0 h-6 w-full appearance-none bg-transparent"
            />
          </div>
        </div>

        {/* Locality dropdown */}
        <label className="flex flex-1 min-w-[180px] flex-col">
          <span className="text-xs font-semibold text-brand-deep">Locality</span>
          <select
            multiple={false}
            value={filters.localities[0] ?? ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                localities: e.target.value ? [e.target.value] : [],
              })
            }
            className="mt-1 rounded-lg border border-brand-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-deep"
          >
            <option value="">All localities</option>
            {localities.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>

        {/* Availability */}
        <label className="flex flex-1 min-w-[160px] flex-col">
          <span className="text-xs font-semibold text-brand-deep">
            Availability
          </span>
          <select
            value={filters.availability[0] ?? ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                availability: e.target.value ? [e.target.value as Availability] : [],
              })
            }
            className="mt-1 rounded-lg border border-brand-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-deep"
          >
            <option value="">Any time</option>
            {AVAILABILITIES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs font-semibold text-brand-mute">Type</span>
        {TYPES.map((t) => (
          <Chip
            key={t}
            active={filters.types.includes(t)}
            onClick={() =>
              setFilters({ ...filters, types: toggleArr(filters.types, t) })
            }
          >
            {t}
          </Chip>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs font-semibold text-brand-mute">
          Furnishing
        </span>
        {FURNISHINGS.map((f) => (
          <Chip
            key={f}
            active={filters.furnishing.includes(f)}
            onClick={() =>
              setFilters({
                ...filters,
                furnishing: toggleArr(filters.furnishing, f),
              })
            }
          >
            {f}
          </Chip>
        ))}
      </div>

      <details className="mt-3 group">
        <summary className="cursor-pointer text-xs font-semibold text-brand-deep hover:text-brand-orange">
          Amenities
        </summary>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {AMENITIES.map((a) => {
            const active = filters.amenities.includes(a.key);
            return (
              <Chip
                key={a.key}
                active={active}
                onClick={() =>
                  setFilters({
                    ...filters,
                    amenities: toggleArr(filters.amenities, a.key),
                  })
                }
              >
                {a.label}
              </Chip>
            );
          })}
        </div>
      </details>

      <div className="mt-3 flex items-center justify-between border-t border-brand-line pt-3">
        <div className="text-sm text-brand-mute">
          <span className="font-bold text-brand-deep">{resultsCount}</span>{" "}
          properties found
        </div>
        <button
          onClick={() =>
            setFilters({
              query: "",
              minBudget: 0,
              maxBudget: 100000,
              localities: [],
              furnishing: [],
              availability: [],
              types: [],
              amenities: [],
            })
          }
          className="text-xs font-semibold text-brand-orange hover:underline"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
        active
          ? "bg-brand-deep text-white"
          : "border border-brand-line bg-white text-brand-ink hover:border-brand-deep"
      }`}
    >
      {children}
    </button>
  );
}
