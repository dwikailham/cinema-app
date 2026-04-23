"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Film, Lock, User as UserIcon, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.data);
        router.push("/movies");
      } else {
        setError(data.error || "Invalid username or password");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16 md:py-24 bg-[#0a0a0f]">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#e63946]/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-[#e63946] to-[#ff6b6b] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#e63946]/30 mb-2">
            <Film size={36} className="text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#f1f1f8]">
              Welcome Back
            </h1>
            <p className="text-base text-[#a0a0b8] leading-relaxed">
              Sign in to your CineBook account to start booking your favourite movies.
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-[#2a2a3e] bg-[#12121c]/70 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                Enter your credentials below to access your account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error Banner */}
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">{error}</p>
                </div>
              )}

              {/* Username */}
              <Input
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                icon={<UserIcon size={20} />}
                required
                autoComplete="username"
              />

              {/* Password */}
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={20} />}
                required
                autoComplete="current-password"
              />
            </CardContent>

            <CardFooter className="flex-col gap-4">
              <Button
                type="submit"
                className="w-full h-14 text-base font-bold"
                isLoading={isLoading}
              >
                Sign In to CineBook
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
