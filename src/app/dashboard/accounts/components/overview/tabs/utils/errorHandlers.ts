/**
 * Utility function to parse and format error messages for account sync operations
 * Provides user-friendly error messages based on error type
 */
export function parseAccountSyncError(error: Error): {
  title: string;
  message: string;
  type: "error" | "warning" | "info";
} {
  const errorMessage = error.message.toLowerCase();

  // Handle "already in updating phase" error
  if (
    errorMessage.includes("already in an updating phase") ||
    errorMessage.includes("already updating")
  ) {
    return {
      title: "Already Updating",
      message:
        "This account is already being updated. Please wait for the current sync to complete before starting a new one.",
      type: "warning",
    };
  }

  // Handle "account not found" error
  if (
    errorMessage.includes("not found") ||
    errorMessage.includes("404") ||
    (errorMessage.includes("account with id") &&
      errorMessage.includes("not found"))
  ) {
    return {
      title: "Account Not Found",
      message:
        "The account could not be found. Please verify the account ID and try again.",
      type: "error",
    };
  }

  // Handle validation errors
  if (
    errorMessage.includes("must be") ||
    errorMessage.includes("required") ||
    errorMessage.includes("invalid")
  ) {
    let message = "Invalid input provided. ";

    if (errorMessage.includes("accountid")) {
      message += "Account ID must be a valid number.";
    } else if (
      errorMessage.includes("accounttype") ||
      errorMessage.includes("account type")
    ) {
      message +=
        'Account type must be exactly "CLUB" or "ASSOCIATION" (case-sensitive).';
    } else {
      message += error.message;
    }

    return {
      title: "Validation Error",
      message,
      type: "error",
    };
  }

  // Handle network/server errors
  if (
    errorMessage.includes("network") ||
    errorMessage.includes("failed to fetch") ||
    errorMessage.includes("500") ||
    errorMessage.includes("server error")
  ) {
    return {
      title: "Server Error",
      message:
        "A server error occurred while processing your request. Please try again in a moment.",
      type: "error",
    };
  }

  // Handle timeout errors (including HeadersTimeoutError from Undici)
  if (
    errorMessage.includes("timeout") ||
    errorMessage.includes("timed out") ||
    errorMessage.includes("headers timeout") ||
    errorMessage.includes("headers_timeout") ||
    errorMessage.includes("und_err_headers_timeout")
  ) {
    return {
      title: "Request Timeout",
      message:
        "The request took too long to complete. The server may be slow or overloaded. Please try again in a moment.",
      type: "error",
    };
  }

  // Default error message
  return {
    title: "Error",
    message: error.message || "An unexpected error occurred. Please try again.",
    type: "error",
  };
}

/**
 * Display error notification (placeholder for toast system)
 * TODO: Replace with actual toast notification when toast system is implemented
 */
export function showErrorNotification(
  title: string,
  message: string,
  type: "error" | "warning" | "info" = "error"
): void {
  // For now, use console.error and alert
  // TODO: Replace with toast notification
  console.error(`[${type.toUpperCase()}] ${title}:`, message);

  // Use alert as temporary feedback until toast is implemented
  alert(`${title}\n\n${message}`);
}

/**
 * Display success notification (placeholder for toast system)
 * TODO: Replace with actual toast notification when toast system is implemented
 */
export function showSuccessNotification(message: string): void {
  // For now, use console.log
  // TODO: Replace with toast notification
  console.log("[SUCCESS]:", message);
}
