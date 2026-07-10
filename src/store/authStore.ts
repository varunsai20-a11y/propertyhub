import { create } from "zustand";
import type { User, UserRole } from "../types";

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

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthModalOpen: false,
  authModalTab: "login",
  savePromptPropertyId: null,
  openAuth: () => {
    // Overridden by ClerkSync component
  },
  closeAuth: () => set({ isAuthModalOpen: false }),
  openSavePrompt: (propertyId) => set({ savePromptPropertyId: propertyId }),
  closeSavePrompt: () => set({ savePromptPropertyId: null }),
  login: () => {
    return { ok: false, error: "Use Clerk login instead." };
  },
  register: () => {
    return { ok: false, error: "Use Clerk register instead." };
  },
  loginWithGoogle: () => {
    // Deprecated for Clerk
  },
  logout: () => {
    // Overridden by ClerkSync component
  },
  setRole: () => {
    // Overridden by ClerkSync component
  },
}));

