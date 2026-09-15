import React from "react";
import { Check, Clock, X } from "lucide-react";
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
        {/* Connecting line — dark for the dark theme */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-slate-700 -z-0" />

        {STAGES.map((stage, idx) => {
          const isCompleted = !isRejected && idx < activeIndex;
          const isCurrent = !isRejected && idx === activeIndex;

          return (
            <div
              key={stage.key}
              className="relative z-10 flex flex-col items-center group"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all shadow-sm ${
                  isCompleted
                    ? "bg-emerald-500 text-white"
                    : isCurrent
                    ? "bg-blue-600 text-white ring-4 ring-blue-500/30 animate-pulse"
                    : "bg-slate-700 border border-slate-600 text-slate-400"
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
                    ? "text-blue-400 font-semibold"
                    : isCompleted
                    ? "text-emerald-400 font-medium"
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
        <div
          className="mt-4 p-3 rounded-lg flex items-center gap-2.5 text-xs text-rose-300"
          style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)" }}
        >
          <X className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            Application Not Selected. Thank you for your interest. We encourage
            you to explore other opportunities!
          </span>
        </div>
      )}
    </div>
  );
}
