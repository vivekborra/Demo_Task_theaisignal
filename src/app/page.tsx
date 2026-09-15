import React from "react";
import Link from "next/link";
import {
  Briefcase,
  Search,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  Building,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { InternshipCard } from "@/components/internships/InternshipCard";
import { prisma } from "@/lib/prisma";

export const revalidate = 0; // Dynamic data for live freshness

async function getFeaturedInternships() {
  try {
    const internships = await prisma.internship.findMany({
      where: {
        status: "PUBLISHED",
        deadline: { gt: new Date() },
      },
      orderBy: { stipend: "desc" },
      take: 6,
      include: {
        company: true,
        _count: {
          select: { applications: true },
        },
      },
    });
    return internships;
  } catch (error) {
    console.error("Error fetching featured internships:", error);
    return [];
  }
}

export default async function HomePage() {
  const featuredInternships = await getFeaturedInternships();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50 to-white pt-20 pb-24 lg:pt-28 lg:pb-32 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-semibold mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Over 1,000+ verified tech internships added for 2025</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Find the internship that{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              moves your career forward.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover verified roles at high-growth engineering teams, startups,
            and innovators. Real mentorship, transparent stipends, and an
            anti-ghosting application process.
          </p>

          {/* Hero Search Box */}
          <div className="mt-10 max-w-2xl mx-auto">
            <form
              action="/internships"
              method="GET"
              className="relative flex items-center bg-white rounded-2xl shadow-lg border border-slate-200/80 p-2 sm:p-2.5 transition-all focus-within:ring-2 focus-within:ring-blue-500"
            >
              <div className="flex items-center pl-3 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="q"
                placeholder="Search by role, company, or tech stack (e.g. React, Python)..."
                className="w-full px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
              <Button type="submit" size="md" className="shrink-0 rounded-xl px-5">
                Explore Roles
              </Button>
            </form>

            {/* Popular search tags */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-400">Trending tags:</span>
              <Link
                href="/internships?workMode=REMOTE"
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-xs"
              >
                🌐 Remote
              </Link>
              <Link
                href="/internships?q=frontend"
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-xs"
              >
                Frontend React
              </Link>
              <Link
                href="/internships?q=AI%2FML"
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-xs"
              >
                AI & Deep Learning
              </Link>
              <Link
                href="/internships?q=cloud"
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-xs"
              >
                Cloud & DevOps
              </Link>
              <Link
                href="/internships?q=design"
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-xs"
              >
                UI/UX Design
              </Link>
            </div>
          </div>

          {/* Quick CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/internships">
              <Button size="lg" className="rounded-xl px-6 shadow-md shadow-blue-600/10">
                Browse All Internships
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/register?role=RECRUITER">
              <Button variant="outline" size="lg" className="rounded-xl px-6">
                Post an Internship (Hiring)
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Internships Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hand-picked Openings</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Featured Tech Internships
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Top competitive roles actively interviewing students right now.
              </p>
            </div>
            <Link href="/internships">
              <Button variant="outline" size="sm" className="gap-1 text-slate-700">
                View All Postings
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredInternships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} />
            ))}
          </div>
        </div>
      </section>

      {/* Why InternHub Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              Why InternHub
            </h2>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
              Engineered to replace chaotic job boards
            </h3>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              We eliminated ghost job postings, vague stipend promises, and
              endless waiting with a direct pipeline between verified recruiters
              and aspiring engineers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                100% Verified Companies
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every employer is screened to ensure genuine learning
                opportunities, dedicated engineering mentorship, and safe working
                environments.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                Transparent Compensation
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                No hidden surprises or unpaid labor disguising as work. Upfront
                monthly stipends and duration details are published on every single
                listing.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                Anti-Ghosting Status Tracker
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track your application through every phase in real time: Applied,
                Shortlisted, Interview, and Offer, so you never have to wonder where
                you stand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Two-Sided Workflow */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* For Students */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">
                <GraduationCap className="w-4 h-4" />
                <span>For Students & Recent Grads</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Land your dream tech internship in 3 simple steps
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-900">
                      Build your profile once
                    </h5>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Highlight your GitHub, projects, coursework, and technical skills.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-900">
                      Apply in one click
                    </h5>
                    <p className="text-xs text-slate-600 mt-0.5">
                      No redundant repetitive forms. Submit clean, targeted applications with optional tailored notes.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-900">
                      Track pipeline progress live
                    </h5>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Watch your status update live as recruiters review, shortlist, and invite you to interviews.
                    </p>
                  </div>
                </li>
              </ul>
              <Link href="/register?role=STUDENT">
                <Button size="md" className="rounded-xl mt-2">
                  Create Student Account
                </Button>
              </Link>
            </div>

            {/* For Employers */}
            <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl space-y-6 shadow-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800 text-blue-400 text-xs font-semibold">
                <Building className="w-4 h-4" />
                <span>For Recruiters & Founders</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Hire world-class emerging tech talent faster
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Connect with thousands of motivated CS, Engineering, Data Science, and Design students actively seeking internships.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Post unlimited verified internship opportunities</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Review student portfolios, GitHubs, and verified resumes</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Manage applicant statuses with seamless one-click updates</span>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/register?role=RECRUITER">
                  <Button
                    size="md"
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl"
                  >
                    Start Hiring Interns
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
