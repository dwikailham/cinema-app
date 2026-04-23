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
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-[#0a0a0f]">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-16 h-16 bg-[#e63946] rounded-2xl flex items-center justify-center shadow-lg shadow-[#e63946]/20 mb-2">
            <Film size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#f1f1f8]">
            Welcome Back
          </h1>
          <p className="text-[#a0a0b8]">
            Sign in to your CineBook account to start booking
          </p>
        </div>

        <Card className="border-[#2a2a3e] bg-[#12121c]/50 backdrop-blur-sm">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle className="text-xl">Login</CardTitle>
              <CardDescription>
                Enter your credentials to access the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            <CardFooter>
              <Button
                type="submit"
                className="w-full h-11"
                isLoading={isLoading}
              >
                Sign In
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
