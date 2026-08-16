import type { GlobalDataWorkflowTriggerResponse } from "@/types/globalDataWorkflowTrigger";

export interface GlobalDataWorkflowToastContent {
  title: string;
  description: string;
  variant: "success" | "warning";
}

/**
 * Formats toast content for a global data workflow trigger response.
 * @throws Error when status is "failed"
 */
export function formatGlobalDataWorkflowToast(
  response: GlobalDataWorkflowTriggerResponse,
): GlobalDataWorkflowToastContent {
  if (response.status === "failed" || !response.success) {
    throw new Error(
      response.warnings.length > 0
        ? response.warnings.map((w) => w.message).join("; ")
        : "Workflow trigger failed",
    );
  }

  const title = `Queued ${response.queuedCount} batch jobs (${response.itemCount} items)`;
  const parts = [
    `runKey: ${response.runKey}`,
    `runId: ${response.runId}`,
    `queue: ${response.queueName}`,
  ];

  if (response.status === "queued-with-warnings" && response.warnings.length > 0) {
    parts.push(`${response.warnings.length} warning(s) — check scraper logs`);
  }

  if (response.rejectedCount > 0) {
    parts.push(`${response.rejectedCount} rejected`);
  }

  return {
    title,
    description: parts.join(" · "),
    variant:
      response.status === "queued-with-warnings" ? "warning" : "success",
  };
}
