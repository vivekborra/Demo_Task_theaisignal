"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Inbox,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { ApplicationStatusBadge } from "@/components/ui/StatusBadge";
import { ApplicationTimeline } from "@/components/applications/ApplicationTimeline";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate, formatRelativeTime } from "@/lib/utils";

interface ApplicationItem {
  id: string;
  status: any;
  coverNote?: string | null;
  appliedAt: string;
  updatedAt: string;
  internship: {
    id: string;
    title: string;
    location: string;
    workMode: "REMOTE" | "HYBRID" | "ONSITE";
    stipend: number;
    company: {
      id: string;
      name: string;
      logoUrl?: string | null;
      location?: string | null;
    };
  };
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      try {
        const res = await fetch("/api/applications");
        if (res.ok) {
          const data = await res.json();
          setApplications(data.applications || []);
        }
      } catch (err) {
        console.error("Fetch applications error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen py-8 lg:py-12 relative overflow-hidden" style={{ background: "transparent" }}>
      {/* Ambient glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500/8 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-60 right-10 w-96 h-96 bg-indigo-500/8 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full pill-blue text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Real-Time Candidate Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              My Applications
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Track real-time candidate status, review stages, and recruiter feedback.
            </p>
          </div>

          <Link href="/internships">
            <button className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer">
              <Briefcase className="w-4 h-4" />
              Browse More Internships
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl p-6 space-y-4 animate-pulse"
                style={{
                  background: "rgba(15,23,42,0.8)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl" />
                  <div className="space-y-2">
                    <div className="h-5 w-48 bg-slate-800 rounded" />
                    <div className="h-4 w-32 bg-slate-800 rounded" />
                  </div>
                </div>
                <div className="h-10 bg-slate-800/60 rounded-xl" />
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="You haven't applied to any internships yet"
            description="Explore opportunities from vetted Indian tech companies and start applying in under a minute."
            actionLabel="Explore Internships"
            actionHref="/internships"
          />
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-3xl p-6 sm:p-7 space-y-6 transition-all hover:border-indigo-500/40"
                style={{
                  background: "rgba(15,23,42,0.85)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 4px 24px -4px rgba(0,0,0,0.4)",
                }}
              >
                {/* Header: Company & Current Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-3.5">
                    {app.internship.company.logoUrl ? (
                      <img
                        src={app.internship.company.logoUrl}
                        alt={app.internship.company.name}
                        className="w-12 h-12 rounded-xl object-cover border border-white/[0.1] bg-slate-800 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                        {app.internship.company.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-semibold text-slate-400">
                        {app.internship.company.name}
                      </span>
                      <Link
                        href={`/internships/${app.internship.id}`}
                        className="text-base sm:text-lg font-bold text-white hover:text-blue-300 transition-colors flex items-center gap-1.5 mt-0.5"
                      >
                        {app.internship.title}
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 inline" />
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <ApplicationStatusBadge status={app.status} size="md" />
                  </div>
                </div>

                {/* Status Timeline */}
                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: "rgba(30,41,59,0.5)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Application Lifecycle Progress
                  </span>
                  <ApplicationTimeline currentStatus={app.status} />
                </div>

                {/* Application Details & Timestamps */}
                <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 pt-1">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      Applied on {formatDate(app.appliedAt)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Last updated {formatRelativeTime(app.updatedAt)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {app.internship.location} ({app.internship.workMode})
                    </span>
                  </div>

                  <Link
                    href={`/internships/${app.internship.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300"
                  >
                    View Original Posting
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {app.coverNote && (
                  <div className="pt-3 border-t border-white/[0.08] text-xs">
                    <span className="font-semibold text-slate-400">
                      Your note to the recruiter:
                    </span>
                    <p className="mt-1 italic text-slate-300">"{app.coverNote}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
