import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  MapPin,
  Clock,
  Banknote,
  Calendar,
  Building2,
  Globe,
  CheckCircle2,
  ArrowLeft,
  Share2,
  AlertCircle,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate, formatRelativeTime, isPastDeadline } from "@/lib/utils";
import { InternshipApplyCard } from "./InternshipApplyCard";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const internship = await prisma.internship.findUnique({
    where: { id: params.id },
    include: { company: true },
  });

  if (!internship) {
    return {
      title: "Internship Not Found | InternHub",
    };
  }

  return {
    title: `${internship.title} at ${internship.company.name} | InternHub`,
    description: internship.description.slice(0, 160),
  };
}

export default async function InternshipDetailPage({ params }: PageProps) {
  const internship = await prisma.internship.findUnique({
    where: { id: params.id },
    include: {
      company: true,
      _count: {
        select: { applications: true },
      },
    },
  });

  if (!internship) {
    notFound();
  }

  const currentUser = await getCurrentUser();

  let userApplication = null;
  if (currentUser?.role === "STUDENT" && currentUser.studentProfile) {
    userApplication = await prisma.application.findUnique({
      where: {
        studentProfileId_internshipId: {
          studentProfileId: currentUser.studentProfile.id,
          internshipId: internship.id,
        },
      },
    });
  }

  const isExpired = isPastDeadline(internship.deadline);
  const isClosed = internship.status === "CLOSED";

  const workModeStyles = {
    REMOTE: { label: "Remote", pill: "pill-emerald" },
    HYBRID: { label: "Hybrid", pill: "pill-blue" },
    ONSITE: { label: "On-site", pill: "bg-slate-700/60 text-slate-300 border border-slate-600/50" },
  }[internship.workMode];

  return (
    <div className="min-h-screen py-8 lg:py-12 relative overflow-hidden" style={{ background: "transparent" }}>
      {/* Ambient background glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500/8 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-indigo-500/8 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/internships"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all opportunities
          </Link>
        </div>

        {/* Main 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left / Main Details Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div
              className="rounded-3xl p-6 sm:p-8"
              style={{
                background: "rgba(15,23,42,0.85)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 4px 24px -4px rgba(0,0,0,0.5)",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                <div className="flex items-center gap-4">
                  {internship.company.logoUrl ? (
                    <img
                      src={internship.company.logoUrl}
                      alt={internship.company.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-white/[0.1] bg-slate-800 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shrink-0">
                      {internship.company.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                      {internship.title}
                    </h1>
                    <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-slate-400">
                      <span className="text-slate-200">{internship.company.name}</span>
                      {internship.location && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="flex items-center gap-1 text-slate-400 text-xs">
                            <MapPin className="w-3.5 h-3.5 text-blue-400" />
                            {internship.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-start sm:items-end gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${workModeStyles.pill}`}>
                    {workModeStyles.label}
                  </span>
                  {isClosed ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/25">
                      Closed
                    </span>
                  ) : isExpired ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                      Deadline Passed
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      {formatRelativeTime(internship.deadline)}
                    </span>
                  )}
                </div>
              </div>

              {/* Highlights Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Monthly Stipend
                  </span>
                  <span className="text-base font-extrabold text-emerald-400 mt-1 block">
                    {internship.stipend > 0
                      ? `${formatCurrency(internship.stipend, internship.location)} / mo`
                      : "Competitive / Unpaid"}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Duration
                  </span>
                  <span className="text-base font-bold text-white mt-1 block">
                    {internship.durationMonths} Month{internship.durationMonths > 1 ? "s" : ""}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Deadline
                  </span>
                  <span className="text-base font-bold text-white mt-1 block">
                    {formatDate(internship.deadline)}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Applicants
                  </span>
                  <span className="text-base font-bold text-blue-400 mt-1 block flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {internship._count.applications} applied
                  </span>
                </div>
              </div>
            </div>

            {/* About the Role */}
            <div
              className="rounded-3xl p-6 sm:p-8 space-y-4"
              style={{
                background: "rgba(15,23,42,0.85)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h2 className="text-lg font-bold text-white tracking-tight">
                About the Role
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {internship.description}
              </p>
            </div>

            {/* Key Responsibilities */}
            {internship.responsibilities.length > 0 && (
              <div
                className="rounded-3xl p-6 sm:p-8 space-y-4"
                style={{
                  background: "rgba(15,23,42,0.85)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <h2 className="text-lg font-bold text-white tracking-tight">
                  What You'll Do & Key Responsibilities
                </h2>
                <ul className="space-y-3">
                  {internship.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements & Eligibility */}
            {internship.requirements.length > 0 && (
              <div
                className="rounded-3xl p-6 sm:p-8 space-y-4"
                style={{
                  background: "rgba(15,23,42,0.85)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Requirements & Eligibility
                </h2>
                <ul className="space-y-3">
                  {internship.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0 mt-2" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Skills & Tech Stack */}
            {internship.skills.length > 0 && (
              <div
                className="rounded-3xl p-6 sm:p-8 space-y-4"
                style={{
                  background: "rgba(15,23,42,0.85)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Relevant Skills & Technologies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {internship.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/90 text-blue-300 border border-white/[0.08]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* About the Company */}
            <div
              className="rounded-3xl p-6 sm:p-8 space-y-4"
              style={{
                background: "rgba(15,23,42,0.85)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  About {internship.company.name}
                </h2>
                {internship.company.website && (
                  <a
                    href={internship.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Website
                  </a>
                )}
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                {internship.company.description ||
                  "Verified employer committed to student growth and professional engineering mentorship."}
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-400">
                {internship.company.industry && (
                  <div>
                    <span className="font-semibold text-slate-500">Industry:</span>{" "}
                    <span className="text-slate-300">{internship.company.industry}</span>
                  </div>
                )}
                {internship.company.size && (
                  <div>
                    <span className="font-semibold text-slate-500">Company Size:</span>{" "}
                    <span className="text-slate-300">{internship.company.size}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sticky Sidebar: Application Action Card */}
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <InternshipApplyCard
              internshipId={internship.id}
              title={internship.title}
              companyName={internship.company.name}
              isExpired={isExpired}
              isClosed={isClosed}
              deadline={internship.deadline}
              currentUser={currentUser ? { role: currentUser.role } : null}
              userApplication={
                userApplication
                  ? {
                      id: userApplication.id,
                      status: userApplication.status,
                      appliedAt: userApplication.appliedAt.toISOString(),
                    }
                  : null
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
