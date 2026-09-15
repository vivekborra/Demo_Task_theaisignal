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
      // Use auth me to get company id or fetch company postings
      const userRes = await fetch("/api/auth/me");
      if (!userRes.ok) return;
      const userData = await userRes.json();
      const companyId = userData.user?.company?.id;

      if (companyId) {
        const res = await fetch(`/api/internships?limit=50`);
        if (res.ok) {
          const data = await res.json();
          // Filter to this company's postings
          const mine = data.internships.filter(
            (i: any) => i.company.id === companyId
          );
          setInternships(mine);
        }
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
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Manage Internships
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Create, edit, close, or review candidates for your company's internship listings.
            </p>
          </div>

          <Link href="/recruiter/internships/new">
            <Button size="md" className="gap-1.5 shadow-sm">
              <PlusCircle className="w-4 h-4" />
              Post New Internship
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4 animate-pulse">
            <div className="h-6 w-48 bg-slate-200 rounded" />
            <div className="h-20 bg-slate-100 rounded-xl" />
            <div className="h-20 bg-slate-100 rounded-xl" />
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
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                    <th className="py-3.5 px-6">Internship Role</th>
                    <th className="py-3.5 px-6">Work Mode</th>
                    <th className="py-3.5 px-6">Deadline</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-center">Applicants</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {internships.map((item) => {
                    const isExpired = isPastDeadline(item.deadline);

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="py-4 px-6 font-semibold text-slate-900">
                          <Link
                            href={`/internships/${item.id}`}
                            className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
                          >
                            {item.title}
                            <ExternalLink className="w-3 h-3 text-slate-400 inline" />
                          </Link>
                          <span className="block text-[11px] text-slate-400 font-normal mt-0.5">
                            {item.location}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-600">
                          {item.workMode}
                        </td>
                        <td className="py-4 px-6 text-slate-600">
                          <span
                            className={
                              isExpired
                                ? "text-amber-600 font-medium"
                                : "text-slate-600"
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
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition-colors"
                          >
                            <Users className="w-3.5 h-3.5" />
                            <span>{item._count.applications}</span>
                          </Link>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <Link
                            href={`/recruiter/internships/${item.id}/applicants`}
                          >
                            <Button size="sm" variant="outline" className="text-xs">
                              Review
                            </Button>
                          </Link>

                          <button
                            onClick={() =>
                              handleToggleStatus(item.id, item.status)
                            }
                            disabled={actionLoading === item.id}
                            className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                              item.status === "PUBLISHED"
                                ? "border-slate-200 text-slate-600 hover:bg-slate-100"
                                : "border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                            }`}
                          >
                            {item.status === "PUBLISHED" ? "Close" : "Publish"}
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={actionLoading === item.id}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors inline-flex items-center"
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
