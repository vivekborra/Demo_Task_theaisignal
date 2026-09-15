"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  FileText,
  PlusCircle,
  Building,
  LayoutDashboard,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "RECRUITER";
  company?: { name: string } | null;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const isCurrent = (path: string, exact = false) => {
    if (exact) return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/[0.07] shadow-lg shadow-black/20"
          : "border-b border-transparent"
      }`}
      style={{
        background: scrolled
          ? "rgba(10,15,30,0.88)"
          : "rgba(10,15,30,0.60)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 group-hover:scale-105 transition-all duration-300">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white leading-none">
                  Intern<span className="text-gradient-primary">Hub</span>
                </span>
                <span className="text-[10px] font-medium text-slate-400 tracking-wide mt-0.5">
                  Top Tier Internships
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link
                href="/internships"
                className={`px-3.5 py-2 rounded-lg transition-all duration-200 ${
                  isCurrent("/internships") && !isCurrent("/recruiter")
                    ? "bg-blue-500/15 text-blue-300 font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                Find Internships
              </Link>

              {user?.role === "STUDENT" && (
                <>
                  <Link
                    href="/student/applications"
                    className={`px-3.5 py-2 rounded-lg transition-all duration-200 ${
                      isCurrent("/student/applications")
                        ? "bg-blue-500/15 text-blue-300 font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    My Applications
                  </Link>
                  <Link
                    href="/student/profile"
                    className={`px-3.5 py-2 rounded-lg transition-all duration-200 ${
                      isCurrent("/student/profile")
                        ? "bg-blue-500/15 text-blue-300 font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    Student Profile
                  </Link>
                </>
              )}

              {user?.role === "RECRUITER" && (
                <>
                  <Link
                    href="/recruiter"
                    className={`px-3.5 py-2 rounded-lg transition-all duration-200 ${
                      isCurrent("/recruiter", true)
                        ? "bg-violet-500/15 text-violet-300 font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/recruiter/internships"
                    className={`px-3.5 py-2 rounded-lg transition-all duration-200 ${
                      isCurrent("/recruiter/internships") &&
                      !isCurrent("/recruiter/internships/new")
                        ? "bg-violet-500/15 text-violet-300 font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    Manage Postings
                  </Link>
                  <Link
                    href="/recruiter/company"
                    className={`px-3.5 py-2 rounded-lg transition-all duration-200 ${
                      isCurrent("/recruiter/company")
                        ? "bg-violet-500/15 text-violet-300 font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    Company
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-28 h-9 bg-white/[0.06] rounded-xl animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                {user.role === "RECRUITER" && (
                  <Link href="/recruiter/internships/new">
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                      <PlusCircle className="w-4 h-4" />
                      Post Internship
                    </button>
                  </Link>
                )}

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.06] hover:bg-white/[0.1] hover:border-white/[0.18] transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-slate-200 max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full ${
                        user.role === "RECRUITER"
                          ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                          : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      }`}
                    >
                      {user.role}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2.5 w-60 rounded-2xl shadow-2xl shadow-black/40 border border-white/[0.1] py-2 z-50 text-sm animate-in fade-in zoom-in-95 duration-150"
                      style={{ background: "rgba(15,23,42,0.95)", backdropFilter: "blur(24px)" }}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="px-4 py-2.5 border-b border-white/[0.07]">
                        <p className="font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                        {user.company && (
                          <div className="flex items-center gap-1.5 mt-2 px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
                            <Building className="w-3 h-3" />
                            <span className="truncate">{user.company.name}</span>
                          </div>
                        )}
                      </div>

                      <div className="py-1">
                        {user.role === "STUDENT" ? (
                          <>
                            <Link
                              href="/student/profile"
                              className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:bg-white/[0.06] hover:text-blue-400 transition-colors"
                            >
                              <UserIcon className="w-4 h-4 text-slate-500" />
                              Student Profile
                            </Link>
                            <Link
                              href="/student/applications"
                              className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:bg-white/[0.06] hover:text-blue-400 transition-colors"
                            >
                              <FileText className="w-4 h-4 text-slate-500" />
                              My Applications
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              href="/recruiter"
                              className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:bg-white/[0.06] hover:text-violet-400 transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4 text-slate-500" />
                              Dashboard
                            </Link>
                            <Link
                              href="/recruiter/internships"
                              className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:bg-white/[0.06] hover:text-violet-400 transition-colors"
                            >
                              <Briefcase className="w-4 h-4 text-slate-500" />
                              Manage Internships
                            </Link>
                            <Link
                              href="/recruiter/company"
                              className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:bg-white/[0.06] hover:text-violet-400 transition-colors"
                            >
                              <Building className="w-4 h-4 text-slate-500" />
                              Company Profile
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="border-t border-white/[0.07] my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-400 hover:bg-rose-500/10 transition-colors text-left font-medium text-xs"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link href="/login">
                  <button className="px-3 py-1.5 rounded-xl text-xs font-bold text-blue-300 bg-blue-500/15 border border-blue-500/30 hover:bg-blue-500/25 hover:border-blue-500/50 hover:text-white transition-all flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    Demo Accounts
                  </button>
                </Link>
                <Link href="/login">
                  <button className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all">
                    Sign In
                  </button>
                </Link>
                <Link href="/register">
                  <button className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-b border-white/[0.07] px-4 pt-3 pb-6 space-y-1"
          style={{ background: "rgba(10,15,30,0.97)", backdropFilter: "blur(24px)" }}
        >
          <Link
            href="/internships"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06]"
          >
            Find Internships
          </Link>

          {user?.role === "STUDENT" && (
            <>
              <Link
                href="/student/applications"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.06]"
              >
                My Applications
              </Link>
              <Link
                href="/student/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.06]"
              >
                Student Profile
              </Link>
            </>
          )}

          {user?.role === "RECRUITER" && (
            <>
              <Link
                href="/recruiter"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.06]"
              >
                Dashboard
              </Link>
              <Link
                href="/recruiter/internships"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.06]"
              >
                Manage Postings
              </Link>
              <Link
                href="/recruiter/internships/new"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-xl text-sm font-semibold text-blue-400 hover:bg-blue-500/10"
              >
                + Post New Internship
              </Link>
              <Link
                href="/recruiter/company"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.06]"
              >
                Company Profile
              </Link>
            </>
          )}

          <div className="pt-4 border-t border-white/[0.07] flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-rose-400 border border-rose-500/20 hover:bg-rose-500/10 flex items-center justify-center gap-2 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out ({user.name})
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <button className="w-full py-2.5 rounded-xl text-xs font-bold text-blue-300 bg-blue-500/15 border border-blue-500/30 flex items-center justify-center gap-2 transition-all">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    1-Click Demo Accounts
                  </button>
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <button className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-300 border border-white/[0.12] hover:bg-white/[0.06] transition-all">
                    Sign In
                  </button>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <button className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                    Create Free Account
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
