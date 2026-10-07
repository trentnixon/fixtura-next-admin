"use server";

import axiosInstance from "@/lib/axios";
import { toCmsApiError } from "@/lib/services/utils/cms-api-error";

export type FreeTrialWipeOutcome =
  | "wiped"
  | "already_clear"
  | "organisation_unavailable";

export type FreeTrialWipeResult =
  | { ok: true; outcome: "wiped" | "already_clear" }
  | {
      ok: false;
      outcome: "organisation_unavailable";
      message: string;
    }
  | { ok: false; message: string };

const UNMATCHED_CLIENT =
  "This client could not be matched to one organisation. Nothing was deleted.";

function isOutcome(value: unknown): value is FreeTrialWipeOutcome {
  return (
    value === "wiped" ||
    value === "already_clear" ||
    value === "organisation_unavailable"
  );
}

function readOutcome(body: unknown): FreeTrialWipeOutcome | null {
  if (!body || typeof body !== "object" || !("data" in body)) {
    return null;
  }

  const data = body.data;
  if (!data || typeof data !== "object" || !("outcome" in data)) {
    return null;
  }

  return isOutcome(data.outcome) ? data.outcome : null;
}

export async function wipeFreeTrial(
  clientId: number,
): Promise<FreeTrialWipeResult> {
  if (!Number.isInteger(clientId) || clientId <= 0) {
    return { ok: false, message: "A client id is required" };
  }

  try {
    const response = await axiosInstance.post(
      `/account/${clientId}/admin/free-trial/wipe`,
    );
    return outcomeResult(readOutcome(response.data));
  } catch (error: unknown) {
    const outcome = readOutcome(readErrorBody(error));
    if (outcome) {
      return outcomeResult(outcome);
    }

    return {
      ok: false,
      message: toCmsApiError(error, "Could not remove the free trial").message,
    };
  }
}

function outcomeResult(outcome: FreeTrialWipeOutcome | null): FreeTrialWipeResult {
  if (outcome === "wiped" || outcome === "already_clear") {
    return { ok: true, outcome };
  }

  if (outcome === "organisation_unavailable") {
    return {
      ok: false,
      outcome,
      message: UNMATCHED_CLIENT,
    };
  }

  return { ok: false, message: "Could not remove the free trial" };
}

function readErrorBody(error: unknown): unknown {
  if (!error || typeof error !== "object" || !("data" in error)) {
    return null;
  }

  return error.data;
}
