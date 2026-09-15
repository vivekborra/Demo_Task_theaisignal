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
} from "lucide-react";
import { Button } from "@/components/ui/Button";
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
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              My Applications
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Track real-time progress and candidate status across all your active internship submissions.
            </p>
          </div>

          <Link href="/internships">
            <Button size="sm" variant="outline" className="gap-1.5 shadow-2xs">
              <Briefcase className="w-4 h-4 text-blue-600" />
              Browse More Internships
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                  <div className="space-y-2">
                    <div className="h-5 w-48 bg-slate-200 rounded" />
                    <div className="h-4 w-32 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="h-10 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="You haven't applied to any internships yet"
            description="Find your next role among verified companies and start applying in under a minute with your student profile."
            actionLabel="Explore Internships"
            actionHref="/internships"
          />
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6 transition-all hover:border-slate-300"
              >
                {/* Header: Company & Current Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    {app.internship.company.logoUrl ? (
                      <img
                        src={app.internship.company.logoUrl}
                        alt={app.internship.company.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-2xs bg-slate-50"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                        {app.internship.company.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-medium text-slate-500">
                        {app.internship.company.name}
                      </span>
                      <Link
                        href={`/internships/${app.internship.id}`}
                        className="text-base sm:text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                      >
                        {app.internship.title}
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 inline" />
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <ApplicationStatusBadge status={app.status} size="md" />
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-100">
                  <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Application Lifecycle Progress
                  </span>
                  <ApplicationTimeline currentStatus={app.status} />
                </div>

                {/* Application Details & Timestamps */}
                <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 pt-1">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Applied on {formatDate(app.appliedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Last updated {formatRelativeTime(app.updatedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {app.internship.location} ({app.internship.workMode})
                    </span>
                  </div>

                  <Link
                    href={`/internships/${app.internship.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View Original Posting
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {app.coverNote && (
                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">
                      Your note to the recruiter:
                    </span>
                    <p className="mt-1 italic text-slate-500">"{app.coverNote}"</p>
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
