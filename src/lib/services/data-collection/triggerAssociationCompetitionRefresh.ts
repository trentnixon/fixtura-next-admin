"use server";

import type {
  GlobalDataWorkflowTriggerRequest,
  GlobalDataWorkflowTriggerResponse,
} from "@/types/globalDataWorkflowTrigger";
import { postGlobalDataWorkflowTrigger } from "@/lib/services/data-collection/postGlobalDataWorkflowTrigger";

/**
 * Triggers full-catalogue association competition refresh via
 * POST /api/global-data-workflows/association-competition-refresh/trigger.
 * Refreshes competitions only — does not fix club membership links.
 *
 * @see .comms/Strapi/handoff/admin-frontend-club-competition-refresh-handoff.md
 */
export async function triggerAssociationCompetitionRefresh(
  payload: GlobalDataWorkflowTriggerRequest = {},
): Promise<GlobalDataWorkflowTriggerResponse> {
  return postGlobalDataWorkflowTrigger(
    "/global-data-workflows/association-competition-refresh/trigger",
    payload,
    "Failed to trigger association competition refresh",
  );
}
