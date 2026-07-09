import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProperties } from "../api/propertiesApi";
import type { Filters, Property } from "../types";
import { FilterBar } from "../components/FilterBar";
import { PropertyCard } from "../components/PropertyCard";
import { MiniMap } from "../components/MiniMap";
import { Icon } from "../components/icons";

const DEFAULT_FILTERS: Filters = {
  query: "",
  minBudget: 0,
  maxBudget: 100000,
  localities: [],
  furnishing: [],
  availability: [],
  types: [],
  amenities: [],
};

export function ListingsPage() {
  const [searchParams] = useSearchParams();
  const [all, setAll] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    ...DEFAULT_FILTERS,
    query: searchParams.get("q") ?? "",
    types: searchParams.get("type")
      ? [searchParams.get("type") as Filters["types"][number]]
      : [],
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [sort, setSort] = useState<"recommended" | "price-asc" | "price-desc">(
    "recommended"
  );
  const cardRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    getProperties().then((p) => {
      setAll(p);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const f = filters;
    let list = all.filter((p) => {
      if (f.query) {
        const q = f.query.toLowerCase();
        if (
          !p.title.toLowerCase().includes(q) &&
          !p.locality.toLowerCase().includes(q) &&
          !p.city.toLowerCase().includes(q) &&
          !p.type.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (p.rent < f.minBudget || p.rent > f.maxBudget) return false;
      if (f.localities.length && !f.localities.includes(p.locality)) return false;
      if (f.types.length && !f.types.includes(p.type)) return false;
      if (f.furnishing.length && !f.furnishing.includes(p.furnishing))
        return false;
      if (
        f.availability.length &&
        !f.availability.includes(p.availability)
      )
        return false;
      if (f.amenities.length && !f.amenities.every((a) => p.amenities.includes(a)))
        return false;
      return true;
    });
    if (sort === "price-asc") list = list.slice().sort((a, b) => a.rent - b.rent);
    if (sort === "price-desc")
      list = list.slice().sort((a, b) => b.rent - a.rent);
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, filters, sort]);

  // Set initial activeId once data loads
  useEffect(() => {
    if (!activeId && filtered.length) setActiveId(filtered[0].id);
  }, [filtered, activeId]);

  // IntersectionObserver to track which card is in view
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (a.target as HTMLElement).getBoundingClientRect().top -
              (b.target as HTMLElement).getBoundingClientRect().top
          );
        if (visible[0]) {
          const id = (visible[0].target as HTMLElement).dataset.propertyId;
          if (id) setActiveId(id);
        }
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: 0 }
    );
    Object.values(cardRefs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [filtered.length]);

  return (
    <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6">
      {/* Top header strip */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-brand-deep sm:text-2xl">
            {filtered.length} homes in Bangalore
          </h1>
          {filters.query && (
            <p className="text-sm text-brand-mute">
              for "{filters.query}"
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-brand-mute">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-lg border border-brand-line bg-white px-3 py-1.5 text-sm outline-none focus:border-brand-deep"
          >
            <option value="recommended">Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <FilterBar
        filters={filters}
        setFilters={setFilters}
        resultsCount={filtered.length}
      />

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[60%_40%]">
        {/* LEFT — listings list (60%) */}
        <div className="space-y-4 lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto lg:pr-3">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[16/14] animate-pulse rounded-2xl bg-brand-slate"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-brand-line bg-white p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                <Icon.Search size={22} />
              </div>
              <h3 className="mt-3 text-lg font-bold text-brand-deep">
                No properties match your filters
              </h3>
              <p className="mt-1 text-sm text-brand-mute">
                Try widening the budget slider or clearing amenities.
              </p>
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="mt-4 rounded-full bg-brand-orange px-4 py-2 text-sm font-bold text-white hover:bg-brand-orange-hover"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div
              key={
                filtered.length +
                filters.localities.join() +
                filters.types.join() +
                sort
              }
              className="fade-list grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
            >
              {filtered.map((p) => (
                <div
                  key={p.id}
                  ref={(el) => {
                    cardRefs.current[p.id] = el as unknown as HTMLAnchorElement | null;
                  }}
                  data-property-id={p.id}
                  onMouseEnter={() => setHoverId(p.id)}
                  onMouseLeave={() => setHoverId(null)}
                  className={activeId === p.id ? "ring-2 ring-brand-orange rounded-2xl" : ""}
                >
                  <PropertyCard
                    p={p}
                    active={activeId === p.id}
                    onHover={() => setHoverId(p.id)}
                    onLeave={() => setHoverId(null)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — sticky MiniMap (40%) */}
        <div className="lg:sticky lg:top-[88px] lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card">
            <div className="h-[60vh] lg:h-[calc(100vh-220px)]">
              <MiniMap
                properties={filtered}
                activeId={activeId}
                hoverId={hoverId}
                onHover={setHoverId}
              />
            </div>
          </div>
          <p className="mt-2 text-center text-[11px] text-brand-mute">
            Map tiles by OpenStreetMap · Click a marker for price &amp; Street View
          </p>
        </div>
      </div>
    </div>
  );
}
