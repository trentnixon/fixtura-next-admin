"use server";

import axiosInstance from "@/lib/axios";
import type { AdminInvoiceAggregate } from "@/types/adminInvoice";
import {
  assertValidInvoiceRequestId,
  parseAdminInvoiceAggregate,
} from "@/lib/services/orders/adminInvoicePayloads";
import { throwSerializableCmsApiError } from "@/lib/services/utils/cms-api-error";

const ENDPOINT = "/orders/admin/invoices";

export async function fetchAdminInvoiceDetail(
  invoiceRequestId: number | string
): Promise<AdminInvoiceAggregate> {
  try {
    const id = assertValidInvoiceRequestId(invoiceRequestId);
    const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
    return parseAdminInvoiceAggregate(response.data);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (error.message.startsWith("Invalid admin invoice") ||
        error.message.startsWith("Invoice request id"))
    ) {
      throw error;
    }
    throwSerializableCmsApiError(error, "Failed to fetch admin invoice detail.");
  }
}
