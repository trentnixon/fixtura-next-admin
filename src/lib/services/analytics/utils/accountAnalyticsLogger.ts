/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from "axios";

/**
 * Logs the start of account analytics fetch
 */
export function logFetchStart(accountId: string): void {
  console.log("[fetchAccountAnalytics] Input accountId:", accountId);
  console.log(
    "[fetchAccountAnalytics] Full URL:",
    `/orders/analytics/account/${accountId}`
  );
}

/**
 * Logs the full API response for debugging
 */
export function logApiResponse(data: any): void {
  console.log(
    "[fetchAccountAnalytics] Full response:",
    JSON.stringify(data, null, 2)
  );
}

/**
 * Logs Axios-specific errors
 */
export function logAxiosError(error: AxiosError, accountId: string): void {
  console.error("[Axios Error] Failed to fetch account analytics:", {
    message: error.message,
    url: error.config?.url,
    method: error.config?.method,
    status: error.response?.status,
    data: error.response?.data,
    headers: error.response?.headers,
    accountId,
  });
}

/**
 * Logs unexpected (non-Axios) errors
 */
export function logUnexpectedError(error: unknown): void {
  console.error("[Unexpected Error] Failed to fetch account analytics:", error);
}
