import { useEffect, useState } from "react";
import type { WalkBreakdown } from "../types";

export function WalkScore({
  score,
  breakdown,
}: {
  score: number;
  breakdown: WalkBreakdown;
}) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 900;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setShown(Math.round(p * score));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const r = 50;
  const c = 2 * Math.PI * r;
  const dash = (shown / 100) * c;
  const color =
    shown >= 80
      ? "#38A169"
      : shown >= 60
      ? "#ED8936"
      : shown >= 40
      ? "#DD7724"
      : "#E53E3E";
  const label =
    shown >= 80
      ? "Walker's Paradise"
      : shown >= 60
      ? "Very Walkable"
      : shown >= 40
      ? "Somewhat Walkable"
      : "Car-Dependent";

  return (
    <div className="rounded-2xl border border-brand-line bg-white p-5 shadow-card">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-deep/10 text-brand-deep">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="2" />
            <path d="M8 22V12l-3-3 4-4 5 1 3 5" />
            <path d="M16 13v4" />
            <path d="M16 22v-3" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-deep">
            Virtual Walk Score
          </h3>
          <p className="text-xs text-brand-mute">Within 1 km radius</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-5">
        <div className="relative h-32 w-32 flex-none">
          <svg viewBox="0 0 120 120" className="-rotate-90">
            <circle
              cx="60"
              cy="60"
              r={r}
              stroke="#E2E8F0"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r={r}
              stroke={color}
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${dash} ${c - dash}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.2s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-brand-deep">
              {shown}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-brand-mute">
              / 100
            </span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <Bar label="Grocery" v={breakdown.grocery} />
          <Bar label="Metro" v={breakdown.metro} />
          <Bar label="Hospital" v={breakdown.hospital} />
        </div>
      </div>
      <div className="mt-3 text-sm font-semibold" style={{ color }}>
        {label}
      </div>
    </div>
  );
}

function Bar({ label, v }: { label: string; v: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-brand-ink">
        <span>{label}</span>
        <span className="font-bold text-brand-deep">{v}</span>
      </div>
      <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-brand-line">
        <div
          className="h-full rounded-full bg-brand-deep"
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}
