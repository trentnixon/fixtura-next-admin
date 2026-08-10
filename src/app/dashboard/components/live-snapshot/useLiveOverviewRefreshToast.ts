"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import {
  LIVE_OVERVIEW_REFRESH_TOAST_ID,
} from "./liveOverviewConfig";

/**
 * Shows a floating toast while overview data is background-refetching.
 */
export function useLiveOverviewRefreshToast(isRefreshing: boolean) {
  useEffect(() => {
    if (isRefreshing) {
      toast.loading("Refreshing overview…", {
        id: LIVE_OVERVIEW_REFRESH_TOAST_ID,
        duration: Infinity,
      });
      return;
    }

    toast.dismiss(LIVE_OVERVIEW_REFRESH_TOAST_ID);
  }, [isRefreshing]);
}
