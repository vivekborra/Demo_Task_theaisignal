"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  PlusCircle,
  Users,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  MapPin,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { InternshipStatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate, isPastDeadline } from "@/lib/utils";

interface RecruiterInternship {
  id: string;
  title: string;
  location: string;
  workMode: "REMOTE" | "HYBRID" | "ONSITE";
  stipend: number;
  durationMonths: number;
  deadline: string;
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
  createdAt: string;
  _count: {
    applications: number;
  };
}

export default function RecruiterInternshipsPage() {
  const [internships, setInternships] = useState<RecruiterInternship[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPostings = async () => {
    try {
      // Use recruiterView=true to get ALL internships (DRAFT, PUBLISHED, CLOSED)
      const res = await fetch("/api/internships?recruiterView=true");
      if (res.ok) {
        const data = await res.json();
        setInternships(data.internships || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostings();
  }, []);

  const handleToggleStatus = async (
    id: string,
    currentStatus: "PUBLISHED" | "CLOSED" | "DRAFT"
  ) => {
    const newStatus = currentStatus === "PUBLISHED" ? "CLOSED" : "PUBLISHED";
    setActionLoading(id);
    try {
      const res = await fetch(`/api/internships/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setInternships(
          internships.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this internship posting?")) {
      return;
    }
    setActionLoading(id);
    try {
      const res = await fetch(`/api/internships/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setInternships(internships.filter((i) => i.id !== id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen py-8 lg:py-12 relative overflow-hidden" style={{ background: "transparent" }}>
      {/* Ambient background glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-500/8 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-60 right-10 w-96 h-96 bg-blue-500/8 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Manage Internships
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Create, edit, close, or review candidates for your company&apos;s internship listings.
            </p>
          </div>

          <Link href="/recruiter/internships/new">
            <button className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer">
              <PlusCircle className="w-4 h-4" />
              Post New Internship
            </button>
          </Link>
        </div>

        {loading ? (
          <div
            className="rounded-2xl p-8 space-y-4 animate-pulse"
            style={{
              background: "rgba(15,23,42,0.85)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="h-6 w-48 bg-slate-700 rounded" />
            <div className="h-16 bg-slate-800/60 rounded-xl" />
            <div className="h-16 bg-slate-800/60 rounded-xl" />
          </div>
        ) : internships.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No internship postings found"
            description="You haven't posted any internships for your company yet. Publish your first role to start accepting student applications!"
            actionLabel="Post Your First Internship"
            actionHref="/recruiter/internships/new"
          />
        ) : (
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(15,23,42,0.85)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 4px 24px -4px rgba(0,0,0,0.4)",
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr
                    className="border-b text-slate-400 uppercase font-semibold"
                    style={{ borderColor: "rgba(255,255,255,0.08)" }}
                  >
                    <th className="py-3.5 px-6">Internship Role</th>
                    <th className="py-3.5 px-6">Work Mode</th>
                    <th className="py-3.5 px-6">Deadline</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-center">Applicants</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  {internships.map((item) => {
                    const isExpired = isPastDeadline(item.deadline);

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="py-4 px-6 font-semibold text-white">
                          <Link
                            href={`/internships/${item.id}`}
                            className="hover:text-blue-300 transition-colors flex items-center gap-1.5"
                          >
                            {item.title}
                            <ExternalLink className="w-3 h-3 text-slate-500 inline" />
                          </Link>
                          <span className="block text-[11px] text-slate-400 font-normal mt-0.5">
                            {item.location}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-400">
                          {item.workMode}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={
                              isExpired
                                ? "text-amber-400 font-medium"
                                : "text-slate-400"
                            }
                          >
                            {formatDate(item.deadline)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <InternshipStatusBadge
                            status={
                              item.status === "PUBLISHED" && isExpired
                                ? "EXPIRED"
                                : item.status
                            }
                            size="sm"
                          />
                        </td>
                        <td className="py-4 px-6 text-center">
                          <Link
                            href={`/recruiter/internships/${item.id}/applicants`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 font-semibold transition-colors"
                          >
                            <Users className="w-3.5 h-3.5" />
                            <span>{item._count.applications}</span>
                          </Link>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <Link
                            href={`/recruiter/internships/${item.id}/edit`}
                          >
                            <button
                              className="p-1.5 text-slate-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors inline-flex items-center"
                              title="Edit posting"
                              disabled={actionLoading === item.id}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </Link>

                          <button
                            onClick={() =>
                              handleToggleStatus(item.id, item.status)
                            }
                            disabled={actionLoading === item.id}
                            className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                              item.status === "PUBLISHED"
                                ? "border-slate-600 text-slate-400 hover:bg-slate-700/50"
                                : "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                            }`}
                          >
                            {item.status === "PUBLISHED" ? "Close" : "Publish"}
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={actionLoading === item.id}
                            className="p-1.5 text-rose-400 hover:bg-rose-500/15 rounded-lg transition-colors inline-flex items-center"
                            title="Delete posting"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
