"use server";

import axiosInstance from "@/lib/axios";
import { buildRenderActivityWindow } from "@/lib/account-asset-run/renderActivityParams";
import type {
  AccountAssetRunRenderActivityParams,
  AccountAssetRunRenderActivityResponse,
} from "@/types/accountAssetRun";
import {
  extractAccountAssetRunErrorMessage,
  getAccountAssetRunHttpStatus,
} from "./extractAccountAssetRunError";

function emptyRenderActivityResponse(
  params: AccountAssetRunRenderActivityParams
): AccountAssetRunRenderActivityResponse {
  const window = buildRenderActivityWindow("48h");
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 100;

  return {
    data: [],
    meta: {
      from: params.from ?? window.from,
      to: params.to ?? window.to,
      page,
      pageSize,
      pageCount: 0,
      total: 0,
      returned: 0,
    },
  };
}

/**
 * GET /api/account-asset-runs/render-activity — time-windowed asset run report.
 * @see .comms/Strapi/response/account-asset-run-render-activity-cms-response.md
 */
export async function fetchAccountAssetRunRenderActivity(
  params: AccountAssetRunRenderActivityParams = {}
): Promise<AccountAssetRunRenderActivityResponse> {
  try {
    const response =
      await axiosInstance.get<AccountAssetRunRenderActivityResponse>(
        "/account-asset-runs/render-activity",
        {
          params: {
            from: params.from,
            to: params.to,
            page: params.page,
            pageSize: params.pageSize,
            status: params.status,
            accountId: params.accountId,
            includeItems: params.includeItems,
          },
        }
      );
    return response.data;
  } catch (error: unknown) {
    if (getAccountAssetRunHttpStatus(error) === 404) {
      console.warn(
        "[fetchAccountAssetRunRenderActivity] GET /account-asset-runs/render-activity returned 404 — returning empty list (CMS route may be missing)."
      );
      return emptyRenderActivityResponse(params);
    }
    throw new Error(extractAccountAssetRunErrorMessage(error));
  }
}
