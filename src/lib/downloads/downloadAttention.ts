export type DownloadAttentionBucket =
  | "failed"
  | "in_progress"
  | "ok"
  | "unknown";

export type DownloadAttentionFilter =
  | "all"
  | "needs_attention"
  | "in_progress"
  | "failed";

export type DownloadErrorHandlerEntry = {
  Message?: string;
  Type?: string;
};

export interface DownloadAttentionInput {
  hasError: boolean | null;
  hasBeenProcessed: boolean;
  errorHandler?: unknown;
}

export function hasNonEmptyErrorHandler(errorHandler: unknown): boolean {
  return Array.isArray(errorHandler) && errorHandler.length > 0;
}

export function isDownloadFailed(input: DownloadAttentionInput): boolean {
  if (input.hasError === true) {
    return true;
  }
  return hasNonEmptyErrorHandler(input.errorHandler);
}

export function classifyDownloadAttention(
  input: DownloadAttentionInput,
): DownloadAttentionBucket {
  if (isDownloadFailed(input)) {
    return "failed";
  }
  if (!input.hasBeenProcessed) {
    return "in_progress";
  }
  if (input.hasBeenProcessed && input.hasError === false) {
    return "ok";
  }
  return "unknown";
}

export function downloadMatchesAttentionFilter(
  bucket: DownloadAttentionBucket,
  filter: DownloadAttentionFilter,
): boolean {
  switch (filter) {
    case "all":
      return true;
    case "failed":
      return bucket === "failed";
    case "in_progress":
      return bucket === "in_progress";
    case "needs_attention":
      return bucket === "failed" || bucket === "in_progress";
    default:
      return true;
  }
}

/** Primary operator-facing error: UserErrorMessage, then first non-empty errorHandler Message. */
export function resolveDownloadPrimaryErrorMessage(
  userErrorMessage: string | null | undefined,
  errorHandler: unknown,
): string | null {
  const trimmedUser = userErrorMessage?.trim();
  if (trimmedUser) {
    return trimmedUser;
  }
  if (!Array.isArray(errorHandler)) {
    return null;
  }
  for (const entry of errorHandler) {
    if (
      entry &&
      typeof entry === "object" &&
      "Message" in entry &&
      typeof (entry as DownloadErrorHandlerEntry).Message === "string"
    ) {
      const message = (entry as DownloadErrorHandlerEntry).Message?.trim();
      if (message) {
        return message;
      }
    }
  }
  return null;
}

export function extractErrorHandlerTypes(
  errorHandler: unknown,
): string[] {
  if (!Array.isArray(errorHandler)) {
    return [];
  }
  const types = new Set<string>();
  for (const entry of errorHandler) {
    if (
      entry &&
      typeof entry === "object" &&
      "Type" in entry &&
      typeof (entry as DownloadErrorHandlerEntry).Type === "string"
    ) {
      const type = (entry as DownloadErrorHandlerEntry).Type?.trim();
      if (type) {
        types.add(type);
      }
    }
  }
  return [...types];
}

/** Fleet row badge: prefer CMS `attention`, else classify from flags. */
export function resolveFleetQueueRowAttention(row: {
  attention?: DownloadAttentionBucket | null;
  hasError: boolean | null;
  hasBeenProcessed: boolean;
  errorHandler?: unknown;
}): DownloadAttentionBucket {
  if (
    row.attention === "failed" ||
    row.attention === "in_progress" ||
    row.attention === "ok" ||
    row.attention === "unknown"
  ) {
    return row.attention;
  }
  return classifyDownloadAttention({
    hasError: row.hasError,
    hasBeenProcessed: row.hasBeenProcessed,
    errorHandler: row.errorHandler,
  });
}

export function downloadAttentionLabel(
  bucket: DownloadAttentionBucket,
): string {
  switch (bucket) {
    case "failed":
      return "Failed";
    case "in_progress":
      return "In progress";
    case "ok":
      return "OK";
    case "unknown":
      return "Unknown";
  }
}
