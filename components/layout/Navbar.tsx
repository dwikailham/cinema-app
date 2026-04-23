"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Film, LogOut, Ticket, User } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const router = useRouter();
  const { user, clearUser } = useAuthStore();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    clearUser();
    router.push("/login");
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/movies"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#e63946] to-[#ff6b6b] rounded-[14px] flex items-center justify-center group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-[#e63946]/20">
              <Film size={20} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[#f1f1f8] font-black text-xl tracking-tight hidden sm:block">
                CINEBOOK
              </span>
              <span className="text-xs text-[#e63946] font-bold uppercase tracking-widest hidden sm:block">
                Premium
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center bg-[#12121c]/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md overflow-x-auto no-scrollbar max-w-full">
            <Link
              href="/movies"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider text-[#a0a0b8] hover:text-[#f1f1f8] hover:bg-[#1e1e2e] transition-all whitespace-nowrap"
            >
              <Film size={16} />
              <span>Movies</span>
            </Link>
            <Link
              href="/bookings"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider text-[#a0a0b8] hover:text-[#f1f1f8] hover:bg-[#1e1e2e] transition-all whitespace-nowrap"
            >
              <Ticket size={16} />
              <span>Wallet</span>
            </Link>
          </div>

          {/* User & Logout */}
          <div className="flex items-center gap-4 shrink-0">
            {user && (
              <div className="hidden lg:flex items-center gap-3 pr-4 border-r border-white/5">
                <div className="text-right">
                  <p className="text-xs text-[#6b6b88] font-bold uppercase tracking-widest">Active Member</p>
                  <p className="text-sm text-[#f1f1f8] font-black">{user.name}</p>
                </div>
                <div className="w-10 h-10 bg-[#1e1e2e] rounded-full border border-white/10 flex items-center justify-center p-0.5">
                   <div className="w-full h-full bg-gradient-to-tr from-[#e63946] to-blue-500 rounded-full flex items-center justify-center text-sm font-black text-white">
                      {user.name.charAt(0)}
                   </div>
                </div>
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="w-10 h-10 flex items-center justify-center text-[#a0a0b8] hover:text-[#e63946] hover:bg-[#e63946]/5 rounded-full transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
