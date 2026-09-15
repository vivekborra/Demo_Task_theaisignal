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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Intern<span className="text-blue-600">Hub</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                href="/internships"
                className={`transition-colors hover:text-blue-600 ${
                  pathname.startsWith("/internships")
                    ? "text-blue-600 font-semibold"
                    : "text-slate-600"
                }`}
              >
                Find Internships
              </Link>

              {user?.role === "STUDENT" && (
                <>
                  <Link
                    href="/student/applications"
                    className={`transition-colors hover:text-blue-600 ${
                      pathname.startsWith("/student/applications")
                        ? "text-blue-600 font-semibold"
                        : "text-slate-600"
                    }`}
                  >
                    My Applications
                  </Link>
                  <Link
                    href="/student/profile"
                    className={`transition-colors hover:text-blue-600 ${
                      pathname.startsWith("/student/profile")
                        ? "text-blue-600 font-semibold"
                        : "text-slate-600"
                    }`}
                  >
                    Profile
                  </Link>
                </>
              )}

              {user?.role === "RECRUITER" && (
                <>
                  <Link
                    href="/recruiter"
                    className={`transition-colors hover:text-blue-600 ${
                      pathname === "/recruiter"
                        ? "text-blue-600 font-semibold"
                        : "text-slate-600"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/recruiter/internships"
                    className={`transition-colors hover:text-blue-600 ${
                      pathname.startsWith("/recruiter/internships") &&
                      pathname !== "/recruiter/internships/new"
                        ? "text-blue-600 font-semibold"
                        : "text-slate-600"
                    }`}
                  >
                    Postings
                  </Link>
                  <Link
                    href="/recruiter/company"
                    className={`transition-colors hover:text-blue-600 ${
                      pathname.startsWith("/recruiter/company")
                        ? "text-blue-600 font-semibold"
                        : "text-slate-600"
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
              <div className="w-24 h-9 bg-slate-100 rounded-lg animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                {user.role === "RECRUITER" && (
                  <Link href="/recruiter/internships/new">
                    <Button size="sm" className="gap-1.5 shadow-sm">
                      <PlusCircle className="w-4 h-4" />
                      Post Internship
                    </Button>
                  </Link>
                )}

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-slate-700 max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200/60">
                      {user.role}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-sm animate-in fade-in zoom-in-95 duration-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="font-medium text-slate-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {user.email}
                        </p>
                        {user.company && (
                          <p className="text-xs font-medium text-blue-600 truncate mt-0.5">
                            {user.company.name}
                          </p>
                        )}
                      </div>

                      {user.role === "STUDENT" ? (
                        <>
                          <Link
                            href="/student/profile"
                            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <UserIcon className="w-4 h-4 text-slate-400" />
                            Student Profile
                          </Link>
                          <Link
                            href="/student/applications"
                            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <FileText className="w-4 h-4 text-slate-400" />
                            My Applications
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/recruiter"
                            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-slate-400" />
                            Dashboard
                          </Link>
                          <Link
                            href="/recruiter/internships"
                            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Briefcase className="w-4 h-4 text-slate-400" />
                            Manage Internships
                          </Link>
                          <Link
                            href="/recruiter/company"
                            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Building className="w-4 h-4 text-slate-400" />
                            Company Profile
                          </Link>
                        </>
                      )}

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
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
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/internships"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            Find Internships
          </Link>

          {user?.role === "STUDENT" && (
            <>
              <Link
                href="/student/applications"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
              >
                My Applications
              </Link>
              <Link
                href="/student/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
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
                className="block py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
              >
                Dashboard
              </Link>
              <Link
                href="/recruiter/internships"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
              >
                Manage Postings
              </Link>
              <Link
                href="/recruiter/internships/new"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-blue-600"
              >
                + Post New Internship
              </Link>
              <Link
                href="/recruiter/company"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
              >
                Company Profile
              </Link>
            </>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-rose-600 hover:bg-rose-50 justify-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out ({user.name})
              </Button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button size="sm" className="w-full">
                    Create Account
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
