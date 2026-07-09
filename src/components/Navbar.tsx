import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Icon } from "./icons";

export function Navbar() {
  const { user, openAuth, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/listings?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-brand-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-deep text-white">
            <Icon.MapPin size={20} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold text-brand-deep">
              PropertyHub
            </span>
            <span className="hidden text-[10px] uppercase tracking-wider text-brand-mute sm:block">
              Transparency &amp; Speed
            </span>
          </div>
        </Link>

        <form
          onSubmit={onSearch}
          className="hidden flex-1 md:flex"
        >
          <div className="flex w-full max-w-2xl items-center gap-2 rounded-full border border-brand-line bg-white px-4 py-2 shadow-card focus-within:border-brand-deep">
            <Icon.Search size={18} className="text-brand-mute" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by locality, BHK, project…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-brand-mute"
            />
            <button
              type="submit"
              className="rounded-full bg-brand-orange px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-orange-hover"
            >
              Search
            </button>
          </div>
        </form>

        <nav className="ml-auto flex items-center gap-2 sm:gap-4">
          <Link
            to="/listings"
            className="hidden text-sm font-medium text-brand-ink hover:text-brand-deep sm:block"
          >
            Listings
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className="hidden text-sm font-medium text-brand-ink hover:text-brand-deep sm:block"
            >
              My Shortlists
            </Link>
          )}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-brand-line bg-white px-2 py-1 text-sm font-medium text-brand-ink hover:border-brand-deep"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-7 w-7 rounded-full bg-brand-slate"
                />
                <span className="hidden max-w-[120px] truncate sm:inline">
                  {user.name.split(" ")[0]}
                </span>
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-brand-line bg-white shadow-card-hover animate-fade-in"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <div className="border-b border-brand-line px-4 py-3">
                    <div className="text-sm font-semibold text-brand-deep">
                      {user.name}
                    </div>
                    <div className="truncate text-xs text-brand-mute">
                      {user.email}
                    </div>
                    {user.role && (
                      <span className="mt-1 inline-block rounded-full bg-brand-deep/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-deep">
                        {user.role === "rent"
                          ? "Looking for Rent"
                          : "Looking to Buy"}
                      </span>
                    )}
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-brand-ink hover:bg-brand-slate"
                  >
                    <Icon.Heart size={16} /> My Shortlists
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 border-t border-brand-line px-4 py-2.5 text-sm text-brand-ink hover:bg-brand-slate"
                  >
                    <Icon.Logout size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuth("login")}
              className="rounded-full border border-brand-deep bg-white px-4 py-1.5 text-sm font-semibold text-brand-deep transition hover:bg-brand-deep hover:text-white"
            >
              Login
            </button>
          )}
        </nav>
      </div>

      {/* Mobile search */}
      <form onSubmit={onSearch} className="border-t border-brand-line px-4 py-2 md:hidden">
        <div className="flex w-full items-center gap-2 rounded-full border border-brand-line bg-white px-3 py-1.5">
          <Icon.Search size={16} className="text-brand-mute" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by locality, BHK…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-brand-mute"
          />
        </div>
      </form>
    </header>
  );
}
