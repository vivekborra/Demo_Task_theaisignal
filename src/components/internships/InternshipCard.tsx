import React from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Banknote,
  Calendar,
  Building2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
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

  const workModeStyles = {
    REMOTE: {
      label: "Remote",
      pill: "pill-emerald",
      dot: "bg-emerald-400",
    },
    HYBRID: {
      label: "Hybrid",
      pill: "pill-blue",
      dot: "bg-blue-400",
    },
    ONSITE: {
      label: "On-site",
      pill: "bg-slate-700/60 text-slate-300 border border-slate-600/50",
      dot: "bg-slate-400",
    },
  }[internship.workMode];

  // Deterministic gradient from company name
  const getCompanyGradient = (name: string) => {
    const gradients = [
      "from-blue-500 to-indigo-600",
      "from-violet-500 to-purple-600",
      "from-emerald-500 to-teal-600",
      "from-amber-500 to-orange-600",
      "from-rose-500 to-pink-600",
      "from-cyan-500 to-sky-600",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
  };

  return (
    <div className="group relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 bg-[rgba(17,24,39,0.80)] border border-white/[0.08] hover:border-indigo-500/45 hover:shadow-[0_0_0_1px_rgba(99,102,241,0.15),_0_20px_60px_-15px_rgba(59,130,246,0.18)]"
      style={{
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div>
        {/* Header: Company & Badges */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            {internship.company.logoUrl ? (
              <img
                src={internship.company.logoUrl}
                alt={internship.company.name}
                className="w-12 h-12 rounded-xl object-cover border border-white/10 bg-slate-800 shrink-0"
              />
            ) : (
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${getCompanyGradient(internship.company.name)} flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0`}
              >
                {internship.company.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <span className="truncate">{internship.company.name}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              </div>
              <Link href={`/internships/${internship.id}`}>
                <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-blue-300 transition-colors line-clamp-1 mt-0.5">
                  {internship.title}
                </h3>
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {isClosed ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/25">
                Closed
              </span>
            ) : isExpired ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                Expired
              </span>
            ) : (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${workModeStyles.pill}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${workModeStyles.dot}`} />
                {workModeStyles.label}
              </span>
            )}
          </div>
        </div>

        {/* Quick Meta Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
          {/* Stipend Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold pill-emerald">
            <Banknote className="w-3.5 h-3.5 shrink-0" />
            <span>
              {internship.stipend > 0
                ? `${formatCurrency(internship.stipend, internship.location)} / mo`
                : "Competitive / Unpaid"}
            </span>
          </div>

          {/* Location */}
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/70 text-slate-400 border border-white/[0.07] font-medium">
            <MapPin className="w-3 h-3 text-slate-500" />
            <span className="truncate max-w-[140px]">{internship.location}</span>
          </div>

          {/* Duration */}
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/70 text-slate-400 border border-white/[0.07] font-medium">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>
              {internship.durationMonths} Month{internship.durationMonths > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {internship.description}
        </p>

        {/* Skills Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {internship.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-white/[0.07] hover:border-blue-500/40 hover:text-blue-300 transition-colors"
            >
              {skill}
            </span>
          ))}
          {internship.skills.length > 4 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-500 bg-slate-800/60 border border-white/[0.06]">
              +{internship.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer / CTA Bar */}
      <div className="pt-3.5 border-t border-white/[0.07] flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          {internship._count && internship._count.applications > 0 ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
              <Users className="w-3 h-3" />
              {internship._count.applications} applied
            </span>
          ) : (
            <span className="text-[11px] text-slate-600">Be the first to apply</span>
          )}
          <span className="text-slate-700">•</span>
          <span className={isExpired ? "text-rose-400 font-medium" : "text-slate-600 text-[11px]"}>
            Due: {new Date(internship.deadline).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
          </span>
        </div>

        <Link
          href={`/internships/${internship.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 group-hover:translate-x-0.5 transition-all"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
