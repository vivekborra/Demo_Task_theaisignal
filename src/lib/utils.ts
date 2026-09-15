import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, locationOrCurrency?: string): string {
  if (!amount || amount <= 0) return "Unpaid / Competitive";

  const loc = (locationOrCurrency || "").toLowerCase();

  // Explicitly check for US / Dollar only
  const isUSD =
    loc.includes("usd") ||
    loc.includes("san francisco") ||
    loc.includes("new york") ||
    loc.includes("boston") ||
    loc.includes("seattle") ||
    loc.includes("austin") ||
    loc.includes("chicago") ||
    loc.includes("united states") ||
    loc.includes("usa");

  if (isUSD) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // All other cases (INR, Indian cities, Remote, or standard amounts) format with Rupee symbol ₹
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffInMs = now.getTime() - d.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 0) {
    const daysUntil = Math.abs(diffInDays);
    if (daysUntil === 0) return "Closes today";
    if (daysUntil === 1) return "Closes tomorrow";
    return `Closes in ${daysUntil} days`;
  }

  if (diffInDays === 0) return "Posted today";
  if (diffInDays === 1) return "Posted 1 day ago";
  if (diffInDays < 30) return `Posted ${diffInDays} days ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  return `Posted ${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
}

export function isPastDeadline(deadline: Date | string): boolean {
  return new Date(deadline).getTime() < new Date().getTime();
}
