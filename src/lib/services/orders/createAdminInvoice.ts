"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import {
  AdminCreateInvoicePayload,
  AdminCreateInvoiceResponse,
} from "@/types/orderDetail";

const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: "Invalid request parameters supplied to admin invoice creation endpoint.",
  401: "Authentication failed while creating admin invoice.",
  403: "You do not have permission to create admin invoices.",
  404: "Account or subscription tier not found.",
  500: "Server error occurred while creating admin invoice. Please try again later.",
};

/**
 * Server action to create an admin invoice order via POST /api/orders/admin/create-invoice
 *
 * @param payload - Invoice creation payload with all required fields
 * @returns Created order data
 * @throws Error if creation fails
 */
export async function createAdminInvoice(
  payload: AdminCreateInvoicePayload
): Promise<AdminCreateInvoiceResponse> {
  // Validate payload is not empty
  if (!payload || Object.keys(payload).length === 0) {
    throw new Error(
      "Invoice payload is required and must be a non-empty object."
    );
  }

  // Validate required fields
  if (!payload.accountId || typeof payload.accountId !== "number") {
    throw new Error("accountId is required and must be a number.");
  }

  if (
    !payload.subscriptionTierId ||
    typeof payload.subscriptionTierId !== "number"
  ) {
    throw new Error("subscriptionTierId is required and must be a number.");
  }

  if (!payload.amount || typeof payload.amount !== "number") {
    throw new Error("amount is required and must be a number.");
  }

  if (!payload.currency || typeof payload.currency !== "string") {
    throw new Error("currency is required and must be a string.");
  }

  if (!payload.startDate || typeof payload.startDate !== "string") {
    throw new Error("startDate is required and must be a string.");
  }

  if (!payload.endDate || typeof payload.endDate !== "string") {
    throw new Error("endDate is required and must be a string.");
  }

  if (!payload.dueDate || typeof payload.dueDate !== "string") {
    throw new Error("dueDate is required and must be a string.");
  }

  // daysUntilDue is required
  if (typeof payload.daysUntilDue !== "number") {
    throw new Error("daysUntilDue is required and must be a number.");
  }

  // Validate checkoutStatus
  if (!payload.checkoutStatus || typeof payload.checkoutStatus !== "string") {
    throw new Error("checkoutStatus is required and must be a string.");
  }

  // Validate paymentStatus
  if (!payload.payment_status || typeof payload.payment_status !== "string") {
    throw new Error("paymentStatus is required and must be a string.");
  }

  // Validate amount is positive
  if (payload.amount <= 0) {
    throw new Error("amount must be a positive number greater than 0.");
  }

  // Validate daysUntilDue is positive
  if (payload.daysUntilDue <= 0) {
    throw new Error("daysUntilDue must be a positive number greater than 0.");
  }

  // Validate dates
  const startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);
  const dueDate = new Date(payload.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time for comparison

  if (isNaN(startDate.getTime())) {
    throw new Error("startDate must be a valid ISO date string.");
  }
  if (isNaN(endDate.getTime())) {
    throw new Error("endDate must be a valid ISO date string.");
  }
  if (isNaN(dueDate.getTime())) {
    throw new Error("dueDate must be a valid ISO date string.");
  }

  if (endDate <= startDate) {
    throw new Error("endDate must be after startDate.");
  }

  const dueDateOnly = new Date(dueDate);
  dueDateOnly.setHours(0, 0, 0, 0);
  if (dueDateOnly < today) {
    throw new Error(
      "dueDate must be today or a future date (cannot be in the past)."
    );
  }

  try {
    const url = `/orders/admin/create-invoice`;

    // Map payload to backend API format
    // The backend accepts camelCase field names for the API, but stores them using Strapi schema field names
    // Required fields: accountId, subscriptionTierId, amount, currency, startDate, endDate, dueDate, daysUntilDue, checkoutStatus, paymentStatus
    // Optional boolean fields: Status, isActive, OrderPaid, isExpiringSoon, expiringSoonEmail, hasOrderExpired, expireEmailSent, cancel_at_period_end, isPaused
    const apiPayload: Record<string, unknown> = {
      // Required fields - use camelCase API field names (backend maps these internally)
      accountId: payload.accountId,
      subscriptionTierId: payload.subscriptionTierId,
      amount: payload.amount, // number, not string
      currency: payload.currency.trim(), // Trim whitespace, backend will lowercase
      startDate: payload.startDate, // ISO date string
      endDate: payload.endDate, // ISO date string
      dueDate: payload.dueDate, // ISO date string
      daysUntilDue: payload.daysUntilDue, // integer
      checkoutStatus: payload.checkoutStatus, // Checkout status string
      payment_status: payload.payment_status, // Payment status string

      // Boolean fields - send as camelCase (backend will map to Strapi schema names)
      Status: payload.Status ?? false,
      isActive: payload.isActive ?? false,
      OrderPaid: payload.OrderPaid ?? false,
      isExpiringSoon: payload.isExpiringSoon ?? false,
      expiringSoonEmail: payload.expiringSoonEmail ?? false,
      hasOrderExpired: payload.hasOrderExpired ?? false,
      expireEmailSent: payload.expireEmailSent ?? false,
      cancel_at_period_end: payload.cancel_at_period_end ?? false,
      isPaused: payload.isPaused ?? false,
    };

    console.log("[createAdminInvoice] Creating invoice:", { url, apiPayload });

    const response = await axiosInstance.post<AdminCreateInvoiceResponse>(
      url,
      apiPayload
    );

    if (!response.data) {
      throw new Error(
        "Admin invoice creation endpoint returned an empty response."
      );
    }

    console.debug("[createAdminInvoice] Success", {
      url,
      orderId: response.data.order.id,
      message: response.data.message,
    });

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const responseMessage =
        (error.response?.data as { error?: { message?: string } })?.error
          ?.message ??
        (error.response?.data as { message?: string })?.message ??
        error.message;

      console.error("[createAdminInvoice] Axios error", {
        message: error.message,
        status,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response?.data,
      });

      // Always include the backend error message if available
      if (responseMessage) {
        throw new Error(responseMessage);
      }

      if (status && HTTP_STATUS_MESSAGES[status]) {
        throw new Error(HTTP_STATUS_MESSAGES[status]);
      }

      throw new Error(
        `Failed to create admin invoice: ${status || "Unknown error"}`
      );
    }

    console.error("[createAdminInvoice] Unexpected error", error);
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while creating admin invoice.");
  }
}
