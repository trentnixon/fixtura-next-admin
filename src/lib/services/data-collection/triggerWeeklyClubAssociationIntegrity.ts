"use server";

import type {
  GlobalDataWorkflowTriggerRequest,
  GlobalDataWorkflowTriggerResponse,
} from "@/types/globalDataWorkflowTrigger";
import { postGlobalDataWorkflowTrigger } from "@/lib/services/data-collection/postGlobalDataWorkflowTrigger";

/**
 * Syncs club → association org links via
 * POST /api/global-data-workflows/weekly-club-association-integrity/trigger.
 *
 * @see .comms/Strapi/handoff/admin-frontend-club-competition-refresh-handoff.md
 */
export async function triggerWeeklyClubAssociationIntegrity(
  payload: GlobalDataWorkflowTriggerRequest = {},
): Promise<GlobalDataWorkflowTriggerResponse> {
  return postGlobalDataWorkflowTrigger(
    "/global-data-workflows/weekly-club-association-integrity/trigger",
    payload,
    "Failed to trigger club → association link sync",
  );
}
