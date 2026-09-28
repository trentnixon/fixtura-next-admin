import { Badge } from "@/components/ui/badge";
import type { FixtureDisplayField } from "@/types/fixtureInsights";
import { toFixtureDisplayText } from "./fixtureDisplayText";

/**
 * Get status badge component based on fixture status
 */
export function getStatusBadge(status: FixtureDisplayField) {
  const statusText = toFixtureDisplayText(status, "");
  if (!statusText) return <Badge variant="outline">Unknown</Badge>;

  switch (statusText.toLowerCase()) {
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
    case "final":
      return <Badge variant="secondary">Completed</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{statusText}</Badge>;
  }
}

/**
 * Get row background color class based on fixture status
 */
export function getRowColorClass(status: FixtureDisplayField): string {
  const statusText = toFixtureDisplayText(status, "");
  if (!statusText) return "";
  const statusLower = statusText.toLowerCase();
  if (
    statusLower === "finished" ||
    statusLower === "completed" ||
    statusLower === "final"
  ) {
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

