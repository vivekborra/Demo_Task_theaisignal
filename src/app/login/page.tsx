"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import {
  Briefcase,
  AlertCircle,
  Sparkles,
  User,
  Building,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Zap,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filledRole, setFilledRole] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const loginWithCredentials = async (loginEmail: string, loginPass: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to sign in");
        setLoading(false);
        return;
      }

      // Route to destination
      if (returnUrl) {
        router.push(returnUrl);
      } else if (data.user.role === "RECRUITER") {
        router.push("/recruiter");
      } else {
        router.push("/student/applications");
      }
      router.refresh();
    } catch (err) {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginWithCredentials(email, password);
  };

  const quickDemoLogin = async (role: "STUDENT" | "RECRUITER") => {
    const demoEmail = role === "STUDENT" ? "student@demo.com" : "recruiter@demo.com";
    const demoPass = "password123";
    setEmail(demoEmail);
    setPassword(demoPass);
    setFilledRole(role === "STUDENT" ? "student" : "recruiter");
    await loginWithCredentials(demoEmail, demoPass);
  };

  return (
    <div
      className="max-w-md w-full space-y-7 p-8 sm:p-10 rounded-3xl"
      style={{
        background: "rgba(15,23,42,0.85)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 0 0 1px rgba(99,102,241,0.1), 0 40px 80px -20px rgba(0,0,0,0.5)",
      }}
    >
      {/* Brand & Header */}
      <div className="text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-all">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white">
            Intern<span className="text-gradient-primary">Hub</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Welcome back
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Sign in to track applications or manage your internship listings.
        </p>
      </div>

      {/* If already logged in notice */}
      {currentUser && (
        <div
          className="p-3.5 rounded-2xl text-xs text-blue-300 flex items-center justify-between gap-3"
          style={{
            background: "rgba(59,130,246,0.12)",
            border: "1px solid rgba(59,130,246,0.3)",
          }}
        >
          <div className="truncate">
            Signed in as <strong className="text-white">{currentUser.name}</strong> ({currentUser.role})
          </div>
          <Link
            href={currentUser.role === "RECRUITER" ? "/recruiter" : "/internships"}
            className="text-xs font-bold text-blue-400 hover:text-blue-200 underline whitespace-nowrap"
          >
            Go to App →
          </Link>
        </div>
      )}

      {/* Quick Demo Credentials 1-Click Login */}
      <div
        className="p-4 rounded-2xl space-y-3"
        style={{
          background: "rgba(30,41,59,0.7)",
          border: "1px solid rgba(99,102,241,0.25)",
        }}
      >
        <div className="flex items-center justify-between text-xs font-bold text-blue-300">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Instant 1-Click Demo Login</span>
          </div>
          <span className="text-[10px] text-slate-400 font-normal">Click to sign in instantly</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => quickDemoLogin("STUDENT")}
            className="py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 bg-blue-600/20 border-blue-500/40 text-blue-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            Demo Student
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => quickDemoLogin("RECRUITER")}
            className="py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 bg-indigo-600/20 border-indigo-500/40 text-indigo-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 cursor-pointer"
          >
            <Building className="w-3.5 h-3.5" />
            Demo Recruiter
          </button>
        </div>
      </div>

      {error && (
        <div
          className="p-3.5 rounded-xl text-xs text-rose-300 flex items-center gap-2.5 animate-in fade-in"
          style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)" }}
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="student@demo.com or recruiter@demo.com"
          leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
        />

        <Input
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Signing in...
            </span>
          ) : (
            <>
              <span>Sign In to InternHub</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2 text-xs text-slate-400">
        Don't have an account yet?{" "}
        <Link
          href="/register"
          className="font-bold text-blue-400 hover:text-blue-300 underline-offset-2 hover:underline"
        >
          Create account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div
      className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: "transparent" }}
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-violet-500/8 blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 w-full flex justify-center">
        <Suspense
          fallback={
            <div
              className="w-full max-w-md h-96 rounded-3xl animate-pulse"
              style={{ background: "rgba(17,24,39,0.8)" }}
            />
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
