"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { ApplicationStatusBadge } from "@/components/ui/StatusBadge";
import {
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { formatDate, formatRelativeTime } from "@/lib/utils";

interface InternshipApplyCardProps {
  internshipId: string;
  title: string;
  companyName: string;
  isExpired: boolean;
  isClosed: boolean;
  deadline: string | Date;
  currentUser: { role: "STUDENT" | "RECRUITER" } | null;
  userApplication: {
    id: string;
    status: any;
    appliedAt: string;
  } | null;
}

export function InternshipApplyCard({
  internshipId,
  title,
  companyName,
  isExpired,
  isClosed,
  deadline,
  currentUser,
  userApplication: initialApplication,
}: InternshipApplyCardProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [coverNote, setCoverNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [application, setApplication] = useState(initialApplication);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/internships/${internshipId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverNote }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit application");
        return;
      }

      setApplication({
        id: data.application.id,
        status: data.application.status,
        appliedAt: data.application.appliedAt,
      });
      setModalOpen(false);
      router.refresh();
    } catch (err: any) {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="rounded-3xl p-6 space-y-6"
        style={{
          background: "rgba(15,23,42,0.90)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 4px 24px -4px rgba(0,0,0,0.5)",
        }}
      >
        <div>
          <h3 className="text-base font-bold text-white mb-1">
            Application Status
          </h3>
          <p className="text-xs text-slate-400">
            {isClosed
              ? "This internship posting has concluded."
              : isExpired
              ? "Deadline has passed for this role."
              : `Applications close ${formatRelativeTime(deadline)}`}
          </p>
        </div>

        {/* Application State Logic */}
        {application ? (
          <div
            className="p-4 rounded-2xl space-y-3"
            style={{
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.25)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-300">
                You have applied!
              </span>
              <ApplicationStatusBadge status={application.status} size="sm" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your application was submitted on {formatDate(application.appliedAt)}.
              Track candidate updates and interview invites from your dashboard.
            </p>
            <Link href="/student/applications" className="block pt-1">
              <button className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all">
                View in My Applications →
              </button>
            </Link>
          </div>
        ) : isClosed ? (
          <div
            className="p-4 rounded-2xl text-center space-y-2"
            style={{ background: "rgba(30,41,59,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <AlertCircle className="w-5 h-5 text-slate-500 mx-auto" />
            <p className="text-xs font-medium text-slate-400">
              This posting has been closed by the recruiter
            </p>
          </div>
        ) : isExpired ? (
          <div
            className="p-4 rounded-2xl text-center space-y-2"
            style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)" }}
          >
            <Clock className="w-5 h-5 text-amber-400 mx-auto" />
            <p className="text-xs font-medium text-amber-300">
              The deadline for this role ({formatDate(deadline)}) has passed.
            </p>
          </div>
        ) : !currentUser ? (
          <div className="space-y-3">
            <Link
              href={`/login?returnUrl=/internships/${internshipId}`}
              className="block"
            >
              <button className="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer">
                <span>Sign in to Apply</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <p className="text-[11px] text-center text-slate-500">
              Don't have an account?{" "}
              <Link
                href="/register?role=STUDENT"
                className="font-bold text-blue-400 hover:text-blue-300 underline"
              >
                Sign up as student
              </Link>
            </p>
          </div>
        ) : currentUser.role === "RECRUITER" ? (
          <div
            className="p-4 rounded-2xl text-center space-y-2"
            style={{ background: "rgba(30,41,59,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <Lock className="w-5 h-5 text-slate-500 mx-auto" />
            <p className="text-xs text-slate-400 font-medium">
              You are signed in as a Recruiter. Switch to a student account to apply.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => setModalOpen(true)}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Apply Now</span>
            </button>
            <p className="text-[11px] text-center text-slate-400">
              Takes less than 1 minute with your profile
            </p>
          </div>
        )}

        {/* Value badges in sidebar */}
        <div className="pt-4 border-t border-white/[0.08] space-y-3 text-xs text-slate-400">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Direct submission to hiring team</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Real-time status tracking guaranteed</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Application deadline: {formatDate(deadline)}</span>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Apply to ${title}`}
        description={`${companyName} will review your student profile, education, and portfolio.`}
        maxWidth="md"
      >
        <form onSubmit={handleApply} className="space-y-4">
          {error && (
            <div
              className="p-3 rounded-xl text-xs text-rose-300 flex items-center gap-2"
              style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)" }}
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div
            className="p-3.5 rounded-2xl text-xs text-slate-300 space-y-1"
            style={{ background: "rgba(30,41,59,0.7)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="font-bold text-white">
              Attached from your profile:
            </p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Your name, university education, technical skills, resume link, and GitHub/Portfolio links will automatically accompany this application.
            </p>
          </div>

          <Textarea
            label="Cover Note / Why are you interested? (Optional)"
            value={coverNote}
            onChange={(e) => setCoverNote(e.target.value)}
            placeholder="Introduce yourself, highlight a relevant project, or explain what excites you about this role..."
            rows={4}
            helperText="Recruiters love concise notes highlighting hands-on project experience."
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white border border-white/[0.1] hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 transition-all cursor-pointer"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
