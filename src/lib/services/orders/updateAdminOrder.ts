"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { OrderDetail } from "@/types/orderDetail";
import { CheckoutStatus } from "@/types/orderOverview";

export interface OrderUpdatePayload {
  // Payment fields
  payment_channel?: "stripe" | "invoice" | null;
  payment_status?: string | null;
  payment_method?: string | null;
  OrderPaid?: boolean;

  // Status fields
  status?: string | null;
  Status?: boolean;
  checkout_status?: CheckoutStatus;
  isActive?: boolean;
  isPaused?: boolean;
  cancel_at_period_end?: boolean;
  cancel_at?: number | string | null;

  // Order metadata
  total?: string | number;
  currency?: string | null;
  Name?: string | null;

  // Schedule fields
  startOrderAt?: string | Date;
  endOrderAt?: string | Date;
  Fixture_start?: number | string;
  Fixture_end?: number | string;

  // Invoice fields
  invoice_id?: string | null;
  invoice_number?: string | null;
  hosted_invoice_url?: string | null;
  invoice_pdf?: string | null;

  // Expiration flags
  hasOrderExpired?: boolean;
  isExpiringSoon?: boolean;
  expireEmailSent?: boolean;
  expiringSoonEmail?: boolean;

  // Relations (use IDs)
  account?: number[];
  subscription_tier?: number;
  customer?: number[];
}

export interface UpdateAdminOrderRequest {
  id: number | string;
  updates: OrderUpdatePayload;
}

export interface OrderUpdateResponse {
  message: "Order updated successfully";
  order: OrderDetail;
}

const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: "Invalid request parameters supplied to admin order update endpoint.",
  401: "Authentication failed while updating admin order.",
  403: "You do not have permission to update admin orders.",
  404: "Order not found.",
  500: "Server error occurred while updating admin order. Please try again later.",
};

/**
 * Server action to update an admin order via POST /api/orders/admin/:id
 *
 * @param request - Contains order ID and partial order updates in API format
 * @returns Updated order data
 * @throws Error if update fails
 */
export async function updateAdminOrder(
  request: UpdateAdminOrderRequest
): Promise<OrderUpdateResponse> {
  const { id, updates } = request;

  if (id === undefined || id === null || id === "") {
    throw new Error("Order id is required to update admin order.");
  }

  if (!updates || Object.keys(updates).length === 0) {
    throw new Error(
      "Update payload is required and must be a non-empty object."
    );
  }

  try {
    const url = `/orders/admin/${id}`;

    console.log("[updateAdminOrder] Updating order:", { url, updates });

    const response = await axiosInstance.post<OrderUpdateResponse>(
      url,
      updates
    );

    if (!response.data) {
      throw new Error(
        "Admin order update endpoint returned an empty response."
      );
    }

    console.debug("[updateAdminOrder] Success", {
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

      console.error("[updateAdminOrder] Axios error", {
        message: error.message,
        status,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response?.data,
      });

      if (status && HTTP_STATUS_MESSAGES[status]) {
        throw new Error(
          responseMessage
            ? `${HTTP_STATUS_MESSAGES[status]} ${responseMessage}`
            : HTTP_STATUS_MESSAGES[status]
        );
      }

      throw new Error(
        responseMessage ||
          "Failed to update admin order due to an unknown error."
      );
    }

    console.error("[updateAdminOrder] Unexpected error", error);
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while updating admin order.");
  }
}
