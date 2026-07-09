import { useAuthStore } from "../store/authStore";
import { Icon } from "./icons";

export function SavePromptModal() {
  const { savePromptPropertyId, closeSavePrompt, openAuth } = useAuthStore();
  if (!savePromptPropertyId) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/30 p-4 sm:items-center"
      onClick={closeSavePrompt}
    >
      <div
        className="w-full max-w-md animate-slide-up overflow-hidden rounded-2xl bg-white shadow-card-hover"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6">
          <div className="flex items-center gap-2 text-brand-orange">
            <Icon.Heart size={20} filled />
            <span className="text-sm font-bold uppercase tracking-wider">
              Save this property
            </span>
          </div>
          <h3 className="mt-2 text-lg font-bold text-brand-deep">
            Sign in to keep this listing
          </h3>
          <p className="mt-1 text-sm text-brand-mute">
            Your spot on the listings page is preserved — log in now and we'll
            add it to your shortlist.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 p-6">
          <button
            onClick={() => {
              closeSavePrompt();
              openAuth("login");
            }}
            className="rounded-lg border border-brand-deep bg-white py-2.5 text-sm font-semibold text-brand-deep transition hover:bg-brand-deep hover:text-white"
          >
            Login
          </button>
          <button
            onClick={() => {
              closeSavePrompt();
              openAuth("register");
            }}
            className="rounded-lg bg-brand-orange py-2.5 text-sm font-bold text-white transition hover:bg-brand-orange-hover"
          >
            Register
          </button>
        </div>
        <button
          onClick={closeSavePrompt}
          className="block w-full border-t border-brand-line py-2.5 text-xs text-brand-mute hover:bg-brand-slate"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
