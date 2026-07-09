import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PriceAlert } from "../types";

interface SavedEntry {
  savedAt: number; // ms epoch
  savedPrice: number;
  notified?: boolean;
}

interface ShortlistState {
  saved: Record<string, SavedEntry>;
  views: Record<string, number>;
  lastViewedAt: Record<string, number>;
  dismissedAlerts: string[]; // propertyIds the user has dismissed
  // actions
  toggleSave: (propertyId: string, currentPrice: number) => "saved" | "removed" | "needs-auth";
  isSaved: (propertyId: string) => boolean;
  recordView: (propertyId: string) => void;
  // smart alert helpers
  computeAlerts: (priceOf: (id: string) => number) => PriceAlert[];
  markAlertDismissed: (propertyId: string) => void;
}

export const useShortlistStore = create<ShortlistState>()(
  persist(
    (set, get) => ({
      saved: {},
      views: {},
      lastViewedAt: {},
      dismissedAlerts: [],
      toggleSave: (propertyId, currentPrice) => {
        const { saved } = get();
        if (saved[propertyId]) {
          const { [propertyId]: _, ...rest } = saved;
          set({ saved: rest });
          return "removed";
        }
        set({
          saved: {
            ...saved,
            [propertyId]: { savedAt: Date.now(), savedPrice: currentPrice },
          },
        });
        return "saved";
      },
      isSaved: (propertyId) => Boolean(get().saved[propertyId]),
      recordView: (propertyId) => {
        const { views, lastViewedAt } = get();
        set({
          views: { ...views, [propertyId]: (views[propertyId] ?? 0) + 1 },
          lastViewedAt: { ...lastViewedAt, [propertyId]: Date.now() },
        });
      },
      computeAlerts: (priceOf) => {
        const { saved, views, dismissedAlerts } = get();
        const out: PriceAlert[] = [];
        for (const [id, entry] of Object.entries(saved)) {
          if (dismissedAlerts.includes(id)) continue;
          const current = priceOf(id);
          const viewCount = views[id] ?? 0;
          if (viewCount < 3) continue;
          if (current >= entry.savedPrice) continue;
          const drop = Math.round(
            ((entry.savedPrice - current) / entry.savedPrice) * 100
          );
          if (drop < 3) continue;
          out.push({
            propertyId: id,
            savedPrice: entry.savedPrice,
            currentPrice: current,
            dropPercent: drop,
          });
        }
        return out;
      },
      markAlertDismissed: (propertyId) =>
        set((s) => ({
          dismissedAlerts: [...s.dismissedAlerts, propertyId],
        })),
    }),
    {
      name: "ph_shortlist",
    }
  )
);
