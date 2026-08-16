/**
 * Shared types for CMS global data workflow trigger endpoints.
 *
 * @see .comms/Strapi/handoff/admin-frontend-club-competition-refresh-handoff.md
 */

export interface GlobalDataWorkflowWarning {
  batchIndex: number;
  code: string;
  message: string;
}

export interface GlobalDataWorkflowJob {
  jobId: string;
  batchIndex: number;
  targetCount: number;
}

export interface GlobalDataWorkflowTriggerResponse {
  success: boolean;
  status: "queued" | "queued-with-warnings" | "failed";
  queueName: string;
  runId: string;
  runKey: string;
  jobId: string | null;
  queuedCount: number;
  itemCount: number;
  rejectedCount: number;
  warnings: GlobalDataWorkflowWarning[];
  jobs: GlobalDataWorkflowJob[];
}

export interface GlobalDataWorkflowTriggerRequest {
  idempotencyKey?: string;
}
