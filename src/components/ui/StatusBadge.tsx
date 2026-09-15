import React from "react";
import { Badge } from "./Badge";
import { CheckCircle2, Clock, XCircle, Users, Award, FileText } from "lucide-react";

export type ApplicationStatusType =
  | "APPLIED"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "SELECTED"
  | "REJECTED";

export type InternshipStatusType =
  | "DRAFT"
  | "PUBLISHED"
  | "CLOSED"
  | "EXPIRED";

interface ApplicationStatusBadgeProps {
  status: ApplicationStatusType;
  size?: "sm" | "md";
}

export function ApplicationStatusBadge({ status, size = "md" }: ApplicationStatusBadgeProps) {
  switch (status) {
    case "APPLIED":
      return (
        <Badge variant="info" size={size} className="gap-1">
          <FileText className="w-3 h-3" />
          <span>Applied</span>
        </Badge>
      );
    case "SHORTLISTED":
      return (
        <Badge variant="purple" size={size} className="gap-1">
          <Users className="w-3 h-3" />
          <span>Shortlisted</span>
        </Badge>
      );
    case "INTERVIEW":
      return (
        <Badge variant="warning" size={size} className="gap-1">
          <Clock className="w-3 h-3" />
          <span>Interview Scheduled</span>
        </Badge>
      );
    case "SELECTED":
      return (
        <Badge variant="success" size={size} className="gap-1">
          <Award className="w-3 h-3" />
          <span>Selected / Offered</span>
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge variant="danger" size={size} className="gap-1">
          <XCircle className="w-3 h-3" />
          <span>Not Selected</span>
        </Badge>
      );
    default:
      return <Badge size={size}>{status}</Badge>;
  }
}

interface InternshipStatusBadgeProps {
  status: InternshipStatusType;
  size?: "sm" | "md";
}

export function InternshipStatusBadge({ status, size = "md" }: InternshipStatusBadgeProps) {
  switch (status) {
    case "PUBLISHED":
      return (
        <Badge variant="success" size={size} className="gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>Active</span>
        </Badge>
      );
    case "DRAFT":
      return (
        <Badge variant="default" size={size} className="gap-1">
          <FileText className="w-3 h-3" />
          <span>Draft</span>
        </Badge>
      );
    case "CLOSED":
      return (
        <Badge variant="danger" size={size} className="gap-1">
          <XCircle className="w-3 h-3" />
          <span>Closed</span>
        </Badge>
      );
    case "EXPIRED":
      return (
        <Badge variant="warning" size={size} className="gap-1">
          <Clock className="w-3 h-3" />
          <span>Expired</span>
        </Badge>
      );
    default:
      return <Badge size={size}>{status}</Badge>;
  }
}
