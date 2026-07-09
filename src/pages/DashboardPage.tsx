import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProperties } from "../api/propertiesApi";
import type { Property, PriceAlert } from "../types";
import { useAuthStore } from "../store/authStore";
import { useShortlistStore } from "../store/shortlistStore";
import { PropertyCard } from "../components/PropertyCard";
import {
  SmartAlertContainer,
  SmartAlertToast,
} from "../components/SmartAlert";
import { Icon } from "../components/icons";

export function DashboardPage() {
  const { user } = useAuthStore();
  const {
    saved,
    views,
    recordView,
    computeAlerts,
    markAlertDismissed,
  } = useShortlistStore();
  const [all, setAll] = useState<Property[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);

  useEffect(() => {
    getProperties().then(setAll);
  }, []);

  const savedProperties = useMemo(
    () => all.filter((p) => saved[p.id]),
    [all, saved]
  );

  useEffect(() => {
    if (savedProperties.length === 0) {
      setAlerts([]);
      return;
    }
    const map: Record<string, number> = {};
    savedProperties.forEach((p) => (map[p.id] = p.rent));
    setAlerts(computeAlerts((id) => map[id] ?? 0));
  }, [savedProperties, computeAlerts]);

  // Record a "view" when this page mounts (for the savedProperty in case)
  useEffect(() => {
    savedProperties.forEach((p) => recordView(p.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedProperties.length]);

  if (!user) return <UnauthenticatedState />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-deep sm:text-3xl">
            My Shortlists
          </h1>
          <p className="mt-1 text-sm text-brand-mute">
            Welcome back, {user.name.split(" ")[0]} —{" "}
            {user.role
              ? user.role === "rent"
                ? "hunting for the right rental"
                : "shopping for a home to buy"
              : "complete your profile to personalize matches"}
            .
          </p>
        </div>
        <Link
          to="/listings"
          className="rounded-full bg-brand-orange px-4 py-2 text-sm font-bold text-white hover:bg-brand-orange-hover"
        >
          Explore more
        </Link>
      </div>

      {/* Smart alerts */}
      {alerts.length > 0 && (
        <section className="mb-6 rounded-2xl border border-brand-orange/30 bg-brand-orange/5 p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-orange">
            <Icon.Bell size={14} /> Smart Alerts
          </h2>
          <p className="mt-1 text-xs text-brand-mute">
            Based on properties you've saved and viewed 3+ times.
          </p>
          <div className="mt-3 space-y-3">
            {alerts.map((a) => {
              const prop = savedProperties.find((p) => p.id === a.propertyId);
              if (!prop) return null;
              return (
                <div
                  key={a.propertyId}
                  className="flex items-center justify-between gap-3 rounded-xl border border-brand-line bg-white p-3 shadow-card"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-brand-deep">
                      {prop.title}
                    </div>
                    <div className="text-xs text-brand-mute">
                      Price dropped from {formatINR(a.savedPrice)} to{" "}
                      <span className="font-bold text-brand-success">
                        {formatINR(a.currentPrice)}
                      </span>{" "}
                      (-{a.dropPercent}%)
                    </div>
                  </div>
                  <Link
                    to={`/property/${a.propertyId}`}
                    className="rounded-full bg-brand-orange px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-orange-hover"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => markAlertDismissed(a.propertyId)}
                    className="rounded-full p-1.5 text-brand-mute hover:bg-brand-slate"
                    aria-label="Dismiss"
                  >
                    <Icon.X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Saved" value={savedProperties.length} />
        <Stat
          label="Total views"
          value={Object.values(views).reduce((a, b) => a + b, 0)}
        />
        <Stat
          label="Active alerts"
          value={alerts.length}
          accent={alerts.length > 0 ? "orange" : undefined}
        />
        <Stat
          label="Member since"
          value={new Date().toLocaleString("en", { month: "short" })}
        />
      </div>

      {/* Saved listings grid */}
      <h2 className="text-lg font-bold text-brand-deep">
        Properties you've left out
      </h2>
      <p className="mt-1 text-sm text-brand-mute">
        Click any card to revisit. Save again to remove.
      </p>

      {savedProperties.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-brand-line bg-white p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
            <Icon.Heart size={22} />
          </div>
          <h3 className="mt-3 text-lg font-bold text-brand-deep">
            No saved properties yet
          </h3>
          <p className="mt-1 text-sm text-brand-mute">
            Tap the heart on any listing to save it for later.
          </p>
          <Link
            to="/listings"
            className="mt-4 inline-block rounded-full bg-brand-orange px-5 py-2 text-sm font-bold text-white hover:bg-brand-orange-hover"
          >
            Start exploring
          </Link>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {savedProperties.map((p) => (
            <div key={p.id} className="relative">
              <PropertyCard p={p} />
              <div className="absolute right-3 top-3 z-10 mt-12 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold text-brand-deep shadow-card">
                Viewed {views[p.id] ?? 0}x
              </div>
            </div>
          ))}
        </div>
      )}

      <SmartAlertContainer>
        {alerts.slice(0, 1).map((a) => {
          const prop = savedProperties.find((p) => p.id === a.propertyId);
          if (!prop) return null;
          return (
            <SmartAlertToast
              key={a.propertyId}
              alert={a}
              propertyTitle={prop.title}
              onDismiss={() => markAlertDismissed(a.propertyId)}
            />
          );
        })}
      </SmartAlertContainer>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: "orange" | "deep";
}) {
  return (
    <div className="rounded-2xl border border-brand-line bg-white p-4 shadow-card">
      <div className="text-[10px] uppercase tracking-wider text-brand-mute">
        {label}
      </div>
      <div
        className={`mt-1 text-2xl font-extrabold ${
          accent === "orange" ? "text-brand-orange" : "text-brand-deep"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function UnauthenticatedState() {
  const { openAuth } = useAuthStore();
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
        <Icon.User size={26} />
      </div>
      <h1 className="mt-4 text-2xl font-bold text-brand-deep">
        Sign in to view your shortlists
      </h1>
      <p className="mt-2 text-sm text-brand-mute">
        Your saved homes and smart alerts live here.
      </p>
      <div className="mt-5 flex justify-center gap-2">
        <button
          onClick={() => openAuth("login")}
          className="rounded-full bg-brand-orange px-5 py-2 text-sm font-bold text-white hover:bg-brand-orange-hover"
        >
          Login
        </button>
        <button
          onClick={() => openAuth("register")}
          className="rounded-full border border-brand-deep bg-white px-5 py-2 text-sm font-semibold text-brand-deep hover:bg-brand-deep hover:text-white"
        >
          Register
        </button>
      </div>
    </div>
  );
}

function formatINR(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return `₹${n}`;
}
