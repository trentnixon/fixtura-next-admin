"use server";

import axiosInstance from "@/lib/axios";
import type {
  AdminInvoicePatchPayload,
  AdminInvoicePatchResponse,
} from "@/types/adminInvoice";
import {
  assertNonEmptyPatchPayload,
  assertValidInvoiceRequestId,
  parseAdminInvoicePatchResponse,
} from "@/lib/services/orders/adminInvoicePayloads";
import { throwSerializableCmsApiError } from "@/lib/services/utils/cms-api-error";

const ENDPOINT = "/orders/admin/invoices";

export async function updateAdminInvoice(
  invoiceRequestId: number | string,
  payload: AdminInvoicePatchPayload
): Promise<AdminInvoicePatchResponse> {
  try {
    const id = assertValidInvoiceRequestId(invoiceRequestId);
    assertNonEmptyPatchPayload(payload);

    const response = await axiosInstance.patch(
      `${ENDPOINT}/${id}`,
      payload
    );
    return parseAdminInvoicePatchResponse(response.data);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (error.message.startsWith("Invalid admin invoice") ||
        error.message.startsWith("Invoice request id") ||
        error.message.startsWith("At least one invoiceRequest"))
    ) {
      throw error;
    }
    throwSerializableCmsApiError(error, "Failed to update admin invoice.");
  }
}
