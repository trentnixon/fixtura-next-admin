import { AxiosError } from "axios";

/** Reads HTTP status from Axios or the axios interceptor's rejected shape. */
export function getAccountAssetRunHttpStatus(error: unknown): number | null {
  if (error && typeof error === "object" && "status" in error) {
    const s = (error as { status: unknown }).status;
    return typeof s === "number" ? s : null;
  }
  if (error instanceof AxiosError && error.response) {
    return error.response.status;
  }
  return null;
}

export function extractAccountAssetRunErrorMessage(error: unknown): string {
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
