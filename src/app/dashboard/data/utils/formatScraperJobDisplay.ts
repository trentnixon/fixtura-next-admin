import type { JobSummary } from "@/types/scraperLogs";

/** e.g. 15:50:19 — 24h local time for the Started column. */
export function formatScraperJobTime(dateString: string | null): string {
  if (!dateString) return "-";

  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "-";

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  } catch {
    return "-";
  }
}

/** e.g. Today, 1 day ago — for the Days Ago column. */
export function formatScraperJobDaysAgo(dateString: string | null): string {
  if (!dateString) return "-";

  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "-";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  } catch {
    return "-";
  }
}

/** Truncate long IDs for table cells; full value stays in `title`. */
export function truncateMiddle(value: string, maxLength = 44): string {
  if (value.length <= maxLength) return value;

  const keep = Math.floor((maxLength - 1) / 2);
  return `${value.slice(0, keep)}…${value.slice(-keep)}`;
}

/** Secondary line + tooltip for job identity (avoids repeating job / bull / run columns). */
export function getJobIdentityDisplay(
  job: Pick<JobSummary, "jobId" | "runId" | "bullJobId">,
): { label: string; title: string } {
  const titleParts = [`Job ID: ${job.jobId}`];

  if (job.runId) titleParts.push(`Run ID: ${job.runId}`);
  if (job.bullJobId && job.bullJobId !== job.jobId) {
    titleParts.push(`Bull job: ${job.bullJobId}`);
  }

  const preferred =
    job.runId && job.runId !== job.jobId ? job.runId : job.jobId;

  return {
    label: truncateMiddle(preferred),
    title: titleParts.join("\n"),
  };
}
