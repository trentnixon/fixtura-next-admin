"use server";

import type {
  GlobalDataWorkflowTriggerRequest,
  GlobalDataWorkflowTriggerResponse,
} from "@/types/globalDataWorkflowTrigger";
import { postGlobalDataWorkflowTrigger } from "@/lib/services/data-collection/postGlobalDataWorkflowTrigger";

/**
 * Syncs association → club org links via
 * POST /api/global-data-workflows/weekly-association-club-integrity/trigger.
 *
 * @see .comms/Strapi/handoff/admin-frontend-club-competition-refresh-handoff.md
 */
export async function triggerWeeklyAssociationClubIntegrity(
  payload: GlobalDataWorkflowTriggerRequest = {},
): Promise<GlobalDataWorkflowTriggerResponse> {
  return postGlobalDataWorkflowTrigger(
    "/global-data-workflows/weekly-association-club-integrity/trigger",
    payload,
    "Failed to trigger association → club link sync",
  );
}
