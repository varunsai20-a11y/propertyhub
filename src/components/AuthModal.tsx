import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Icon } from "./icons";

export function AuthModal() {
  const {
    isAuthModalOpen,
    authModalTab,
    openAuth,
    closeAuth,
    login,
    register,
    loginWithGoogle,
  } = useAuthStore();
  const [tab, setTab] = useState<"login" | "register">(authModalTab);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<"rent" | "buy">("rent");
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = login(email, password);
    if (!res.ok) setError(res.error ?? "Login failed");
  };

  const onRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Please enter your name.");
    if (!email.includes("@")) return setError("Please enter a valid email.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords don't match.");
    const res = register(name, email, password, role);
    if (!res.ok) setError(res.error ?? "Registration failed");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in"
      onClick={closeAuth}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-card-hover"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeAuth}
          className="absolute right-3 top-3 rounded-full p-1.5 text-brand-mute hover:bg-brand-slate"
          aria-label="Close"
        >
          <Icon.X size={18} />
        </button>

        <div className="px-6 pt-6">
          <div className="text-xl font-bold text-brand-deep">
            {tab === "login" ? "Welcome back" : "Create your account"}
          </div>
          <p className="mt-1 text-sm text-brand-mute">
            {tab === "login"
              ? "Log in to save properties and view your shortlists."
              : "Join PropertyHub to shortlist and track properties."}
          </p>
        </div>

        <div className="mt-4 flex border-b border-brand-line">
          {(["login", "register"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setError(null);
              }}
              className={`flex-1 py-2.5 text-sm font-semibold capitalize transition ${
                tab === t
                  ? "border-b-2 border-brand-orange text-brand-deep"
                  : "text-brand-mute hover:text-brand-ink"
              }`}
            >
              {t === "login" ? "Login" : "Register"}
            </button>
          ))}
        </div>

        <div className="p-6">
          <button
            onClick={loginWithGoogle}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-line bg-white py-2.5 text-sm font-semibold text-brand-ink shadow-card hover:border-brand-deep"
          >
            <Icon.Google size={18} /> Continue with Google
          </button>

          <div className="my-4 flex items-center gap-3 text-xs uppercase tracking-wider text-brand-mute">
            <div className="h-px flex-1 bg-brand-line" />
            or
            <div className="h-px flex-1 bg-brand-line" />
          </div>

          {tab === "login" ? (
            <form onSubmit={onLogin} className="space-y-3">
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
              />
              <Field
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
              />
              {error && <p className="text-sm text-brand-danger">{error}</p>}
              <button
                type="submit"
                className="w-full rounded-lg bg-brand-orange py-2.5 text-sm font-bold text-white shadow-card transition hover:bg-brand-orange-hover"
              >
                Login
              </button>
              <p className="text-center text-xs text-brand-mute">
                New here?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setTab("register");
                    openAuth("register");
                  }}
                  className="font-semibold text-brand-deep hover:underline"
                >
                  Create an account
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={onRegister} className="space-y-3">
              <Field label="Full name" value={name} onChange={setName} placeholder="Your name" />
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
              />
              <Field
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="At least 6 characters"
              />
              <Field
                label="Confirm password"
                type="password"
                value={confirm}
                onChange={setConfirm}
                placeholder="Re-enter password"
              />
              <div>
                <label className="text-xs font-semibold text-brand-deep">
                  I am looking to
                </label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {(["rent", "buy"] as const).map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRole(r)}
                      className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                        role === r
                          ? "border-brand-orange bg-brand-orange/10 text-brand-deep"
                          : "border-brand-line text-brand-mute hover:border-brand-deep"
                      }`}
                    >
                      {r === "rent" ? "Rent a home" : "Buy a home"}
                    </button>
                  ))}
                </div>
              </div>
              {error && <p className="text-sm text-brand-danger">{error}</p>}
              <button
                type="submit"
                className="w-full rounded-lg bg-brand-orange py-2.5 text-sm font-bold text-white shadow-card transition hover:bg-brand-orange-hover"
              >
                Create account
              </button>
              <p className="text-center text-xs text-brand-mute">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setTab("login");
                    openAuth("login");
                  }}
                  className="font-semibold text-brand-deep hover:underline"
                >
                  Log in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-brand-deep">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-brand-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-deep"
      />
    </label>
  );
}
