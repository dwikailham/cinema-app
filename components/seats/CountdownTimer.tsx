"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Timer, AlertTriangle } from "lucide-react";
import { useTimerStore } from "@/store/useAuthStore";

interface CountdownTimerProps {
  showtimeId: string;
  movieId: string;
  onExpire: () => void;
}

export function CountdownTimer({
  showtimeId,
  movieId,
  onExpire,
}: CountdownTimerProps) {
  const { expiresAt, startTimer, clearTimer } = useTimerStore();
  const [remainingSeconds, setRemainingSeconds] = useState<number>(300);
  const router = useRouter();

  // Start timer only once per showtime session
  useEffect(() => {
    const storedShowtime = useTimerStore.getState().showtimeId;
    if (!expiresAt || storedShowtime !== showtimeId) {
      startTimer(showtimeId, 300);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showtimeId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentExpiry = useTimerStore.getState().expiresAt;
      if (!currentExpiry) return;

      const remaining = Math.max(
        0,
        Math.floor((currentExpiry - Date.now()) / 1000)
      );
      setRemainingSeconds(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        clearTimer();
        onExpire();
        router.push(`/movies/${movieId}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [clearTimer, movieId, onExpire, router]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const isWarning = remainingSeconds < 60;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono transition-all duration-300 ${
        isWarning
          ? "bg-red-950/60 border-red-800 text-red-400 animate-pulse-red"
          : "bg-[#1e1e2e] border-[#2a2a3e] text-[#f1f1f8]"
      }`}
    >
      {isWarning ? (
        <AlertTriangle size={16} className="shrink-0" />
      ) : (
        <Timer size={16} className="shrink-0 text-[#a0a0b8]" />
      )}
      <div>
        <p className="text-xs text-[#6b6b88] uppercase tracking-wider leading-none mb-0.5">
          Time remaining
        </p>
        <p className={`text-lg font-bold leading-none ${isWarning ? "text-red-400" : "text-[#f1f1f8]"}`}>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}
