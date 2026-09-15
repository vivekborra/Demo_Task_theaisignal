import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Building2,
  Globe,
  CheckCircle2,
  ArrowLeft,
  Share2,
  AlertCircle,
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

  const workModeBadge = {
    REMOTE: { label: "Remote", variant: "success" as const },
    HYBRID: { label: "Hybrid", variant: "info" as const },
    ONSITE: { label: "On-site", variant: "default" as const },
  }[internship.workMode];

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/internships"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all internships
          </Link>
        </div>

        {/* Main 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left / Main Details Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  {internship.company.logoUrl ? (
                    <img
                      src={internship.company.logoUrl}
                      alt={internship.company.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm bg-slate-50"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl shadow-sm">
                      {internship.company.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                      {internship.title}
                    </h1>
                    <div className="flex items-center gap-2 mt-1 text-sm font-medium text-slate-600">
                      <span>{internship.company.name}</span>
                      {internship.company.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-500 text-xs">
                            <MapPin className="w-3.5 h-3.5" />
                            {internship.company.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-start sm:items-end gap-2">
                  <Badge variant={workModeBadge.variant} size="md">
                    {workModeBadge.label}
                  </Badge>
                  {isClosed ? (
                    <Badge variant="danger" size="sm">
                      Closed
                    </Badge>
                  ) : isExpired ? (
                    <Badge variant="warning" size="sm">
                      Deadline Passed
                    </Badge>
                  ) : (
                    <span className="text-[11px] text-slate-500">
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
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    {internship.stipend > 0
                      ? `${formatCurrency(internship.stipend)}`
                      : "Unpaid / Competitive"}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Duration
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    {internship.durationMonths} Months
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Deadline
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    {formatDate(internship.deadline)}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Applicants
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    {internship._count.applications} submitted
                  </span>
                </div>
              </div>
            </div>

            {/* About the Role */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                About the Role
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {internship.description}
              </p>
            </div>

            {/* Key Responsibilities */}
            {internship.responsibilities.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  What You'll Do & Key Responsibilities
                </h2>
                <ul className="space-y-2.5">
                  {internship.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements & Eligibility */}
            {internship.requirements.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Requirements & Eligibility
                </h2>
                <ul className="space-y-2.5">
                  {internship.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-2" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Skills & Tech Stack */}
            {internship.skills.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Relevant Skills & Technologies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {internship.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* About the Company */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  About {internship.company.name}
                </h2>
                {internship.company.website && (
                  <a
                    href={internship.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Visit Website
                  </a>
                )}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {internship.company.description ||
                  "Verified employer committed to student growth and professional engineering mentorship."}
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-500">
                {internship.company.industry && (
                  <div>
                    <span className="font-medium text-slate-400">Industry:</span>{" "}
                    <span className="text-slate-700">{internship.company.industry}</span>
                  </div>
                )}
                {internship.company.size && (
                  <div>
                    <span className="font-medium text-slate-400">Company Size:</span>{" "}
                    <span className="text-slate-700">{internship.company.size}</span>
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
