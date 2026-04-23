"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "cinema-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

// ─── Seat Selection Timer Store ───────────────────────────────────────────────

interface TimerState {
  expiresAt: number | null; // Unix timestamp (ms)
  showtimeId: string | null;
  startTimer: (showtimeId: string, durationSeconds: number) => void;
  clearTimer: () => void;
  isExpired: () => boolean;
}

export const useTimerStore = create<TimerState>()((set, get) => ({
  expiresAt: null,
  showtimeId: null,
  startTimer: (showtimeId, durationSeconds) =>
    set({
      expiresAt: Date.now() + durationSeconds * 1000,
      showtimeId,
    }),
  clearTimer: () => set({ expiresAt: null, showtimeId: null }),
  isExpired: () => {
    const { expiresAt } = get();
    if (!expiresAt) return false;
    return Date.now() > expiresAt;
  },
}));
