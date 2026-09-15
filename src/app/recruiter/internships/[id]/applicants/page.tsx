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
    <div className="min-h-screen py-8 lg:py-12 relative overflow-hidden" style={{ background: "transparent" }}>
      {/* Ambient background glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-500/8 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-60 right-10 w-96 h-96 bg-blue-500/8 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
        <div className="mb-4">
          <Link
            href="/recruiter/internships"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Manage Internships
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>Candidate Pipeline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Applicants for: {internshipTitle || "Internship Role"}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Review candidate qualifications, inspect portfolios/resumes, and update hiring statuses.
            </p>
          </div>

          <div className="text-xs font-medium text-slate-400 px-3 py-1.5 rounded-lg" style={{ background: "rgba(30,41,59,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}>
            Total Candidates:{" "}
            <span className="font-bold text-white">
              {applicants.length}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl text-sm text-rose-300 flex items-center gap-2.5" style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)" }}>
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 space-y-4 animate-pulse"
                style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="h-6 w-48 bg-slate-700 rounded" />
                <div className="h-4 w-64 bg-slate-800 rounded" />
                <div className="h-20 bg-slate-800/60 rounded-xl" />
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
                  className="rounded-2xl p-6 sm:p-8 space-y-6 transition-all hover:border-indigo-500/30"
                  style={{ background: "rgba(15,23,42,0.85)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 24px -4px rgba(0,0,0,0.4)" }}
                >
                  {/* Top Bar: Candidate Identity & Status Dropdown */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {student.user.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          {student.user.email}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          Applied {formatDate(app.appliedAt)}
                        </span>
                      </div>
                      {student.headline && (
                        <p className="text-xs text-slate-300 font-medium mt-2">
                          {student.headline}
                        </p>
                      )}
                    </div>

                    {/* Interactive Status Changer */}
                    <div className="flex items-center gap-2.5 p-2 rounded-xl" style={{ background: "rgba(30,41,59,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <span className="text-xs font-semibold text-slate-400 pl-1">
                        Status:
                      </span>
                      <select
                        value={app.status}
                        onChange={(e) =>
                          handleStatusChange(app.id, e.target.value as any)
                        }
                        disabled={updatingId === app.id}
                        className="text-xs font-semibold rounded-lg py-1.5 px-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.15)" }}
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
                        <div className="flex items-start gap-2.5">
                          <GraduationCap className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-white">
                              {edu.degree} in {edu.fieldOfStudy}
                            </p>
                            <p className="text-slate-400">
                              {edu.institution} ({edu.startYear} –{" "}
                              {edu.endYear || "Present"})
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">
                          No education listed
                        </span>
                      )}

                      {student.bio && (
                        <p className="text-slate-400 mt-3 leading-relaxed">
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
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 text-white font-medium hover:bg-slate-700/50 transition-colors"
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
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 text-white font-medium hover:bg-slate-700/50 transition-colors"
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
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 text-white font-medium hover:bg-slate-700/50 transition-colors"
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
                            className="px-2.5 py-0.5 rounded-md text-xs font-medium text-blue-300"
                            style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Candidate Cover Note */}
                  {app.coverNote && (
                    <div className="pt-4 border-t text-xs" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                      <span className="font-semibold text-slate-400 block mb-1">
                        Candidate&apos;s Note:
                      </span>
                      <p className="italic text-slate-300 p-3 rounded-xl" style={{ background: "rgba(30,41,59,0.5)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        &quot;{app.coverNote}&quot;
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
