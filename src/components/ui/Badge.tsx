import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-slate-800/80 text-slate-200 border border-white/10",
    success: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/25",
    warning: "bg-amber-500/10 text-amber-300 border border-amber-500/25",
    danger: "bg-rose-500/10 text-rose-300 border border-rose-500/25",
    info: "bg-blue-500/10 text-blue-300 border border-blue-500/25",
    purple: "bg-violet-500/10 text-violet-300 border border-violet-500/25",
    outline: "bg-transparent text-slate-300 border border-white/10",
  };

  const sizes = {
    sm: "text-[11px] px-2 py-0.5 font-medium",
    md: "text-xs px-2.5 py-1 font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border tracking-wide",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
