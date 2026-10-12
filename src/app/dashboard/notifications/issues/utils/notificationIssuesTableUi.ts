import type { BadgeProps } from "@/components/ui/badge";
import type { NotificationIssueArtifact } from "@/types/notificationIssues";
import { truncateMiddle } from "@/app/dashboard/data/utils/formatScraperJobDisplay";
/** Relative time for issue cards (always “… ago”, never a second calendar date). */
export function formatIssueRelative(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const diffMs = Math.max(0, Date.now() - d.getTime());
  const diffMinutes = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMinutes < 1) return "just now";
  if (diffHours < 1) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  }
  if (diffDays < 1) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  }
  return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
}

export function formatIssueWhen(iso: string | null): {
  label: string;
  title: string;
  relative: string;
} {
  if (!iso) {
    return { label: "—", title: "", relative: "" };
  }
  try {
    const d = new Date(iso);
    return {
      label: d.toLocaleString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      title: d.toLocaleString("en-AU"),
      relative: formatIssueRelative(iso),
    };
  } catch {
    return { label: iso, title: iso, relative: "" };
  }
}

export function formatIssueUrl(url: string): { label: string; title: string } {
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split("/").filter(Boolean);
    const tail = segments.slice(-2).join("/") || parsed.hostname;
    return {
      label: tail.length > 48 ? truncateMiddle(tail, 48) : tail,
      title: url,
    };
  } catch {
    return {
      label: truncateMiddle(url, 48),
      title: url,
    };
  }
}

export function stepBadgeVariant(
  step: string | null | undefined,
): NonNullable<BadgeProps["variant"]> {
  switch (step) {
    case "request_timeout":
    case "content_wait":
      return "warning";
    case "page_not_found":
    case "playhq_upstream_error":
      return "destructive";
    case "selector_drift":
      return "accent";
    default:
      return "outline";
  }
}

export function formatStepLabel(step: string | null | undefined): string {
  if (!step) return "unknown";
  return step.replace(/_/g, " ");
}

/** Prefer screenshot-type artifact; CMS may attach traces/HAR on the same row. */
export function pickIssueScreenshotArtifact(
  artifacts: NotificationIssueArtifact[] | undefined,
): NotificationIssueArtifact | null {
  if (!artifacts?.length) return null;
  return (
    artifacts.find(
      (a) =>
        a.fileUrl &&
        (a.artifactType === "screenshot" ||
          (a.contentType ?? "").startsWith("image/")),
    ) ??
    artifacts.find((a) => a.fileUrl) ??
    null
  );
}
