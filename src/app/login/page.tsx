"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Briefcase, AlertCircle, Sparkles, User, Building } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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

  const fillDemo = (role: "STUDENT" | "RECRUITER") => {
    if (role === "STUDENT") {
      setEmail("student@demo.com");
      setPassword("password123");
    } else {
      setEmail("recruiter@demo.com");
      setPassword("password123");
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
      <div className="text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Intern<span className="text-blue-600">Hub</span>
          </span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Sign in to your account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Welcome back! Select a role or use quick-fill demo credentials below.
        </p>
      </div>

      {/* Quick Demo Credentials Autofill */}
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Instant Demo Accounts (Click to Fill)</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillDemo("STUDENT")}
            className="py-1.5 px-2.5 bg-white rounded-lg border border-blue-200 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <User className="w-3.5 h-3.5 text-blue-600" />
            Demo Student
          </button>
          <button
            type="button"
            onClick={() => fillDemo("RECRUITER")}
            className="py-1.5 px-2.5 bg-white rounded-lg border border-blue-200 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <Building className="w-3.5 h-3.5 text-blue-600" />
            Demo Recruiter
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
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
          placeholder="you@university.edu or you@company.com"
        />

        <Input
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <Button type="submit" size="md" isLoading={loading} className="w-full">
          Sign In
        </Button>
      </form>

      <div className="text-center pt-2 text-xs text-slate-500">
        Don't have an account yet?{" "}
        <Link
          href="/register"
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Create account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <Suspense fallback={<div className="w-full max-w-md h-96 bg-white rounded-2xl animate-pulse" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
