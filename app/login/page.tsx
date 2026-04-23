"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Film, Lock, User as UserIcon } from "lucide-react";
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
    <div className="flex-1 flex items-center justify-center px-6 py-12 md:py-24 bg-[#0a0a0f]">
      <div className="w-full max-w-[480px] space-y-12 md:space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-20 h-20 bg-[#e63946] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#e63946]/30 mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Film size={40} className="text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-[#f1f1f8] leading-none mb-4">
            Welcome Back
          </h1>
          <p className="text-[#a0a0b8] text-lg font-medium">
            Step into the world of premium cinema.
          </p>
        </div>

        <Card className="border-[#2a2a3e] bg-[#12121c]/50 backdrop-blur-xl shadow-2xl overflow-hidden rounded-[2.5rem]">
          <form onSubmit={handleLogin}>
            <CardHeader className="p-10 md:p-12 pb-6">
              <CardTitle className="text-2xl font-black tracking-tight">Login Access</CardTitle>
              <CardDescription className="text-base text-[#6b6b88]">
                Please authorize to continue to the cinema vault.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10 md:p-12 pt-0 space-y-8">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Input
                  label="Username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  icon={<UserIcon size={18} />}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock size={18} />}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="p-10 md:p-12 pt-0">
              <Button
                type="submit"
                className="w-full h-14 text-lg font-black tracking-wider uppercase rounded-2xl shadow-xl shadow-[#e63946]/20"
                isLoading={isLoading}
              >
                Enter Theatre
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-sm text-[#a0a0b8]">
          Demo credentials available in users.json
        </p>
      </div>
    </div>
  );
}
