import { AxiosError } from "axios";

/** Known CMS error codes for admin invoice workspace (and shared Strapi patterns). */
export type AdminInvoiceCmsErrorCode =
  | "EMPTY_PATCH"
  | "STALE_INVOICE_REQUEST"
  | "STALE_ORDER"
  | "LINKED_ORDER_ACCOUNT_MISMATCH"
  | "LINKED_ORDER_REQUIRED"
  | `UNSUPPORTED_FIELD:${string}`
  | `INVALID_${string}`
  | `INVALID_INVOICE_REQUEST_TRANSITION:${string}`;

type StrapiErrorBody = {
  error?: {
    message?: string;
    name?: string;
    details?: unknown;
    status?: number;
    code?: string;
  };
  message?: string;
  code?: string;
};

type InterceptorRejectedError = {
  message?: string;
  code?: string;
  status?: number | null;
  data?: unknown;
  isNetworkError?: boolean;
};

/** Serializable CMS error shape that survives Next.js server-action boundaries. */
export type CmsApiErrorDTO = {
  name: "CmsApiError";
  message: string;
  status: number | null;
  cmsCode: string | null;
  details: unknown;
  isNetworkError: boolean;
};

/**
 * Typed CMS/API error preserved through the axios interceptor boundary.
 */
export class CmsApiError extends Error {
  readonly status: number | null;
  readonly cmsCode: string | null;
  readonly details: unknown;
  readonly isNetworkError: boolean;
  readonly cause?: unknown;

  constructor(options: {
    message: string;
    status?: number | null;
    cmsCode?: string | null;
    details?: unknown;
    isNetworkError?: boolean;
    cause?: unknown;
  }) {
    super(options.message);
    this.name = "CmsApiError";
    this.status = options.status ?? null;
    this.cmsCode = options.cmsCode ?? null;
    this.details = options.details ?? null;
    this.isNetworkError = options.isNetworkError ?? false;
    this.cause = options.cause;
  }
}

function isCmsApiErrorDTO(error: unknown): error is CmsApiErrorDTO {
  return (
    error != null &&
    typeof error === "object" &&
    (error as CmsApiErrorDTO).name === "CmsApiError" &&
    typeof (error as CmsApiErrorDTO).message === "string"
  );
}

export function toCmsApiErrorDTO(error: CmsApiError): CmsApiErrorDTO {
  return {
    name: "CmsApiError",
    message: error.message,
    status: error.status,
    cmsCode: error.cmsCode,
    details: error.details,
    isNetworkError: error.isNetworkError,
  };
}

/** Throws a plain object that survives server-action serialization. */
export function throwSerializableCmsApiError(
  error: unknown,
  fallbackMessage = "Request failed"
): never {
  throw toCmsApiErrorDTO(toCmsApiError(error, fallbackMessage));
}

export function isCmsApiError(error: unknown): error is CmsApiError {
  if (error instanceof CmsApiError) {
    return true;
  }
  return isCmsApiErrorDTO(error);
}

export function isStaleConflict(error: unknown): boolean {
  const normalized = toCmsApiError(error);
  if (normalized.status !== 409) {
    return false;
  }
  const code = normalized.cmsCode ?? "";
  return code === "STALE_INVOICE_REQUEST" || code === "STALE_ORDER";
}

export function cmsCodeMatchesPrefix(
  code: string | null | undefined,
  prefix: string
): boolean {
  return typeof code === "string" && code.startsWith(prefix);
}

function readStrapiBody(data: unknown): {
  message: string | null;
  cmsCode: string | null;
  details: unknown;
} {
  if (typeof data === "string" && data.trim()) {
    return { message: data.trim(), cmsCode: null, details: null };
  }

  if (!data || typeof data !== "object") {
    return { message: null, cmsCode: null, details: null };
  }

  const body = data as StrapiErrorBody;
  const nested = body.error;
  const message =
    (typeof nested?.message === "string" ? nested.message : null) ??
    (typeof body.message === "string" ? body.message : null);

  // Prefer a dedicated machine-readable code; do not treat message as code.
  const cmsCode =
    (typeof body.code === "string" ? body.code : null) ??
    (typeof nested?.code === "string" ? nested.code : null) ??
    (typeof nested?.name === "string" &&
    nested.name !== "ApplicationError" &&
    nested.name !== "ValidationError"
      ? nested.name
      : null) ??
    // Legacy CMS shapes that put the code in message only.
    (typeof nested?.message === "string" &&
    looksLikeCmsErrorCode(nested.message)
      ? nested.message
      : null) ??
    (typeof body.message === "string" && looksLikeCmsErrorCode(body.message)
      ? body.message
      : null);

  return {
    message,
    cmsCode,
    details: nested?.details ?? null,
  };
}

