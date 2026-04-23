"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import type { User } from "@/types";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isHydrated, setUser } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      // Try to restore from cookie session
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data: { success: boolean; data?: User }) => {
          if (data.success && data.data) {
            setUser(data.data);
          } else {
            router.replace("/login");
          }
        })
        .catch(() => router.replace("/login"));
    }
  }, [isAuthenticated, isHydrated, router, setUser]);

  if (!isHydrated || !isAuthenticated) {
    return <PageLoader />;
  }

  return <>{children}</>;
}
