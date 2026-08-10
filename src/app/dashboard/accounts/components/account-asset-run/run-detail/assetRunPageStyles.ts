import type {
  AccountAssetRunItemScope,
  AccountAssetRunItemStatus,
  AccountAssetRunStatus,
} from "@/types/accountAssetRun";

/** Brand-primary outline actions */
export const assetRunActionButtonClass =
  "rounded-full border-brandPrimary-300 bg-white text-brandPrimary-800 shadow-sm hover:border-brandPrimary-700 hover:bg-brandPrimary-800 hover:text-white";

export const assetRunSectionTitleClass =
  "text-sm font-semibold text-brandPrimary-900";

export const assetRunLiveBannerClass =
  "rounded-md border border-brandInfo-200 bg-brandInfo-50 px-3 py-2 text-sm text-brandInfo-900";

export const assetRunNoticeClass =
  "rounded-md border border-brandPrimary-200 bg-brandPrimary-50 px-3 py-2 text-sm text-brandPrimary-900";

export const assetRunWarningNoticeClass =
  "rounded-md border border-brandWarning-200 bg-brandWarning-50 px-3 py-2 text-sm text-brandWarning-950";

export const assetRunErrorBannerClass =
  "rounded-md border border-brandError-200 bg-brandError-50 px-4 py-3 text-sm text-brandError-900";

export const assetRunTimelineGridClass =
  "grid overflow-hidden rounded-md border border-brandSecondary-200 bg-white shadow-sm sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";

export const assetRunTableHeaderClass = "bg-brandSecondary-50 hover:bg-brandSecondary-50";

export const assetRunTableRowHoverClass = "hover:bg-brandSecondary-50/50";

export const assetRunSummaryCardClass =
  "grid gap-3 rounded-md border border-brandSecondary-200 border-l-4 border-l-brandAccent-500 bg-white px-4 py-4 text-sm shadow-sm sm:grid-cols-2 lg:grid-cols-3";

export type AssetRunTimelineAccent =
  | "secondary"
  | "info"
  | "success"
  | "error";

const timelineAccentClasses: Record<
  AssetRunTimelineAccent,
  { icon: string; label: string; value: string }
> = {
  secondary: {
    icon: "border-brandSecondary-200 bg-brandSecondary-100 text-brandSecondary-700",
    label: "text-brandSecondary-600",
    value: "text-brandPrimary-900",
  },
  info: {
    icon: "border-brandInfo-200 bg-brandInfo-100 text-brandInfo-700",
    label: "text-brandInfo-600",
    value: "text-brandPrimary-900",
  },
  success: {
    icon: "border-brandSuccess-200 bg-brandSuccess-100 text-brandSuccess-700",
    label: "text-brandSuccess-600",
    value: "text-brandPrimary-900",
  },
  error: {
    icon: "border-brandError-200 bg-brandError-100 text-brandError-700",
    label: "text-brandError-600",
    value: "text-brandPrimary-900",
  },
};

export function assetRunTimelineMetricClasses(accent: AssetRunTimelineAccent): {
  icon: string;
  label: string;
  value: string;
  valueEmpty: string;
} {
  const t = timelineAccentClasses[accent];
  return {
    icon: t.icon,
    label: t.label,
    value: t.value,
    valueEmpty: "text-muted-foreground",
  };
}

export function assetRunPageStatusBadgeClass(
  status: AccountAssetRunStatus | string
): string {
  switch (status) {
    case "failed":
    case "cancelled":
      return "border-brandError-300 bg-brandError-50 text-brandError-800";
    case "completed":
      return "border-brandSuccess-300 bg-brandSuccess-50 text-brandSuccess-800";
    case "scraping_results":
      return "border-brandAccent-300 bg-brandAccent-50 text-brandAccent-800";
    case "checking_upcoming_fixtures":
      return "border-brandWarning-300 bg-brandWarning-50 text-brandWarning-900";
    case "creating_assets":
      return "border-brandSecondary-300 bg-brandSecondary-50 text-brandSecondary-800";
    case "running":
    case "queued":
    case "pending":
      return "border-brandInfo-300 bg-brandInfo-50 text-brandInfo-800";
    default:
      return "border-brandPrimary-200 bg-brandPrimary-50 text-brandPrimary-700";
  }
}

export function assetRunItemStatusBadgeClass(
  status: AccountAssetRunItemStatus | string
): string {
  switch (status) {
    case "failed":
      return "border-brandError-300 bg-brandError-50 text-brandError-800";
    case "completed":
      return "border-brandSuccess-300 bg-brandSuccess-50 text-brandSuccess-800";
    case "running":
      return "border-brandAccent-300 bg-brandAccent-50 text-brandAccent-800";
    case "queued":
    case "pending":
      return "border-brandInfo-300 bg-brandInfo-50 text-brandInfo-800";
    case "skipped":
      return "border-brandPrimary-200 bg-brandPrimary-50 text-brandPrimary-600";
    default:
      return "border-brandPrimary-200 bg-brandPrimary-50 text-brandPrimary-700";
  }
}

/** Step number chip — scope gives workflow color, status can override mood */
export function assetRunStepIndexClass(
  scope: string,
  status: AccountAssetRunItemStatus | string
): string {
  if (status === "failed") {
    return "border-brandError-200 bg-brandError-100 text-brandError-800";
  }
  if (status === "completed") {
    return "border-brandSuccess-200 bg-brandSuccess-100 text-brandSuccess-800";
  }
  if (status === "skipped") {
    return "border-brandPrimary-200 bg-brandPrimary-50 text-brandPrimary-500";
  }
  if (
    status === "running" ||
    status === "queued" ||
    status === "pending"
  ) {
    const scopeTone: Record<string, string> = {
      eligibility_check:
        "border-brandInfo-200 bg-brandInfo-100 text-brandInfo-800",
      grades_comps_refresh:
        "border-brandSecondary-200 bg-brandSecondary-100 text-brandSecondary-800",
      result_batch_scrape:
        "border-brandAccent-200 bg-brandAccent-100 text-brandAccent-800",
      remove_fixtures_scrape:
        "border-brandWarning-200 bg-brandWarning-100 text-brandWarning-900",
      asset_creation:
        "border-brandSecondary-300 bg-brandSecondary-100 text-brandSecondary-900",
      asset_completion:
        "border-brandSuccess-200 bg-brandSuccess-100 text-brandSuccess-800",
    };
    return (
      scopeTone[scope as AccountAssetRunItemScope] ??
      "border-brandInfo-200 bg-brandInfo-100 text-brandInfo-800"
    );
  }
  return "border-brandPrimary-200 bg-brandPrimary-50 text-brandPrimary-700";
}

export const assetRunBlockingInProgressStyles = {
  border: "border-brandWarning-200",
  header: "border-brandWarning-200 bg-brandWarning-50",
  icon: "border-brandWarning-300 bg-brandWarning-100 text-brandWarning-700",
  iconGlyph: "text-brandWarning-700",
} as const;

export const assetRunBlockingFailedStyles = {
  border: "border-brandError-200",
  header: "border-brandError-200 bg-brandError-50",
  icon: "border-brandError-300 bg-brandError-100 text-brandError-700",
  iconGlyph: "text-brandError-700",
} as const;
