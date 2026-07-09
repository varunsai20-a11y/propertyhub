import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getPropertyById } from "../api/propertiesApi";
import type { Property } from "../types";
import { useAuthStore } from "../store/authStore";
import { useShortlistStore } from "../store/shortlistStore";
import { Icon, amenityIcon } from "../components/icons";
import { formatINR, formatINRFull, timeAgo } from "../lib/format";
import { NeighborhoodVibe } from "../components/NeighborhoodVibe";
import { WalkScore } from "../components/WalkScore";
import { PriceTrendChart } from "../components/PriceTrendChart";
import { CoLivingMatch } from "../components/CoLivingMatch";

// Fix default Leaflet marker icon (broken by bundlers)
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [p, setP] = useState<Property | null>(null);
  const [photoIdx, setPhotoIdx] = useState(0);
  const navigate = useNavigate();
  const { user, openAuth, openSavePrompt } = useAuthStore();
  const { isSaved, toggleSave, recordView } = useShortlistStore();

  // Modal state
  const [visitModal, setVisitModal] = useState(false);
  const [contactModal, setContactModal] = useState(false);

  const openVisit = () => {
    if (!user) { openAuth("login"); return; }
    setVisitModal(true);
  };
  const openContact = () => {
    if (!user) { openAuth("login"); return; }
    setContactModal(true);
  };

  useEffect(() => {
    if (!id) return;
    getPropertyById(id).then((prop) => {
      setP(prop);
      if (prop) recordView(prop.id);
    });
  }, [id, recordView]);

  if (!p) {
    return (
      <div className="mx-auto max-w-5xl p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-72 rounded-2xl bg-brand-slate" />
          <div className="h-8 w-2/3 rounded bg-brand-slate" />
        </div>
      </div>
    );
  }

  const saved = isSaved(p.id);
  const onHeart = () => {
    if (!user) return openSavePrompt(p.id);
    toggleSave(p.id, p.rent);
  };

  return (
    <>
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-sm font-semibold text-brand-deep hover:text-brand-orange"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
        Back to listings
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* MAIN COLUMN */}
        <div className="space-y-6">
          {/* Gallery */}
          <div className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card">
            <div className="relative">
              <img
                src={p.photos[photoIdx]}
                alt={p.title}
                className="aspect-[16/9] w-full object-cover"
              />
              {p.photos.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setPhotoIdx((i) => (i - 1 + p.photos.length) % p.photos.length)
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand-deep shadow-card hover:bg-white"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setPhotoIdx((i) => (i + 1) % p.photos.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand-deep shadow-card hover:bg-white"
                  >
                    ›
                  </button>
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {p.photos.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPhotoIdx(i)}
                        className={`h-1.5 w-6 rounded-full transition ${
                          i === photoIdx ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
              <button
                onClick={onHeart}
                className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-card hover:scale-110 ${
                  saved ? "text-brand-orange" : "text-brand-mute hover:text-brand-orange"
                }`}
              >
                <Icon.Heart size={20} filled={saved} />
              </button>
            </div>
          </div>

          {/* Title + meta */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-deep/10 px-3 py-1 text-xs font-bold text-brand-deep">
                {p.type}
              </span>
              <span className="rounded-full bg-brand-slate px-3 py-1 text-xs text-brand-ink">
                {p.furnishing}
              </span>
              <span className="rounded-full bg-brand-slate px-3 py-1 text-xs text-brand-ink">
                {p.availability}
              </span>
              <span className="ml-auto flex items-center gap-1 text-xs text-brand-mute">
                <Icon.Clock size={12} /> Posted {timeAgo(p.postedDaysAgo)}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold text-brand-deep sm:text-3xl">
              {p.title}
            </h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-brand-mute">
              <Icon.MapPin size={14} /> {p.locality}, {p.city}
            </p>
          </div>

          {/* Key specs */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Spec icon={<Icon.Bed size={18} />} label="Configuration" value={p.type} />
            {p.type !== "PG" && (
              <Spec icon={<Icon.Ruler size={18} />} label="Area" value={`${p.sqft} sqft`} />
            )}
            {p.coLiving ? (
              <Spec
                icon={<Icon.User size={18} />}
                label="Beds"
                value={`${p.coLiving.availableBeds}/${p.coLiving.totalBeds} free`}
              />
            ) : (
              <Spec
                icon={<Icon.Calendar size={18} />}
                label="Available"
                value={p.availability}
              />
            )}
            <Spec
              icon={<Icon.Sparkle size={18} />}
              label="Rent"
              value={formatINRFull(p.rent)}
            />
          </div>

          {/* Amenities */}
          <section className="rounded-2xl border border-brand-line bg-white p-5 shadow-card">
            <h2 className="text-base font-bold text-brand-deep">Amenities</h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {p.amenities.map((a) => {
                const I = amenityIcon(a);
                return (
                  <div
                    key={a}
                    className="flex items-center gap-2 rounded-lg bg-brand-slate px-3 py-2 text-sm capitalize text-brand-ink"
                  >
                    <span className="text-brand-deep">
                      <I size={16} />
                    </span>
                    {a}
                  </div>
                );
              })}
            </div>
          </section>

          {/* USP FEATURES */}
          <NeighborhoodVibe
            quote={p.ownerQuote}
            audioClip={p.audioClip}
            ownerName={p.ownerName}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <WalkScore score={p.walkScore} breakdown={p.walkBreakdown} />
            <PriceTrendChart
              history={p.priceHistory}
              localityAvg={p.localityAvg}
              current={p.rent}
            />
          </div>

          {p.coLiving && <CoLivingMatch data={p.coLiving} />}

          {/* About the owner */}
          <section className="rounded-2xl border border-brand-line bg-white p-5 shadow-card">
            <h2 className="text-base font-bold text-brand-deep">About the owner</h2>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-lg font-bold text-white">
                {p.ownerName.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-semibold text-brand-deep">
                  {p.ownerName}
                </div>
                <div className="text-xs text-brand-mute">Verified owner</div>
              </div>
            </div>
          </section>
        </div>

        {/* STICKY RIGHT RAIL */}
        <aside className="space-y-4 lg:sticky lg:top-[88px] lg:self-start">
          <div className="rounded-2xl border border-brand-line bg-white p-5 shadow-card">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-brand-deep">
                {formatINRFull(p.rent)}
              </span>
              <span className="text-sm text-brand-mute">/ month</span>
            </div>
            {p.type !== "PG" && (
              <p className="mt-1 text-xs text-brand-mute">
                Deposit {formatINRFull(p.deposit)}
              </p>
            )}
            <button
              onClick={openVisit}
              className="mt-4 w-full rounded-lg bg-brand-orange py-3 text-sm font-bold text-white shadow-card transition hover:bg-brand-orange-hover"
            >
              Book a Visit
            </button>
            <button
              onClick={openContact}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-brand-orange py-3 text-sm font-bold text-brand-orange transition hover:bg-brand-orange/5"
            >
              <Icon.Phone size={14} /> Contact Owner
            </button>
            <button
              onClick={onHeart}
              className={`mt-2 flex w-full items-center justify-center gap-2 rounded-lg border py-3 text-sm font-bold transition ${
                saved
                  ? "border-brand-orange text-brand-orange"
                  : "border-brand-line text-brand-ink hover:border-brand-deep"
              }`}
            >
              <Icon.Heart size={14} filled={saved} />{" "}
              {saved ? "Saved" : "Save to Shortlist"}
            </button>
          </div>

          <div className="rounded-2xl border border-brand-line bg-white p-5 text-sm shadow-card">
            <h3 className="mb-2 text-sm font-bold text-brand-deep">Location</h3>
            <div className="overflow-hidden rounded-xl" style={{ height: 220 }}>
              <MapContainer
                center={[p.lat, p.lng]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[p.lat, p.lng]}>
                  <Popup>{p.title}</Popup>
                </Marker>
              </MapContainer>
            </div>
            <div className="mt-3 flex gap-3">
              <a
                href={`https://www.openstreetmap.org/#map=17/${p.lat}/${p.lng}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-brand-orange hover:underline"
              >
                Open in OpenStreetMap ↗
              </a>
              <a
                href={`https://maps.google.com/maps?q=${p.lat},${p.lng}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-brand-orange hover:underline"
              >
                Open in Google Maps ↗
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-brand-line bg-white p-5 text-xs text-brand-mute shadow-card">
            <p>
              Tip: Save this property and view it 3 times to get a smart alert
              if the price drops.
            </p>
            <Link
              to="/dashboard"
              className="mt-2 inline-block text-xs font-bold text-brand-deep hover:underline"
            >
              Go to My Shortlists →
            </Link>
          </div>
        </aside>
      </div>
    </div>

    {/* BOOK A VISIT MODAL */}
    {visitModal && p && (
      <BookVisitModal property={p} onClose={() => setVisitModal(false)} />
    )}

    {/* CONTACT OWNER MODAL */}
    {contactModal && p && (
      <ContactModal property={p} onClose={() => setContactModal(false)} />
    )}
  </>
  );
}

function BookVisitModal({ property, onClose }: { property: Property; onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !date) return;
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl">✓</div>
            <h3 className="text-lg font-extrabold text-brand-deep">Visit Booked!</h3>
            <p className="text-sm text-brand-mute">
              We've scheduled your visit to <span className="font-semibold text-brand-deep">{property.title}</span> on <span className="font-semibold text-brand-deep">{new Date(date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</span>.<br />
              The owner will confirm shortly on <span className="font-semibold text-brand-deep">{phone}</span>.
            </p>
            <button
              onClick={onClose}
              className="mt-2 rounded-lg bg-brand-orange px-6 py-2 text-sm font-bold text-white hover:bg-brand-orange-hover"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-brand-deep">Book a Visit</h3>
              <button onClick={onClose} className="text-brand-mute hover:text-brand-deep">✕</button>
            </div>
            <p className="mt-1 text-xs text-brand-mute">{property.title}</p>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-brand-ink">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-brand-line px-3 py-2 text-sm outline-none focus:border-brand-orange"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-brand-ink">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-brand-line px-3 py-2 text-sm outline-none focus:border-brand-orange"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-brand-ink">Preferred Date</label>
                <input
                  type="date"
                  required
                  min={minDateStr}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-brand-line px-3 py-2 text-sm outline-none focus:border-brand-orange"
                />
              </div>
              <button
                type="submit"
                className="mt-2 w-full rounded-lg bg-brand-orange py-3 text-sm font-bold text-white hover:bg-brand-orange-hover"
              >
                Confirm Visit
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function ContactModal({ property, onClose }: { property: Property; onClose: () => void }) {
  // Demo contact details derived from the owner name (real app would fetch from backend)
  const demoPhone = "98765 43210";
  const demoEmail = `${property.ownerName.replace(/[^a-zA-Z]/g, "").toLowerCase()}@propertyhub.demo`;
  const waMsg = encodeURIComponent(`Hi ${property.ownerName}, I'm interested in your listing: "${property.title}" on PropertyHub.`);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-brand-deep">Contact Owner</h3>
          <button onClick={onClose} className="text-brand-mute hover:text-brand-deep">✕</button>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-lg font-bold text-white">
            {property.ownerName.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-semibold text-brand-deep">{property.ownerName}</div>
            <div className="text-xs text-brand-mute">Verified Owner</div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <a
            href={`tel:${demoPhone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 rounded-lg border border-brand-line px-4 py-3 text-sm font-semibold text-brand-deep hover:border-brand-orange hover:text-brand-orange"
          >
            <Icon.Phone size={16} /> {demoPhone}
          </a>
          <a
            href={`mailto:${demoEmail}`}
            className="flex items-center gap-2 rounded-lg border border-brand-line px-4 py-3 text-sm font-semibold text-brand-deep hover:border-brand-orange hover:text-brand-orange"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            {demoEmail}
          </a>
          <a
            href={`https://wa.me/91${demoPhone.replace(/\s/g, "")}?text=${waMsg}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 text-sm font-bold text-white hover:bg-[#1ebe5d]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            WhatsApp Message
          </a>
        </div>
        <p className="mt-4 text-center text-[10px] text-brand-mute">Demo mode — real contact details shown after owner verification</p>
      </div>
    </div>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-brand-line bg-white p-3 shadow-card">
      <div className="text-brand-deep">{icon}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-brand-mute">
        {label}
      </div>
      <div className="text-sm font-bold text-brand-deep">{value}</div>
    </div>
  );
}
