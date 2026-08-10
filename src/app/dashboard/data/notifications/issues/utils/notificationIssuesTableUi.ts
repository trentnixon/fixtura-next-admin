import type { BadgeProps } from "@/components/ui/badge";
import type { NotificationIssueArtifact } from "@/types/notificationIssues";
import { truncateMiddle } from "../../../utils/formatScraperJobDisplay";

export function formatIssueWhen(iso: string | null): {
  label: string;
  title: string;
} {
  if (!iso) {
    return { label: "—", title: "" };
  }
  try {
    const d = new Date(iso);
    return {
      label: d.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      title: d.toLocaleString(),
    };
  } catch {
    return { label: iso, title: iso };
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
  step: string | null | undefined
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
  artifacts: NotificationIssueArtifact[] | undefined
): NotificationIssueArtifact | null {
  if (!artifacts?.length) return null;
  return (
    artifacts.find(
      (a) =>
        a.fileUrl &&
        (a.artifactType === "screenshot" ||
          (a.contentType ?? "").startsWith("image/"))
    ) ??
    artifacts.find((a) => a.fileUrl) ??
    null
  );
}
