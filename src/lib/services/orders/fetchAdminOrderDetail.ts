"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { OrderDetailResponse } from "@/types/orderDetail";

type FetchAdminOrderDetailApiResponse =
  | OrderDetailResponse
  | {
      data: OrderDetailResponse;
    };

const ENDPOINT = "/orders/admin";

const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: "Invalid request parameters supplied to admin order detail endpoint.",
  401: "Authentication failed while requesting admin order detail.",
  403: "You do not have permission to access admin order detail data.",
  404: "Admin order detail endpoint not found. Verify CMS configuration.",
  500: "Server error occurred while fetching admin order detail. Please try again later.",
};

function normalizeResponse(
  payload: FetchAdminOrderDetailApiResponse
): OrderDetailResponse {
  if ("order" in payload && "relatedOrders" in payload) {
    return payload;
  }

  if ("data" in payload && payload.data) {
    return payload.data;
  }

  throw new Error(
    "Invalid response format received from admin order detail endpoint."
  );
}

export async function fetchAdminOrderDetail(
  id: number | string
): Promise<OrderDetailResponse> {
  if (id === undefined || id === null || id === "") {
    throw new Error("Order id is required to fetch admin order detail.");
  }

  try {
    const url = `${ENDPOINT}/${id}`;
    const response = await axiosInstance.get<FetchAdminOrderDetailApiResponse>(
      url
    );

    if (!response.data) {
      throw new Error(
        "Admin order detail endpoint returned an empty response."
      );
    }

    const normalized = normalizeResponse(response.data);

    console.debug("[fetchAdminOrderDetail] Success", {
      url,
      orderId: normalized.order.id,
      relatedCount: normalized.relatedOrders.length,
    });

    return normalized;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const responseMessage =
        (error.response?.data as { message?: string })?.message ??
        error.message;

      console.error("[fetchAdminOrderDetail] Axios error", {
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
          "Failed to fetch admin order detail due to an unknown error."
      );
    }

    console.error("[fetchAdminOrderDetail] Unexpected error", error);
    throw error instanceof Error
      ? error
      : new Error(
          "An unexpected error occurred while fetching admin order detail."
        );
  }
}
