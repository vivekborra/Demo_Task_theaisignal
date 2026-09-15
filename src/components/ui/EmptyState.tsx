import React from "react";
import { LucideIcon, Inbox } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`text-center py-12 px-4 rounded-xl border border-dashed border-white/[0.08] bg-slate-900/50 flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
      {actionLabel && (
        <>
          {actionHref ? (
            <a href={actionHref}>
              <Button size="sm">{actionLabel}</Button>
            </a>
          ) : onAction ? (
            <Button size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null}
        </>
      )}
    </div>
  );
}
