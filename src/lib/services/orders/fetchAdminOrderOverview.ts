"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import {
  FetchOrderOverviewParams,
  OrderOverviewResponse,
} from "@/types/orderOverview";

type FetchAdminOrderOverviewApiResponse =
  | OrderOverviewResponse
  | {
      data: OrderOverviewResponse;
    };

const ENDPOINT = "/orders/admin/overview";

const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: "Invalid request parameters supplied to admin order overview endpoint.",
  401: "Authentication failed while requesting admin order overview.",
  403: "You do not have permission to access admin order overview data.",
  404: "Admin order overview endpoint not found. Verify CMS configuration.",
  500: "Server error occurred while fetching admin order overview. Please try again later.",
};

function normalizeResponse(
  payload: FetchAdminOrderOverviewApiResponse
): OrderOverviewResponse {
  if ("orders" in payload && "stats" in payload && "timeline" in payload) {
    return payload;
  }

  if ("data" in payload && payload.data) {
    return payload.data;
  }

  throw new Error(
    "Invalid response format received from admin order overview endpoint."
  );
}

export async function fetchAdminOrderOverview(
  params: FetchOrderOverviewParams = {}
): Promise<OrderOverviewResponse> {
  try {
    const searchParams = new URLSearchParams();

    if (params.startDate) {
      searchParams.set("startDate", params.startDate);
    }

    if (params.endDate) {
      searchParams.set("endDate", params.endDate);
    }

    if (params.status) {
      searchParams.set("status", params.status);
    }

    const queryString = searchParams.toString();
    const url = `${ENDPOINT}${queryString ? `?${queryString}` : ""}`;

    const response =
      await axiosInstance.get<FetchAdminOrderOverviewApiResponse>(url);

    if (!response.data) {
      throw new Error(
        "Admin order overview endpoint returned an empty response."
      );
    }

    const normalized = normalizeResponse(response.data);

    console.debug("[fetchAdminOrderOverview] Success", {
      url,
      hasOrders: normalized.orders.length,
      range: normalized.timeline.range,
    });

    return normalized;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const responseMessage =
        (error.response?.data as { message?: string })?.message ??
        error.message;

      console.error("[fetchAdminOrderOverview] Axios error", {
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
          "Failed to fetch admin order overview due to an unknown error."
      );
    }

    console.error("[fetchAdminOrderOverview] Unexpected error", error);
    throw error instanceof Error
      ? error
      : new Error(
          "An unexpected error occurred while fetching admin order overview."
        );
  }
}
