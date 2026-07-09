import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../components/icons";
import { PropertyCard } from "../components/PropertyCard";
import { getProperties } from "../api/propertiesApi";
import { useEffect } from "react";

const FEATURED_LOCALITIES = [
  "Indiranagar",
  "Koramangala",
  "Whitefield",
  "HSR Layout",
  "MG Road",
  "Electronic City",
];

export function LandingPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();
  const [featured, setFeatured] = useState<ReturnType<typeof getProperties> extends Promise<infer T> ? T : never>([]);

  useEffect(() => {
    getProperties().then((all) => setFeatured(all.slice(0, 3)));
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (type) params.set("type", type);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-deep via-brand-deep-light to-brand-deep">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
              <Icon.Sparkle size={14} className="text-brand-orange" />
              No brokerage · Direct from owners
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              Find your next home with{" "}
              <span className="text-brand-orange">Transparency &amp; Speed</span>
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Verified listings, real-time map tracking, neighborhood audio from
              the owner, and smart alerts so you never miss the right home.
            </p>
          </div>

          {/* Search bar */}
          <form
            onSubmit={onSearch}
            className="mt-8 grid grid-cols-1 gap-2 rounded-2xl bg-white p-3 shadow-card-hover sm:grid-cols-[1fr_180px_auto]"
          >
            <div className="flex items-center gap-2 rounded-lg bg-brand-slate px-3">
              <Icon.Search size={18} className="text-brand-mute" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by locality, BHK, project…"
                className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-brand-mute"
              />
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-brand-slate px-3">
              <Icon.Bed size={18} className="text-brand-mute" />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="flex-1 bg-transparent py-3 text-sm outline-none"
              >
                <option value="">All types</option>
                <option value="1RK">1 RK</option>
                <option value="1BHK">1 BHK</option>
                <option value="2BHK">2 BHK</option>
                <option value="3BHK">3 BHK</option>
                <option value="PG">PG</option>
              </select>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-brand-orange px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-orange-hover"
            >
              Search
            </button>
          </form>

          {/* Locality chips */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-white/60">
              Popular:
            </span>
            {FEATURED_LOCALITIES.map((l) => (
              <button
                key={l}
                onClick={() => navigate(`/listings?q=${encodeURIComponent(l)}`)}
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white hover:bg-brand-orange"
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* USPs */}
      <section className="bg-brand-slate py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-brand-deep sm:text-3xl">
            Built different. Built for you.
          </h2>
          <p className="mt-2 max-w-2xl text-brand-mute">
            Four features that no other property portal gives you.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <USP
              color="orange"
              icon={<Icon.MapPin size={18} />}
              title="Live Map Tracking"
              desc="The map highlights as you scroll. Hover a card to see the price popup and Street View."
            />
            <USP
              color="deep"
              icon={<Icon.Sparkle size={18} />}
              title="Neighborhood Vibe"
              desc="Hear the owner's 30-second audio summary of the locality before you visit."
            />
            <USP
              color="orange"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>}
              title="Virtual Walk Score"
              desc="Out of 100 — based on grocery, metro and hospital distance within 1 km."
            />
            <USP
              color="deep"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m7 14 4-4 4 4 5-5" /></svg>}
              title="Price Trend & Deal Tag"
              desc="6-month price chart vs. locality average. Spot Overvalued, Fair, and Great Deals."
            />
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-brand-deep sm:text-3xl">
                Hand-picked homes
              </h2>
              <p className="mt-1 text-brand-mute">
                Top verified listings in Bangalore this week
              </p>
            </div>
            <button
              onClick={() => navigate("/listings")}
              className="hidden text-sm font-semibold text-brand-orange hover:underline sm:block"
            >
              See all →
            </button>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-deep py-12 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Own a property? List it in 2 minutes.
          </h2>
          <p className="max-w-xl text-white/80">
            Reach thousands of verified tenants and buyers — no brokerage, no
            hidden fees.
          </p>
          <button className="rounded-full bg-brand-orange px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-orange-hover">
            Post Property — It's Free
          </button>
        </div>
      </section>

      <footer className="border-t border-brand-line bg-white py-6 text-center text-xs text-brand-mute">
        © {new Date().getFullYear()} PropertyHub. Built as a high-fidelity
        prototype.
      </footer>
    </div>
  );
}

function USP({
  color,
  icon,
  title,
  desc,
}: {
  color: "orange" | "deep";
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-brand-line bg-white p-5 shadow-card">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full ${
          color === "orange"
            ? "bg-brand-orange/15 text-brand-orange"
            : "bg-brand-deep/10 text-brand-deep"
        }`}
      >
        {icon}
      </div>
      <h3 className="mt-3 text-base font-bold text-brand-deep">{title}</h3>
      <p className="mt-1 text-sm text-brand-mute">{desc}</p>
    </div>
  );
}