function looksLikeCmsErrorCode(value: string): boolean {
  return (
    /^[A-Z][A-Z0-9_]+(?::.+)?$/.test(value) &&
    !value.includes(" ") &&
    value.length < 120
  );
}

function readAxiosLikeError(error: AxiosError): {
  status: number | null;
  data: unknown;
  message: string;
  isNetworkError: boolean;
} {
  const status = error.response?.status ?? null;
  const data = error.response?.data;
  const isNetworkError = !error.response && !!error.request;
  return {
    status,
    data,
    message: error.message,
    isNetworkError,
  };
}

function readInterceptorError(error: InterceptorRejectedError): {
  status: number | null;
  data: unknown;
  message: string;
  isNetworkError: boolean;
} {
  return {
    status: typeof error.status === "number" ? error.status : null,
    data: error.data,
    message: error.message ?? "Request failed",
    isNetworkError: Boolean(error.isNetworkError),
  };
}

function defaultMessageForStatus(
  status: number | null,
  fallbackMessage: string
): string {
  if (status === 403) {
    return "You do not have permission to perform this action.";
  }
  if (status === 404) {
    return "The requested resource was not found.";
  }
  if (status === 500) {
    return "An unexpected server error occurred. Please try again later.";
  }
  return fallbackMessage;
}

/**
 * Normalizes axios interceptor rejections, raw AxiosError, duck-typed DTOs,
 * and CmsApiError into a typed CmsApiError with HTTP status and CMS code preserved.
 */
export function toCmsApiError(
  error: unknown,
  fallbackMessage = "Request failed"
): CmsApiError {
  if (error instanceof CmsApiError) {
    return error;
  }

  if (isCmsApiErrorDTO(error)) {
    return new CmsApiError({
      message: error.message,
      status: error.status,
      cmsCode: error.cmsCode,
      details: error.details,
      isNetworkError: error.isNetworkError,
      cause: error,
    });
  }

  if (error instanceof AxiosError) {
    const parts = readAxiosLikeError(error);
    const body = readStrapiBody(parts.data);
    const message =
      body.message ??
      defaultMessageForStatus(parts.status, parts.message || fallbackMessage);

    return new CmsApiError({
      message,
      status: parts.status,
      cmsCode: body.cmsCode,
      details: body.details,
      isNetworkError: parts.isNetworkError,
      cause: error,
    });
  }

  if (error && typeof error === "object" && "status" in error) {
    const parts = readInterceptorError(error as InterceptorRejectedError);
    const body = readStrapiBody(parts.data);

    if (parts.isNetworkError) {
      return new CmsApiError({
        message:
          "Network error: Unable to connect to the backend server. Please ensure the Strapi server is running.",
        status: null,
        cmsCode: null,
        details: parts.data,
        isNetworkError: true,
        cause: error,
      });
    }

    const message =
      body.message ??
      defaultMessageForStatus(parts.status, parts.message || fallbackMessage);

    return new CmsApiError({
      message,
      status: parts.status,
      cmsCode: body.cmsCode,
      details: body.details,
      isNetworkError: false,
      cause: error,
    });
  }

  if (error instanceof Error) {
    return new CmsApiError({
      message: error.message || fallbackMessage,
      status: null,
      cmsCode: null,
      details: null,
      isNetworkError: false,
      cause: error,
    });
  }

  return new CmsApiError({
    message: fallbackMessage,
    status: null,
    cmsCode: null,
    details: null,
    isNetworkError: false,
    cause: error,
  });
}
