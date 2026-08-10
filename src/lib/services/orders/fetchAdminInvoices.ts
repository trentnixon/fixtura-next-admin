"use server";

import axiosInstance from "@/lib/axios";
import type {
  AdminInvoiceListResponse,
  FetchAdminInvoicesParams,
} from "@/types/adminInvoice";
import {
  parseAdminInvoiceListResponse,
  serializeAdminInvoiceListParams,
} from "@/lib/services/orders/adminInvoicePayloads";
import { throwSerializableCmsApiError } from "@/lib/services/utils/cms-api-error";

const ENDPOINT = "/orders/admin/invoices";

export async function fetchAdminInvoices(
  params: FetchAdminInvoicesParams = {}
): Promise<AdminInvoiceListResponse> {
  try {
    const searchParams = serializeAdminInvoiceListParams(params);
    const qs = searchParams.toString();
    const url = `${ENDPOINT}${qs ? `?${qs}` : ""}`;
    const response = await axiosInstance.get(url);
    return parseAdminInvoiceListResponse(response.data);
  } catch (error: unknown) {
    if (error instanceof Error && error.message.startsWith("Invalid admin invoices")) {
      throw error;
    }
    throwSerializableCmsApiError(error, "Failed to fetch admin invoices.");
  }
}
