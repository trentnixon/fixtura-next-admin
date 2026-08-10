import { AxiosError } from "axios";
import { getAccountHealthTriggerErrorLabel } from "@/lib/account-health/triggerErrorLabels";

export function extractAccountHealthErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return (
      (error.response?.data as { error?: { message?: string } })?.error
        ?.message ??
      (error.response?.data as { message?: string })?.message ??
      error.message ??
      `Request failed: ${error.response?.status ?? "Unknown"}`
    );
  }
  if (error && typeof error === "object" && "message" in error) {
    const e = error as {
      message?: string;
      data?: { error?: { message?: string }; message?: string };
    };
    return (
      e.data?.error?.message ??
      (typeof e.data?.message === "string" ? e.data.message : undefined) ??
      e.message ??
      "Request failed"
    );
  }
  return error instanceof Error ? error.message : "Request failed";
}

/** Maps Strapi `error.message` reason codes to user-facing strings for POST run-on-demand. */
export function extractAccountHealthTriggerErrorMessage(
  error: unknown
): string {
  const raw = extractAccountHealthErrorMessage(error);
  return getAccountHealthTriggerErrorLabel(raw);
}
