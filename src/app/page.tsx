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
  Code2,
  Cpu,
  Database,
  Cloud,
  Palette,
  Compass,
  ChevronRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { InternshipCard } from "@/components/internships/InternshipCard";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

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

  const domainCategories = [
    {
      name: "Software Engineering",
      icon: Code2,
      count: "420+ roles",
      gradient: "from-blue-500 to-cyan-500",
      query: "Software",
    },
    {
      name: "AI & Machine Learning",
      icon: Cpu,
      count: "210+ roles",
      gradient: "from-purple-500 to-indigo-500",
      query: "AI",
    },
    {
      name: "Data Science & Analytics",
      icon: Database,
      count: "180+ roles",
      gradient: "from-emerald-500 to-teal-500",
      query: "Data",
    },
    {
      name: "Cloud & DevOps",
      icon: Cloud,
      count: "140+ roles",
      gradient: "from-sky-500 to-blue-500",
      query: "Cloud",
    },
    {
      name: "UI/UX & Product Design",
      icon: Palette,
      count: "115+ roles",
      gradient: "from-pink-500 to-rose-500",
      query: "Design",
    },
    {
      name: "Product & Strategy",
      icon: Compass,
      count: "95+ roles",
      gradient: "from-amber-500 to-orange-500",
      query: "Product",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "transparent" }}>
      {/* ─── Hero Section ─────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-28 lg:pt-28 lg:pb-36">
        {/* Radial ambient orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-br from-blue-600/20 via-indigo-600/15 to-violet-600/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute top-1/2 -translate-y-1/2 -right-40 w-[500px] h-[500px] bg-cyan-500/8 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-violet-600/8 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Live pulsing Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 pill-blue shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-shadow">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>1,200+ Verified Indian Tech Internships — Summer 2025</span>
            <span className="hidden sm:inline text-blue-400/60">•</span>
            <span className="hidden sm:inline text-blue-300 font-bold">Guaranteed Response</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-5xl mx-auto leading-[1.08] sm:leading-[1.1]">
            Find the tech internship that{" "}
            <span className="text-gradient-primary">
              accelerates your career.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Direct access to high-growth Indian engineering teams, vetted startups, and innovators.
            Verified compensation, real mentorship, and an anti-ghosting pipeline.
          </p>

          {/* Hero Search Box */}
          <div className="mt-10 max-w-3xl mx-auto">
            <form
              action="/internships"
              method="GET"
              className="relative flex flex-col sm:flex-row items-stretch rounded-2xl p-2 sm:p-2.5 gap-2 transition-all"
              style={{
                background: "rgba(17,24,39,0.85)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 40px -8px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)",
              }}
            >
              <div className="flex items-center flex-1 px-3 text-slate-400">
                <Search className="w-5 h-5 text-blue-400 shrink-0" />
                <input
                  type="text"
                  name="q"
                  placeholder="Role, skills, or company (e.g. React, Python, Cloud, AI)..."
                  className="w-full px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none bg-transparent"
                />
              </div>

              <div className="h-px sm:h-8 sm:w-px bg-white/[0.08] my-auto hidden sm:block" />

              <div className="flex items-center sm:w-44 px-2">
                <select
                  name="workMode"
                  className="w-full text-xs font-semibold text-slate-300 bg-transparent focus:outline-none py-2 cursor-pointer"
                  defaultValue=""
                >
                  <option value="" style={{ background: "#111827" }}>All Locations</option>
                  <option value="REMOTE" style={{ background: "#111827" }}>🌐 Remote Only</option>
                  <option value="HYBRID" style={{ background: "#111827" }}>🏢 Hybrid</option>
                  <option value="ONSITE" style={{ background: "#111827" }}>📍 On-site</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Find Roles</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Popular search tags */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-600">Popular Hubs:</span>
              {[
                { label: "🇮🇳 Bengaluru", href: "/internships?location=Bengaluru" },
                { label: "🌐 Remote", href: "/internships?workMode=REMOTE" },
                { label: "📍 Delhi NCR", href: "/internships?location=Gurugram" },
                { label: "⚡ Full Stack", href: "/internships?q=Full+Stack" },
                { label: "🤖 AI & GenAI", href: "/internships?q=AI" },
                { label: "💰 ₹50,000+/mo", href: "/internships?minStipend=50000" },
              ].map((tag) => (
                <Link
                  key={tag.href}
                  href={tag.href}
                  className="px-3 py-1 rounded-full font-medium text-slate-500 bg-slate-800/70 border border-white/[0.08] hover:bg-blue-500/12 hover:border-blue-500/35 hover:text-blue-300 transition-all"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Trust Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { value: "1,250+", label: "Active Openings", color: "text-white" },
              { value: "₹65,000", label: "Avg. Indian Tech Stipend", color: "text-emerald-400" },
              { value: "98.4%", label: "Response Rate", color: "text-indigo-400" },
              { value: "< 48 hrs", label: "Avg. Review Time", color: "text-blue-400" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-5 text-center transition-all hover:-translate-y-0.5"
                style={{
                  background: "rgba(17,24,39,0.70)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(16px)",
                }}
              >
                <p className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Hiring Companies Banner ─────── */}
      <section className="py-10" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,15,30,0.6)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600 mb-6">
            Leading engineering teams hiring interns on InternHub
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {[
              { initial: "R", name: "Razorpay", color: "bg-blue-600" },
              { initial: "S", name: "Swiggy", color: "bg-orange-500" },
              { initial: "C", name: "CRED", color: "bg-slate-700" },
              { initial: "S", name: "Sarvam AI", color: "bg-violet-600" },
              { initial: "Z", name: "Zomato", color: "bg-rose-600" },
              { initial: "Z", name: "Zepto", color: "bg-purple-600" },
              { initial: "N", name: "NexusCloud", color: "bg-indigo-600" },
            ].map((company) => (
              <div
                key={company.name}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all hover:scale-[1.03]"
                style={{
                  background: "rgba(17,24,39,0.75)",
                  border: "1px solid rgba(255,255,255,0.09)",
                }}
              >
                <div className={`w-6 h-6 rounded-md ${company.color} text-white flex items-center justify-center font-bold text-xs`}>
                  {company.initial}
                </div>
                <span className="font-bold text-slate-200 text-sm tracking-tight">{company.name}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Explore by Domain ────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full pill-violet text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>High-Impact Specializations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore by Tech Domain
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              Filter curated opportunities mapped to your specific skill set and career goals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {domainCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  href={`/internships?q=${encodeURIComponent(category.query)}`}
                  className="group relative p-6 rounded-2xl flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(59,130,246,0.15)] bg-[rgba(17,24,39,0.75)] border border-white/[0.07] hover:border-indigo-500/40"
                  style={{ backdropFilter: "blur(16px)" }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${category.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-blue-300 transition-colors text-base">
                        {category.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        {category.count}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Featured Internships Grid ─────────────── */}
      <section className="py-20" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,15,30,0.5)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Actively Interviewing</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Featured Tech Opportunities
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                High-stipend openings from vetted tech companies accepting applications today.
              </p>
            </div>
            <Link href="/internships">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 border border-white/[0.1] hover:border-blue-500/40 hover:text-blue-300 transition-all" style={{ background: "rgba(17,24,39,0.7)" }}>
                View All 1,200+ Postings
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredInternships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/internships">
              <button className="px-8 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center gap-2">
                <span>Browse Full Marketplace with Filters</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Why InternHub ─────────────────────────── */}
      <section className="py-20" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">
              The InternHub Standard
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered to replace chaotic job boards
            </h3>
            <p className="text-slate-500 text-sm sm:text-base mt-3 leading-relaxed">
              We eliminated ghost job postings, vague stipend promises, and endless waiting with a direct pipeline between verified recruiters and aspiring engineers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "100% Verified Employers",
                desc: "Every employer is screened to ensure legitimate learning opportunities, dedicated engineering mentorship, and safe working environments.",
                iconBg: "from-blue-500 to-cyan-500",
              },
              {
                icon: TrendingUp,
                title: "Transparent Compensation",
                desc: "No hidden surprises or unpaid labor disguising as work. Upfront monthly stipends and duration details are published on every single listing.",
                iconBg: "from-emerald-500 to-teal-500",
              },
              {
                icon: Clock,
                title: "Anti-Ghosting Status Tracker",
                desc: "Track your application through every phase in real time: Applied, Shortlisted, Interview, and Offer, so you always know where you stand.",
                iconBg: "from-violet-500 to-purple-500",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-8 rounded-2xl transition-all hover:-translate-y-1 duration-300"
                  style={{
                    background: "rgba(17,24,39,0.75)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    backdropFilter: "blur(16px)",
                  }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feature.iconBg} flex items-center justify-center text-white mb-6 shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Two-Sided Workflow ─────────────────────── */}
      <section className="py-20" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,15,30,0.5)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* For Students */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg pill-blue text-xs font-bold">
                <GraduationCap className="w-4 h-4" />
                <span>For Students & Recent Grads</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Land your dream internship with zero friction
              </h3>
              <ul className="space-y-4 pt-2">
                {[
                  { step: 1, title: "Build your profile once", desc: "Highlight your GitHub, projects, coursework, and technical skills with verified links." },
                  { step: 2, title: "Apply in one click", desc: "No redundant forms. Submit clean, targeted applications with optional custom notes." },
                  { step: 3, title: "Track pipeline progress live", desc: "Watch your status update live as recruiters review, shortlist, and invite you to interviews." },
                ].map((item) => (
                  <li key={item.step} className="flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-lg shadow-blue-500/25">
                      {item.step}
                    </div>
                    <div>
                      <h5 className="text-base font-bold text-white">{item.title}</h5>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <Link href="/register?role=STUDENT">
                  <button className="px-6 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01]">
                    Create Student Profile
                  </button>
                </Link>
              </div>
            </div>

            {/* For Employers */}
            <div className="relative overflow-hidden p-8 sm:p-10 rounded-3xl space-y-6"
              style={{
                background: "linear-gradient(135deg, rgba(17,24,39,0.95) 0%, rgba(15,23,42,0.98) 100%)",
                border: "1px solid rgba(99,102,241,0.25)",
                boxShadow: "0 0 0 1px rgba(99,102,241,0.1), 0 40px 80px -20px rgba(59,130,246,0.12)",
              }}
            >
              {/* Decorative glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/8 blur-2xl pointer-events-none rounded-full" />
              {/* Gradient border top */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/80 text-blue-400 text-xs font-bold border border-slate-700/60 mb-2">
                  <Building className="w-4 h-4" />
                  <span>For Recruiters & Tech Founders</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Hire world-class emerging tech talent faster
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Connect directly with thousands of motivated CS, Software, and AI students actively seeking real-world experience.
                </p>
                <div className="space-y-3 pt-2">
                  {[
                    "Post verified internship opportunities with custom requirements",
                    "Review student portfolios, GitHubs, and verified resumes",
                    "Manage applicant statuses with seamless one-click pipeline updates",
                  ].map((point) => (
                    <div key={point} className="flex items-center gap-2.5 text-xs text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4">
                  <Link href="/register?role=RECRUITER">
                    <button className="px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-[1.01]">
                      Start Hiring Interns
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bottom Conversion Banner ──────────────── */}
      <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(17,24,39,1) 0%, rgba(15,23,42,1) 50%, rgba(12,18,35,1) 100%)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Ambient orbs */}
        <div className="absolute inset-0 bg-mesh-pattern opacity-30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-blue-400 mx-auto mb-6 animate-float-glow" style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)" }}>
            <Zap className="w-7 h-7" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to jumpstart your career in tech?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students finding meaningful, high-paying internships at top Indian tech companies every week.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/internships">
              <button className="px-8 py-3.5 rounded-xl text-sm font-bold bg-slate-900/30 text-white hover:bg-slate-800/50 shadow-2xl transition-all hover:scale-[1.02] flex items-center gap-2">
                <span>Explore All Internships</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/register?role=STUDENT">
              <button className="px-8 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600/90 to-indigo-600/90 hover:from-blue-600 hover:to-indigo-600 text-white border border-blue-500/30 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]">
                Create Free Account
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
