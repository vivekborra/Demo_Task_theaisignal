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
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Application Status
          </h3>
          <p className="text-xs text-slate-500">
            {isClosed
              ? "This internship posting has concluded."
              : isExpired
              ? "Deadline has passed for this role."
              : `Applications close ${formatRelativeTime(deadline)}`}
          </p>
        </div>

        {/* Application State Logic */}
        {application ? (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-900">
                You have applied!
              </span>
              <ApplicationStatusBadge status={application.status} size="sm" />
            </div>
            <p className="text-xs text-blue-700 leading-relaxed">
              Your application was submitted on {formatDate(application.appliedAt)}.
              Track candidate updates and interview invites from your dashboard.
            </p>
            <Link href="/student/applications" className="block pt-1">
              <Button size="sm" variant="outline" className="w-full bg-white text-xs">
                View in My Applications
              </Button>
            </Link>
          </div>
        ) : isClosed ? (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
            <AlertCircle className="w-5 h-5 text-slate-400 mx-auto" />
            <p className="text-xs font-medium text-slate-700">
              This posting is closed by the recruiter
            </p>
          </div>
        ) : isExpired ? (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center space-y-2">
            <Clock className="w-5 h-5 text-amber-600 mx-auto" />
            <p className="text-xs font-medium text-amber-800">
              The deadline for this internship ({formatDate(deadline)}) has passed.
            </p>
          </div>
        ) : !currentUser ? (
          <div className="space-y-3">
            <Link
              href={`/login?returnUrl=/internships/${internshipId}`}
              className="block"
            >
              <Button size="lg" className="w-full rounded-xl">
                Sign in to Apply
              </Button>
            </Link>
            <p className="text-[11px] text-center text-slate-500">
              Don't have an account?{" "}
              <Link
                href="/register?role=STUDENT"
                className="font-semibold text-blue-600 hover:underline"
              >
                Sign up as student
              </Link>
            </p>
          </div>
        ) : currentUser.role === "RECRUITER" ? (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
            <Lock className="w-5 h-5 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-600 font-medium">
              You are signed in as a Recruiter. Switch to a student account to apply.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <Button
              size="lg"
              onClick={() => setModalOpen(true)}
              className="w-full rounded-xl shadow-sm"
            >
              Apply Now
            </Button>
            <p className="text-[11px] text-center text-slate-400">
              Takes less than 1 minute with your profile
            </p>
          </div>
        )}

        {/* Value badges in sidebar */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Direct submission to hiring team</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Real-time status tracking guaranteed</span>
          </div>
          <div className="flex items-center gap-2">
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
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">
              Attached from your profile:
            </p>
            <p className="text-slate-500">
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

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={loading}>
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
