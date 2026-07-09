import type { CoLiving } from "../types";

export function CoLivingMatch({ data }: { data: CoLiving }) {
  const total = data.occupants.length;
  const profs = data.occupants.reduce<Record<string, number>>((acc, o) => {
    const key = o.profession.split(" ")[0];
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const summary = Object.entries(profs)
    .map(([k, v]) => `${v} ${k}${v > 1 ? "s" : ""}`)
    .join(", ");

  return (
    <div className="rounded-2xl border border-brand-line bg-white p-5 shadow-card">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-deep">
            Co-Living Match
          </h3>
          <p className="text-xs text-brand-mute">
            Current flatmates ({total}/{data.totalBeds} occupied)
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm text-brand-ink">
        Current occupants: <span className="font-semibold text-brand-deep">{summary}</span>.
      </p>

      <div className="mt-4 space-y-3">
        {data.occupants.map((o, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg bg-brand-slate p-2">
            <img
              src={o.avatar}
              alt=""
              className="h-10 w-10 rounded-full bg-white"
              loading="lazy"
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-brand-deep">
                {o.profession}
              </div>
              <div className="text-xs text-brand-mute">Age {o.ageRange}</div>
            </div>
            <div className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-deep">
              {o.profession.includes("Student") ? "Student" : "Pro"}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg bg-brand-deep/5 px-3 py-2 text-sm">
        <span className="text-brand-deep">Social fit score</span>
        <span className="font-extrabold text-brand-orange">82%</span>
      </div>
      <p className="mt-1 text-[11px] text-brand-mute">
        Mock fit score — based on your preferences &amp; typical co-living compatibility.
      </p>
    </div>
  );
}
