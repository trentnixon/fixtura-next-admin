/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Shared error handler for API services.
 * Standardizes errors returned by the axiosInstance interceptor.
 */
export function handleApiError(error: any, origin: string): never {
  const status = error.status || "N/A";
  const errorData = error.data?.error || error.data || {};
  let msg = errorData.message || error.message || "Unknown error";

  // Check for connection/network issues
  if (error.isNetworkError) {
    msg = `Network Error: Unable to connect to the backend server. Please ensure the Strapi server is running.`;
  }

  console.error(`[API Error] ${origin} (${status}):`, { msg });

  // Handle common CMS route shadowing issues
  if (msg.includes("Must be a number") || msg.includes("Invalid") && msg.includes("ID")) {
    throw new Error(
      `Endpoint Collision: The backend is misinterpreting the request path as an ID. Please check backend route ordering.`
    );
  }

  throw new Error(msg);
}
