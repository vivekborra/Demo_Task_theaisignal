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
} from "lucide-react";
import { Button } from "@/components/ui/Button";
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
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              <Building className="w-3.5 h-3.5" />
              <span>{user.company.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Recruiter Dashboard
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Monitor candidate pipeline, review applicants, and manage your active postings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/recruiter/internships/new">
              <Button size="md" className="gap-1.5 shadow-sm">
                <PlusCircle className="w-4 h-4" />
                Post New Internship
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Clean Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Active Postings
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {activeInternshipsCount}
            </div>
            <p className="text-xs text-slate-500">Currently accepting applications</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Total Applicants
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {totalApplicantsCount}
            </div>
            <p className="text-xs text-slate-500">Across all posted internships</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">
                In Interview
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {interviewCount}
            </div>
            <p className="text-xs text-slate-500">Active candidate interviews</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Offers / Selected
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {selectedCount}
            </div>
            <p className="text-xs text-slate-500">Intern offers extended</p>
          </div>
        </div>

        {/* Recent Applicants Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Candidate Submissions
              </h2>
              <p className="text-xs text-slate-500">
                Latest student applications requiring review.
              </p>
            </div>
            <Link href="/recruiter/internships">
              <Button variant="ghost" size="sm" className="text-xs text-blue-600">
                View All Postings
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm italic">
              No applications submitted yet. Once students apply to your postings, they will appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                    <th className="pb-3">Candidate</th>
                    <th className="pb-3">Internship Role</th>
                    <th className="pb-3">University</th>
                    <th className="pb-3">Applied</th>
                    <th className="pb-3">Current Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 font-medium text-slate-900">
                        {app.studentProfile.user.name}
                        <span className="block text-[11px] text-slate-400 font-normal">
                          {app.studentProfile.user.email}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-700">
                        {app.internship.title}
                      </td>
                      <td className="py-3.5 text-slate-500">
                        {app.studentProfile.education[0]?.institution || "—"}
                      </td>
                      <td className="py-3.5 text-slate-500">
                        {formatDate(app.appliedAt)}
                      </td>
                      <td className="py-3.5">
                        <ApplicationStatusBadge status={app.status} size="sm" />
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href={`/recruiter/internships/${app.internship.id}/applicants`}
                          className="font-semibold text-blue-600 hover:text-blue-700"
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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Your Internship Postings
              </h2>
              <p className="text-xs text-slate-500">
                Track status and candidate counts per role.
              </p>
            </div>
            <Link href="/recruiter/internships/new">
              <Button size="sm" variant="outline" className="text-xs">
                + Create Another Posting
              </Button>
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {internships.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 p-2 rounded-xl transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 text-sm">
                      {item.title}
                    </h3>
                    <InternshipStatusBadge status={item.status} size="sm" />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>{item.location}</span>
                    <span>•</span>
                    <span>{item.workMode}</span>
                    <span>•</span>
                    <span>Deadline: {formatDate(item.deadline)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900 block">
                      {item._count.applications}
                    </span>
                    <span className="text-[11px] text-slate-400">Applicants</span>
                  </div>
                  <Link href={`/recruiter/internships/${item.id}/applicants`}>
                    <Button size="sm" variant="outline" className="text-xs">
                      Manage Applicants
                    </Button>
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
