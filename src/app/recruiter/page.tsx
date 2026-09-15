import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  Briefcase,
  Users,
  Clock,
  Award,
  PlusCircle,
  Building,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import {
  ApplicationStatusBadge,
  InternshipStatusBadge,
} from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

export default async function RecruiterDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "RECRUITER") {
    redirect("/login?returnUrl=/recruiter");
  }

  if (!user.company) {
    redirect("/recruiter/company");
  }

  // Fetch company's internships and applications statistics
  const [internships, totalApplicantsCount, interviewCount, selectedCount] =
    await Promise.all([
      prisma.internship.findMany({
        where: { companyId: user.company.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          _count: {
            select: { applications: true },
          },
        },
      }),
      prisma.application.count({
        where: {
          internship: { companyId: user.company.id },
        },
      }),
      prisma.application.count({
        where: {
          internship: { companyId: user.company.id },
          status: "INTERVIEW",
        },
      }),
      prisma.application.count({
        where: {
          internship: { companyId: user.company.id },
          status: "SELECTED",
        },
      }),
    ]);

  const activeInternshipsCount = await prisma.internship.count({
    where: {
      companyId: user.company.id,
      status: "PUBLISHED",
      deadline: { gt: new Date() },
    },
  });

  // Recent 5 applicants
  const recentApplications = await prisma.application.findMany({
    where: {
      internship: { companyId: user.company.id },
    },
    orderBy: { appliedAt: "desc" },
    take: 5,
    include: {
      internship: { select: { id: true, title: true } },
      studentProfile: {
        include: {
          user: { select: { name: true, email: true } },
          education: { take: 1, orderBy: { startYear: "desc" } },
        },
      },
    },
  });

  return (
    <div className="min-h-screen py-8 lg:py-12 relative overflow-hidden" style={{ background: "transparent" }}>
      {/* Ambient background glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-500/8 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-60 right-10 w-96 h-96 bg-blue-500/8 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full pill-violet text-xs font-bold mb-2">
              <Building className="w-3.5 h-3.5" />
              <span>{user.company.name}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Recruiter Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Monitor candidate pipeline, review student portfolios, and manage active roles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/recruiter/internships/new">
              <button className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer">
                <PlusCircle className="w-4 h-4" />
                Post New Internship
              </button>
            </Link>
          </div>
        </div>

        {/* 4 Clean Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div
            className="p-6 rounded-3xl space-y-2"
            style={{
              background: "rgba(15,23,42,0.85)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 4px 24px -4px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Active Postings
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/25 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">
              {activeInternshipsCount}
            </div>
            <p className="text-xs text-slate-400">Currently accepting applications</p>
          </div>

          <div
            className="p-6 rounded-3xl space-y-2"
            style={{
              background: "rgba(15,23,42,0.85)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 4px 24px -4px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Total Applicants
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">
              {totalApplicantsCount}
            </div>
            <p className="text-xs text-slate-400">Across all posted internships</p>
          </div>

          <div
            className="p-6 rounded-3xl space-y-2"
            style={{
              background: "rgba(15,23,42,0.85)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 4px 24px -4px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">
                In Interview
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">
              {interviewCount}
            </div>
            <p className="text-xs text-slate-400">Active candidate interviews</p>
          </div>

          <div
            className="p-6 rounded-3xl space-y-2"
            style={{
              background: "rgba(15,23,42,0.85)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 4px 24px -4px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Offers / Selected
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">
              {selectedCount}
            </div>
            <p className="text-xs text-slate-400">Intern offers extended</p>
          </div>
        </div>

        {/* Recent Applicants Section */}
        <div
          className="rounded-3xl p-6 sm:p-8 space-y-6"
          style={{
            background: "rgba(15,23,42,0.85)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 4px 24px -4px rgba(0,0,0,0.4)",
          }}
        >
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Recent Candidate Submissions
              </h2>
              <p className="text-xs text-slate-400">
                Latest student applications requiring recruiter review.
              </p>
            </div>
            <Link href="/recruiter/internships">
              <span className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer">
                View All Postings
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm italic">
              No applications submitted yet. Once students apply to your postings, they will appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] text-slate-400 uppercase font-semibold">
                    <th className="pb-3">Candidate</th>
                    <th className="pb-3">Internship Role</th>
                    <th className="pb-3">University</th>
                    <th className="pb-3">Applied</th>
                    <th className="pb-3">Current Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {recentApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 font-bold text-white">
                        {app.studentProfile.user.name}
                        <span className="block text-[11px] text-slate-400 font-normal">
                          {app.studentProfile.user.email}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-300">
                        {app.internship.title}
                      </td>
                      <td className="py-3.5 text-slate-400">
                        {app.studentProfile.education[0]?.institution || "—"}
                      </td>
                      <td className="py-3.5 text-slate-400">
                        {formatDate(app.appliedAt)}
                      </td>
                      <td className="py-3.5">
                        <ApplicationStatusBadge status={app.status} size="sm" />
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href={`/recruiter/internships/${app.internship.id}/applicants`}
                          className="font-bold text-blue-400 hover:text-blue-300"
                        >
                          Review Candidate →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Active Postings Overview */}
        <div
          className="rounded-3xl p-6 sm:p-8 space-y-6"
          style={{
            background: "rgba(15,23,42,0.85)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 4px 24px -4px rgba(0,0,0,0.4)",
          }}
        >
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Your Internship Postings
              </h2>
              <p className="text-xs text-slate-400">
                Track status and candidate counts per role.
              </p>
            </div>
            <Link href="/recruiter/internships/new">
              <button className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-blue-300 bg-blue-500/15 border border-blue-500/30 hover:bg-blue-500/25 transition-all cursor-pointer">
                + Create Another Posting
              </button>
            </Link>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {internships.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] p-3 rounded-2xl transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm">
                      {item.title}
                    </h3>
                    <InternshipStatusBadge status={item.status} size="sm" />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>{item.location}</span>
                    <span>•</span>
                    <span>{item.workMode}</span>
                    <span>•</span>
                    <span>Deadline: {formatDate(item.deadline)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-blue-400 block">
                      {item._count.applications}
                    </span>
                    <span className="text-[11px] text-slate-400">Applicants</span>
                  </div>
                  <Link href={`/recruiter/internships/${item.id}/applicants`}>
                    <button className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] hover:text-white transition-all cursor-pointer">
                      Manage Applicants
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
