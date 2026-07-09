import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { PriceAlert } from "../types";
import { Icon } from "./icons";
import { useShortlistStore } from "../store/shortlistStore";
import { useAuthStore } from "../store/authStore";

export function SmartAlert() {
  const user = useAuthStore((s) => s.user);
  const { computeAlerts, markAlertDismissed } = useShortlistStore();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Force a refresh when the page mounts or the user changes.
    // We don't have property data here; the DashboardPage passes alerts in via store.
    // For dashboard-level alerts, see DashboardPage's own useEffect.
  }, [user]);

  if (!user) return null;

  return null; // Alerts are rendered inline in DashboardPage for context.
  // Kept as a placeholder for future global toast support.
}

export function SmartAlertToast({
  alert,
  propertyTitle,
  onDismiss,
}: {
  alert: PriceAlert;
  propertyTitle: string;
  onDismiss: () => void;
}) {
  return (
    <div className="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border border-brand-orange/30 bg-white p-4 shadow-card-hover animate-slide-up">
      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
        <Icon.Bell size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold text-brand-deep">
          Did you miss out on this?
        </div>
        <p className="mt-0.5 text-xs text-brand-mute">
          <Link
            to={`/property/${alert.propertyId}`}
            className="font-semibold text-brand-deep hover:underline"
          >
            {propertyTitle}
          </Link>{" "}
          — price dropped by{" "}
          <span className="font-bold text-brand-success">
            {alert.dropPercent}%
          </span>{" "}
          since you saved it.
        </p>
        <div className="mt-2 flex gap-2">
          <Link
            to={`/property/${alert.propertyId}`}
            className="rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white hover:bg-brand-orange-hover"
          >
            View now
          </Link>
          <button
            onClick={onDismiss}
            className="rounded-full border border-brand-line px-3 py-1 text-xs font-semibold text-brand-ink hover:border-brand-deep"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

export function SmartAlertContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-30 flex w-full max-w-md -translate-x-1/2 flex-col gap-2 px-4 sm:left-auto sm:right-4 sm:translate-x-0">
      {children}
    </div>
  );
}
