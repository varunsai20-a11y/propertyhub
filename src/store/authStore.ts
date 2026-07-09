import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole } from "../types";

interface StoredAccount {
  id: string;
  name: string;
  email: string;
  password: string; // demo only
  role: UserRole | null;
  provider: "local" | "google";
}

interface AuthState {
  user: User | null;
  isAuthModalOpen: boolean;
  authModalTab: "login" | "register";
  savePromptPropertyId: string | null; // when non-null, the SavePromptModal is shown
  openAuth: (tab?: "login" | "register") => void;
  closeAuth: () => void;
  openSavePrompt: (propertyId: string) => void;
  closeSavePrompt: () => void;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => { ok: boolean; error?: string };
  loginWithGoogle: () => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

const ACCOUNTS_KEY = "ph_accounts";

function loadAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as StoredAccount[]) : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function makeUser(a: StoredAccount): User {
  return {
    id: a.id,
    name: a.name,
    email: a.email,
    role: a.role,
    provider: a.provider,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      a.name
    )}&backgroundColor=1A365D&textColor=ffffff`,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthModalOpen: false,
      authModalTab: "login",
      savePromptPropertyId: null,
      openAuth: (tab = "login") =>
        set({ isAuthModalOpen: true, authModalTab: tab }),
      closeAuth: () => set({ isAuthModalOpen: false }),
      openSavePrompt: (propertyId) => set({ savePromptPropertyId: propertyId }),
      closeSavePrompt: () => set({ savePromptPropertyId: null }),
      login: (email, password) => {
        const accounts = loadAccounts();
        const a = accounts.find(
          (x) => x.email.toLowerCase() === email.trim().toLowerCase()
        );
        if (!a) return { ok: false, error: "No account with that email." };
        if (a.password !== password)
          return { ok: false, error: "Incorrect password." };
        set({ user: makeUser(a), isAuthModalOpen: false });
        return { ok: true };
      },
      register: (name, email, password, role) => {
        const accounts = loadAccounts();
        const exists = accounts.some(
          (x) => x.email.toLowerCase() === email.trim().toLowerCase()
        );
        if (exists)
          return { ok: false, error: "An account with that email exists." };
        const newAccount: StoredAccount = {
          id: `u_${Date.now()}`,
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          provider: "local",
        };
        accounts.push(newAccount);
        saveAccounts(accounts);
        set({ user: makeUser(newAccount), isAuthModalOpen: false });
        return { ok: true };
      },
      loginWithGoogle: () => {
        const accounts = loadAccounts();
        const email = "google.user@propertyhub.com";
        let a = accounts.find((x) => x.email === email);
        if (!a) {
          a = {
            id: `u_g_${Date.now()}`,
            name: "Google User",
            email,
            password: "",
            role: null,
            provider: "google",
          };
          accounts.push(a);
          saveAccounts(accounts);
        }
        set({ user: makeUser(a), isAuthModalOpen: false });
      },
      logout: () => set({ user: null }),
      setRole: (role) => {
        const u = get().user;
        if (!u) return;
        const updated = { ...u, role };
        set({ user: updated });
        const accounts = loadAccounts();
        const idx = accounts.findIndex((a) => a.id === u.id);
        if (idx >= 0) {
          accounts[idx] = { ...accounts[idx], role };
          saveAccounts(accounts);
        }
      },
    }),
    {
      name: "ph_auth",
      partialize: (s) => ({ user: s.user }),
    }
  )
);
