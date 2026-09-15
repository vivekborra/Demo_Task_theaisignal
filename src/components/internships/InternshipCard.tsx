import React from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatRelativeTime, isPastDeadline } from "@/lib/utils";

export interface InternshipItem {
  id: string;
  title: string;
  description: string;
  location: string;
  workMode: "REMOTE" | "HYBRID" | "ONSITE";
  stipend: number;
  durationMonths: number;
  deadline: string | Date;
  skills: string[];
  createdAt: string | Date;
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
  company: {
    id: string;
    name: string;
    logoUrl?: string | null;
    location?: string | null;
  };
  _count?: {
    applications: number;
  };
}

interface InternshipCardProps {
  internship: InternshipItem;
}

export function InternshipCard({ internship }: InternshipCardProps) {
  const isExpired = isPastDeadline(internship.deadline);
  const isClosed = internship.status === "CLOSED";

  const workModeBadge = {
    REMOTE: { label: "Remote", variant: "success" as const },
    HYBRID: { label: "Hybrid", variant: "info" as const },
    ONSITE: { label: "On-site", variant: "default" as const },
  }[internship.workMode];

  return (
    <div className="group relative bg-white rounded-xl border border-slate-200/90 hover:border-blue-400 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header: Company & Badges */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3.5">
            {internship.company.logoUrl ? (
              <img
                src={internship.company.logoUrl}
                alt={internship.company.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm bg-slate-50"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg shadow-sm">
                {internship.company.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                {internship.company.name}
              </h4>
              <Link href={`/internships/${internship.id}`}>
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {internship.title}
                </h3>
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {isClosed ? (
              <Badge variant="danger" size="sm">
                Closed
              </Badge>
            ) : isExpired ? (
              <Badge variant="warning" size="sm">
                Expired
              </Badge>
            ) : (
              <Badge variant={workModeBadge.variant} size="sm">
                {workModeBadge.label}
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Meta Stats */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 mb-4 mt-2">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {internship.location}
          </span>
          <span className="flex items-center gap-1 font-semibold text-slate-700">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            {internship.stipend > 0
              ? `${formatCurrency(internship.stipend)} / mo`
              : "Competitive / Unpaid"}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {internship.durationMonths} Month{internship.durationMonths > 1 ? "s" : ""}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {internship.description}
        </p>

        {/* Skills Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {internship.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              {skill}
            </span>
          ))}
          {internship.skills.length > 4 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] text-slate-500">
              +{internship.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer / CTA Bar */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span>{formatRelativeTime(internship.createdAt)}</span>
          <span>•</span>
          <span className={isExpired ? "text-rose-500 font-medium" : "text-slate-500"}>
            {formatRelativeTime(internship.deadline)}
          </span>
        </div>

        <Link
          href={`/internships/${internship.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 group-hover:translate-x-0.5 transition-all"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
