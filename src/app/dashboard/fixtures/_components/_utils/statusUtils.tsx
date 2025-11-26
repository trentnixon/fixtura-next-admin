import { Badge } from "@/components/ui/badge";

/**
 * Get status badge component based on fixture status
 */
export function getStatusBadge(status: string | null) {
  if (!status) return <Badge variant="outline">Unknown</Badge>;

  switch (status.toLowerCase()) {
    case "upcoming":
    case "scheduled":
      return <Badge variant="outline">Scheduled</Badge>;
    case "in_progress":
    case "inprogress":
      return (
        <Badge className="bg-success-500 text-white border-0">
          In Progress
        </Badge>
      );
    case "finished":
    case "completed":
      return <Badge variant="secondary">Completed</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

/**
 * Get row background color class based on fixture status
 */
export function getRowColorClass(status: string | null): string {
  if (!status) return "";
  const statusLower = status.toLowerCase();
  if (statusLower === "finished" || statusLower === "completed") {
    return "bg-success-50/50 hover:bg-success-50";
  }
  if (statusLower === "upcoming" || statusLower === "scheduled") {
    return "bg-blue-50/50 hover:bg-blue-50";
  }
  if (statusLower === "in_progress" || statusLower === "inprogress") {
    return "bg-warning-50/50 hover:bg-warning-50";
  }
  if (statusLower === "cancelled") {
    return "bg-error-50/50 hover:bg-error-50";
  }
  return "";
}

