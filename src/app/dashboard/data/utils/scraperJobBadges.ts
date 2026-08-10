import type { JobStatus } from "@/types/scraperLogs";

export function getStatusBadgeVariant(
  status: JobStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "completed":
      return "default";
    case "in_progress":
      return "secondary";
    case "retry_later":
      return "destructive";
    default:
      return "outline";
  }
}

export function getStatusBadgeClassName(status: JobStatus): string {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "in_progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "retry_later":
      return "bg-amber-100 text-amber-800 border-amber-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
}
