"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import {
  Briefcase,
  AlertCircle,
  User,
  Building,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  CheckCircle2,
} from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole =
    searchParams.get("role") === "RECRUITER" ? "RECRUITER" : "STUDENT";

  const [role, setRole] = useState<"STUDENT" | "RECRUITER">(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: any = {
        name,
        email,
        password,
        role,
      };

      if (role === "RECRUITER") {
        if (!companyName.trim()) {
          setError("Company name is required for recruiter registration");
          setLoading(false);
          return;
        }
        payload.companyName = companyName.trim();
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account");
        setLoading(false);
        return;
      }

      if (role === "RECRUITER") {
        router.push("/recruiter");
      } else {
        router.push("/student/profile");
      }
      router.refresh();
    } catch (err) {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="max-w-md w-full space-y-6 p-8 sm:p-10 rounded-3xl"
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
          Create your account
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Join thousands of students and verified recruiters today.
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
            Dashboard →
          </Link>
        </div>
      )}

      {/* Role Toggle Selector */}
      <div
        className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl"
        style={{ background: "rgba(30,41,59,0.7)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <button
          type="button"
          onClick={() => setRole("STUDENT")}
          className={`py-2.5 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ${
            role === "STUDENT"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <User className="w-4 h-4" />
          I'm a Student
        </button>
        <button
          type="button"
          onClick={() => setRole("RECRUITER")}
          className={`py-2.5 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ${
            role === "RECRUITER"
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Building className="w-4 h-4" />
          I'm a Recruiter
        </button>
      </div>

      {/* Demo helper banner */}
      <div
        className="p-3.5 rounded-2xl flex items-center justify-between text-xs"
        style={{ background: "rgba(30,41,59,0.5)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2 text-slate-300">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Just exploring? Use demo accounts:</span>
        </div>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="font-bold text-blue-400 hover:text-blue-300 underline whitespace-nowrap bg-transparent border-0 p-0 cursor-pointer"
          aria-label="Open demo login"
        >
          1-Click Demo →
        </button>
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
          label={role === "STUDENT" ? "Full Name" : "Recruiter Name"}
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={role === "STUDENT" ? "Aarav Sharma" : "Sarah Jenkins"}
          leftIcon={<User className="w-4 h-4 text-slate-400" />}
        />

        {role === "RECRUITER" && (
          <Input
            label="Company Name"
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Razorpay, Swiggy, CRED, etc."
            leftIcon={<Building className="w-4 h-4 text-slate-400" />}
            helperText="Your company name as it will appear to candidates"
          />
        )}

        <Input
          label="Email Address"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={
            role === "STUDENT" ? "aarav@iitb.ac.in" : "recruiter@company.com"
          }
          leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
        />

        <Input
          label="Create Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          helperText="Must be minimum 6 characters long"
          leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            <>
              <span>Get Started as {role === "STUDENT" ? "Student" : "Recruiter"}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-1 text-xs text-slate-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-blue-400 hover:text-blue-300 underline-offset-2 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div
      className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: "transparent" }}
    >
      {/* Decorative ambient background blurs */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-blue-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />
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
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
