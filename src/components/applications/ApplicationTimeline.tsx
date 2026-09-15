import React from "react";
import { Check, Clock, X, AlertCircle } from "lucide-react";
import { ApplicationStatusType } from "@/components/ui/StatusBadge";

interface ApplicationTimelineProps {
  currentStatus: ApplicationStatusType;
}

const STAGES = [
  { key: "APPLIED", label: "Applied" },
  { key: "SHORTLISTED", label: "Shortlisted" },
  { key: "INTERVIEW", label: "Interview" },
  { key: "SELECTED", label: "Offer / Selected" },
];

export function ApplicationTimeline({ currentStatus }: ApplicationTimelineProps) {
  const isRejected = currentStatus === "REJECTED";

  const getStepIndex = (status: ApplicationStatusType) => {
    switch (status) {
      case "APPLIED":
        return 0;
      case "SHORTLISTED":
        return 1;
      case "INTERVIEW":
        return 2;
      case "SELECTED":
        return 3;
      case "REJECTED":
        return 1; // display rejected branching
      default:
        return 0;
    }
  };

  const activeIndex = getStepIndex(currentStatus);

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        {/* Connecting line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-slate-200 -z-0" />

        {STAGES.map((stage, idx) => {
          const isCompleted = !isRejected && idx < activeIndex;
          const isCurrent = !isRejected && idx === activeIndex;
          const isPending = !isRejected && idx > activeIndex;

          return (
            <div
              key={stage.key}
              className="relative z-10 flex flex-col items-center group"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all shadow-sm ${
                  isCompleted
                    ? "bg-emerald-600 text-white"
                    : isCurrent
                    ? "bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse"
                    : "bg-white border-2 border-slate-300 text-slate-400"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : isCurrent ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isCurrent
                    ? "text-blue-600 font-semibold"
                    : isCompleted
                    ? "text-emerald-700 font-medium"
                    : "text-slate-500"
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      {isRejected && (
        <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-700">
          <X className="w-4 h-4 text-rose-600 shrink-0" />
          <span>
            Application Not Selected. Thank you for your interest. We encourage
            you to explore other opportunities!
          </span>
        </div>
      )}
    </div>
  );
}
