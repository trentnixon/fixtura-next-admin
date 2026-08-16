"use server";

import type {
  GlobalDataWorkflowTriggerRequest,
  GlobalDataWorkflowTriggerResponse,
} from "@/types/globalDataWorkflowTrigger";
import { postGlobalDataWorkflowTrigger } from "@/lib/services/data-collection/postGlobalDataWorkflowTrigger";

/**
 * Triggers full-catalogue club competition refresh via
 * POST /api/global-data-workflows/club-competition-refresh/trigger.
 *
 * @see .comms/Strapi/handoff/admin-frontend-club-competition-refresh-handoff.md
 */
export async function triggerClubCompetitionRefresh(
  payload: GlobalDataWorkflowTriggerRequest = {},
): Promise<GlobalDataWorkflowTriggerResponse> {
  return postGlobalDataWorkflowTrigger(
    "/global-data-workflows/club-competition-refresh/trigger",
    payload,
    "Failed to trigger club competition refresh",
  );
}
