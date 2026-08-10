import {
  cmsCodeMatchesPrefix,
  isCmsApiError,
  isStaleConflict,
} from "@/lib/services/utils/cms-api-error";

export type AdminInvoiceErrorPresentation = {
  title: string;
  description: string;
  severity: "error" | "warning";
  /** When true, show a persistent inline alert in addition to toast. */
  showInlineAlert?: boolean;
};

export function getAdminInvoiceErrorPresentation(
  error: unknown
): AdminInvoiceErrorPresentation {
  if (isStaleConflict(error)) {
    const code = isCmsApiError(error) ? error.cmsCode : null;
    if (code === "STALE_ORDER") {
      return {
        title: "Linked order changed",
        description:
          "The linked order was updated elsewhere. Review the latest server state before saving again.",
        severity: "warning",
      };
    }
    return {
      title: "Invoice request changed",
      description:
        "This invoice request was updated elsewhere. Review the latest server state before saving again.",
      severity: "warning",
    };
  }

  if (isCmsApiError(error)) {
    const code = error.cmsCode ?? "";

    if (code === "LINKED_ORDER_REQUIRED") {
      return {
        title: "Linked order required",
        description:
          "This invoice request has no linked order. Creating or marking an invoice paid is blocked until an order is recovered or linked through an approved workflow.",
        severity: "warning",
        showInlineAlert: true,
      };
    }

    if (code === "LINKED_ORDER_ACCOUNT_MISMATCH") {
      return {
        title: "Order account mismatch",
        description:
          "The linked order belongs to a different account than this invoice request. Review the record with an administrator before making further changes.",
        severity: "error",
        showInlineAlert: true,
      };
    }

    if (code === "INVOICE_URL_REQUIRED") {
      return {
        title: "Invoice URL required",
        description:
          error.message ||
          "Provide at least one valid hosted invoice URL or PDF URL before creating the invoice.",
        severity: "error",
      };
    }

    if (code === "INVALID_INVOICEPDFURL" || code === "INVALID_HOSTEDINVOICEURL") {
      return {
        title: "Invalid invoice URL",
        description:
          error.message ||
          "Invoice URLs must be absolute http:// or https:// addresses.",
        severity: "error",
      };
    }

    if (code === "BILLING_EMAIL_REQUIRED") {
      return {
        title: "Billing email required",
        description:
          error.message ||
          "A billing email is required before creating the invoice.",
        severity: "error",
      };
    }

    if (code === "INVALID_BILLING_EMAIL") {
      return {
        title: "Invalid billing email",
        description:
          error.message || "Enter a valid billing email address.",
        severity: "error",
      };
    }

    if (cmsCodeMatchesPrefix(code, "INVALID_INVOICE_REQUEST_TRANSITION:")) {
      return {
        title: "Invalid status transition",
        description:
          error.message ||
          "That status change is not allowed for the current invoice request state.",
        severity: "error",
      };
    }

    if (code === "EMPTY_PATCH") {
      return {
        title: "Nothing to save",
        description: "No invoice request or order fields were changed.",
        severity: "warning",
      };
    }

    if (
      cmsCodeMatchesPrefix(code, "INVALID_") ||
      cmsCodeMatchesPrefix(code, "UNSUPPORTED_FIELD:")
    ) {
      return {
        title: "Validation error",
        description: error.message || "One or more fields failed validation.",
        severity: "error",
      };
    }

    if (error.isNetworkError) {
      return {
        title: "Network error",
        description: error.message,
        severity: "error",
      };
    }

    if (error.status === 403) {
      return {
        title: "Permission denied",
        description:
          "Verify the Strapi staff token includes adminInvoicesList, adminInvoicesDetail, and adminInvoicesUpdate.",
        severity: "error",
      };
    }

    if (error.status === 404) {
      return {
        title: "Invoice not found",
        description: error.message,
        severity: "error",
      };
    }

    if (error.status === 500) {
      return {
        title: "Server error",
        description: error.message,
        severity: "error",
      };
    }

    return {
      title: "Save failed",
      description: error.message,
      severity: "error",
    };
  }

  if (error instanceof Error) {
    return {
      title: "Save failed",
      description: error.message,
      severity: "error",
    };
  }

  return {
    title: "Save failed",
    description: "An unexpected error occurred.",
    severity: "error",
  };
}

export function getBlockedSaveMessage(
  reason: "missing_concurrency" | "issuance_requires_order"
): AdminInvoiceErrorPresentation {
  if (reason === "missing_concurrency") {
    return {
      title: "Cannot save yet",
      description:
        "Concurrency timestamps are missing from this record. Refresh the page and try again.",
      severity: "warning",
    };
  }

  return {
    title: "Linked order required",
    description:
      "Creating an invoice requires a linked order. Recover or link an order before moving to Invoice created.",
    severity: "warning",
    showInlineAlert: true,
  };
}
