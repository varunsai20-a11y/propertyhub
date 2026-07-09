import { Link } from "react-router-dom";
import type { Property } from "../types";
import { useAuthStore } from "../store/authStore";
import { useShortlistStore } from "../store/shortlistStore";
import { amenityIcon, Icon } from "./icons";
import { formatINR, timeAgo } from "../lib/format";

export function PropertyCard({
  p,
  active = false,
  onHover,
  onLeave,
}: {
  p: Property;
  active?: boolean;
  onHover?: (id: string) => void;
  onLeave?: () => void;
}) {
  const { user, openSavePrompt } = useAuthStore();
  const { isSaved, toggleSave } = useShortlistStore();
  const saved = isSaved(p.id);

  const onHeart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      openSavePrompt(p.id);
      return;
    }
    toggleSave(p.id, p.rent);
  };

  return (
    <Link
      to={`/property/${p.id}`}
      onMouseEnter={() => onHover?.(p.id)}
      onMouseLeave={() => onLeave?.()}
      className={`group block overflow-hidden rounded-2xl border bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover ${
        active
          ? "border-brand-orange ring-2 ring-brand-orange/30"
          : "border-brand-line"
      }`}
      data-property-id={p.id}
    >
      <div className="relative">
        <img
          src={p.photos[0]}
          alt={p.title}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover transition group-hover:scale-[1.02]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1">
          <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold text-brand-deep shadow-card">
            {p.type}
          </span>
          {p.coLiving && (
            <span className="rounded-full bg-brand-orange px-2 py-0.5 text-xs font-bold text-white shadow-card">
              PG · {p.coLiving.availableBeds} bed{p.coLiving.availableBeds === 1 ? "" : "s"} left
            </span>
          )}
        </div>
        <button
          onClick={onHeart}
          aria-label={saved ? "Unsave" : "Save"}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-card transition hover:scale-110 ${
            saved ? "text-brand-orange" : "text-brand-mute hover:text-brand-orange"
          }`}
        >
          <Icon.Heart size={18} filled={saved} />
        </button>
        {p.photos.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">
            1 / {p.photos.length}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-base font-bold text-brand-deep">
            {p.title}
          </h3>
        </div>
        <div className="mt-1 flex items-center gap-1 text-sm text-brand-mute">
          <Icon.MapPin size={14} /> {p.locality}, {p.city}
        </div>

        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-xl font-extrabold text-brand-deep">
            {formatINR(p.rent)}
          </span>
          <span className="text-xs text-brand-mute">/ month</span>
          {p.type !== "PG" && (
            <span className="ml-auto text-xs text-brand-mute">
              Deposit {formatINR(p.deposit)}
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-brand-ink">
          {p.type !== "PG" && p.bhk > 0 && (
            <span className="flex items-center gap-1">
              <Icon.Bed size={14} className="text-brand-deep" /> {p.bhk} BHK
            </span>
          )}
          {p.type !== "PG" && (
            <span className="flex items-center gap-1">
              <Icon.Ruler size={14} className="text-brand-deep" /> {p.sqft} sqft
            </span>
          )}
          {p.coLiving && (
            <span className="flex items-center gap-1">
              <Icon.User size={14} className="text-brand-deep" /> Co-living
            </span>
          )}
          <span className="rounded-full bg-brand-slate px-2 py-0.5">
            {p.furnishing}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-brand-slate px-2 py-0.5">
            <Icon.Calendar size={12} /> {p.availability}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-1.5 border-t border-brand-line pt-3">
          {p.amenities.slice(0, 6).map((a) => {
            const I = amenityIcon(a);
            return (
              <div
                key={a}
                title={a}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-slate text-brand-deep"
              >
                <I size={14} />
              </div>
            );
          })}
          {p.amenities.length > 6 && (
            <span className="text-[10px] font-semibold text-brand-mute">
              +{p.amenities.length - 6}
            </span>
          )}
          <div className="ml-auto flex items-center gap-1 text-[10px] text-brand-mute">
            <Icon.Clock size={12} /> {timeAgo(p.postedDaysAgo)}
          </div>
        </div>
      </div>
    </Link>
  );
}
