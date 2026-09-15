"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  ExternalLink,
  GraduationCap,
  Calendar,
  FileText,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ApplicationStatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";

interface ApplicantItem {
  id: string;
  status: "APPLIED" | "SHORTLISTED" | "INTERVIEW" | "SELECTED" | "REJECTED";
  coverNote?: string | null;
  appliedAt: string;
  studentProfile: {
    id: string;
    headline?: string | null;
    bio?: string | null;
    skills: string[];
    resumeUrl?: string | null;
    linkedinUrl?: string | null;
    githubUrl?: string | null;
    portfolioUrl?: string | null;
    user: {
      name: string;
      email: string;
    };
    education: Array<{
      degree: string;
      institution: string;
      fieldOfStudy: string;
      startYear: number;
      endYear?: number | null;
    }>;
  };
}

export default function InternshipApplicantsPage() {
  const params = useParams();
  const router = useRouter();
  const internshipId = params.id as string;

  const [applicants, setApplicants] = useState<ApplicantItem[]>([]);
  const [internshipTitle, setInternshipTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchApplicants = React.useCallback(async () => {
    try {
      // 1. Fetch internship info
      const intRes = await fetch(`/api/internships/${internshipId}`);
      if (!intRes.ok) {
        if (intRes.status === 404) setError("Internship not found");
        return;
      }
      const intData = await intRes.json();
      setInternshipTitle(intData.internship.title);

      // 2. Fetch applications for this internship
      const appRes = await fetch(
        `/api/applications?internshipId=${internshipId}`
      );
      if (!appRes.ok) {
        const d = await appRes.json();
        setError(d.error || "Failed to load candidates");
        return;
      }
      const appData = await appRes.json();
      setApplicants(appData.applications || []);
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred while loading applicants");
    } finally {
      setLoading(false);
    }
  }, [internshipId]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const handleStatusChange = async (
    applicationId: string,
    newStatus: "APPLIED" | "SHORTLISTED" | "INTERVIEW" | "SELECTED" | "REJECTED"
  ) => {
    setUpdatingId(applicationId);
    try {
      const res = await fetch(`/api/applications/${applicationId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setApplicants(
          applicants.map((a) =>
            a.id === applicationId ? { ...a, status: newStatus } : a
          )
        );
      } else {
        const d = await res.json();
        alert(d.error || "Failed to update status");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="mb-4">
          <Link
            href="/recruiter/internships"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Manage Internships
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>Candidate Pipeline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Applicants for: {internshipTitle || "Internship Role"}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Review candidate qualifications, inspect portfolios/resumes, and update hiring statuses.
            </p>
          </div>

          <div className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
            Total Candidates:{" "}
            <span className="font-bold text-slate-900">
              {applicants.length}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-800 flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-pulse"
              >
                <div className="h-6 w-48 bg-slate-200 rounded" />
                <div className="h-4 w-64 bg-slate-100 rounded" />
                <div className="h-20 bg-slate-50 rounded-xl" />
              </div>
            ))}
          </div>
        ) : applicants.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No applicants yet for this role"
            description="When students discover this internship and submit their profiles, you will be able to review their portfolios and manage their status right here."
            actionLabel="View All Postings"
            actionHref="/recruiter/internships"
          />
        ) : (
          <div className="space-y-6">
            {applicants.map((app) => {
              const student = app.studentProfile;
              const edu = student.education[0];

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 hover:border-slate-300 transition-all"
                >
                  {/* Top Bar: Candidate Identity & Status Dropdown */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {student.user.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {student.user.email}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Applied {formatDate(app.appliedAt)}
                        </span>
                      </div>
                      {student.headline && (
                        <p className="text-xs text-slate-700 font-medium mt-2">
                          {student.headline}
                        </p>
                      )}
                    </div>

                    {/* Interactive Status Changer */}
                    <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 p-2 rounded-xl">
                      <span className="text-xs font-semibold text-slate-600 pl-1">
                        Status:
                      </span>
                      <select
                        value={app.status}
                        onChange={(e) =>
                          handleStatusChange(app.id, e.target.value as any)
                        }
                        disabled={updatingId === app.id}
                        className="text-xs font-semibold rounded-lg border border-slate-300 py-1.5 px-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                      >
                        <option value="APPLIED">Applied</option>
                        <option value="SHORTLISTED">Shortlisted</option>
                        <option value="INTERVIEW">Interview</option>
                        <option value="SELECTED">Selected / Offered</option>
                        <option value="REJECTED">Not Selected</option>
                      </select>
                      <ApplicationStatusBadge status={app.status} size="sm" />
                    </div>
                  </div>

                  {/* Education & Bio */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    <div>
                      <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                        Education & University
                      </span>
                      {edu ? (
                        <div className="flex items-start gap-2.5 text-slate-700">
                          <GraduationCap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-slate-900">
                              {edu.degree} in {edu.fieldOfStudy}
                            </p>
                            <p className="text-slate-500">
                              {edu.institution} ({edu.startYear} –{" "}
                              {edu.endYear || "Present"})
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">
                          No education listed
                        </span>
                      )}

                      {student.bio && (
                        <p className="text-slate-600 mt-3 leading-relaxed">
                          {student.bio}
                        </p>
                      )}
                    </div>

                    {/* Links & Portfolios */}
                    <div>
                      <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                        Candidate Links & Verification
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {student.resumeUrl && (
                          <a
                            href={student.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            View Resume PDF
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        {student.githubUrl && (
                          <a
                            href={student.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-medium hover:bg-slate-200 transition-colors"
                          >
                            GitHub Profile
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        {student.portfolioUrl && (
                          <a
                            href={student.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-medium hover:bg-slate-200 transition-colors"
                          >
                            Portfolio Site
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        {student.linkedinUrl && (
                          <a
                            href={student.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-medium hover:bg-slate-200 transition-colors"
                          >
                            LinkedIn
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Skills Tags */}
                  {student.skills.length > 0 && (
                    <div>
                      <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px] block mb-1.5">
                        Technical Skills
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {student.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Candidate Cover Note */}
                  {app.coverNote && (
                    <div className="pt-4 border-t border-slate-100 text-xs">
                      <span className="font-semibold text-slate-700 block mb-1">
                        Candidate's Note:
                      </span>
                      <p className="italic text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                        "{app.coverNote}"
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
