import type {
  AccountHealthItemStatus,
  AccountHealthRunStatus,
  AccountHealthScope,
} from "@/types/accountHealth";

/** Brand-primary outline actions */
export const healthRunActionButtonClass =
  "rounded-full border-brandPrimary-300 bg-white text-brandPrimary-800 shadow-sm hover:border-brandPrimary-700 hover:bg-brandPrimary-800 hover:text-white";

export const healthRunSectionTitleClass =
  "text-sm font-semibold text-brandPrimary-900";

export const healthRunLiveBannerClass =
  "rounded-md border border-brandInfo-200 bg-brandInfo-50 px-3 py-2 text-sm text-brandInfo-900";

export const healthRunNoticeClass =
  "rounded-md border border-brandPrimary-200 bg-brandPrimary-50 px-3 py-2 text-sm text-brandPrimary-900";

export const healthRunInfoNoticeClass =
  "rounded-md border border-brandInfo-200 bg-brandInfo-50 px-4 py-3 text-sm text-brandInfo-950";

export const healthRunErrorBannerClass =
  "rounded-md border border-brandError-200 bg-brandError-50 px-4 py-3 text-sm text-brandError-900";

export const healthRunTimelineGridClass =
  "grid overflow-hidden rounded-md border border-brandSecondary-200 bg-white shadow-sm sm:grid-cols-2 lg:grid-cols-4";

export const healthRunTableHeaderClass =
  "bg-brandSecondary-50 hover:bg-brandSecondary-50";

export const healthRunTableRowHoverClass = "hover:bg-brandSecondary-50/50";

export const healthRunFixturePanelClass =
  "rounded-md border border-brandInfo-200 bg-brandInfo-50/80 p-4";

export type HealthRunTimelineAccent =
  | "secondary"
  | "info"
  | "success"
  | "accent";

const timelineAccentClasses: Record<
  HealthRunTimelineAccent,
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
  accent: {
    icon: "border-brandAccent-200 bg-brandAccent-100 text-brandAccent-700",
    label: "text-brandAccent-600",
    value: "text-brandPrimary-900",
  },
};

export function healthRunTimelineMetricClasses(accent: HealthRunTimelineAccent): {
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

export function healthRunPageStatusBadgeClass(
  status: AccountHealthRunStatus | string
): string {
  switch (status) {
    case "failed":
      return "border-brandError-300 bg-brandError-50 text-brandError-800";
    case "completed":
      return "border-brandSuccess-300 bg-brandSuccess-50 text-brandSuccess-800";
    case "finalized":
      return "border-brandAccent-300 bg-brandAccent-50 text-brandAccent-800";
    case "running":
      return "border-brandAccent-300 bg-brandAccent-50 text-brandAccent-800";
    case "queued":
    case "pending":
      return "border-brandInfo-300 bg-brandInfo-50 text-brandInfo-800";
    default:
      return "border-brandPrimary-200 bg-brandPrimary-50 text-brandPrimary-700";
  }
}

export function healthRunItemStatusBadgeClass(
  status: AccountHealthItemStatus | string
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

export function healthRunProcessingStatusBadgeClass(status: string): string {
  switch (status) {
    case "failed":
      return "border-brandError-300 bg-brandError-50 text-brandError-800";
    case "processed":
      return "border-brandSuccess-300 bg-brandSuccess-50 text-brandSuccess-800";
    case "processing":
      return "border-brandAccent-300 bg-brandAccent-50 text-brandAccent-800";
    case "pending":
    default:
      return "border-brandInfo-300 bg-brandInfo-50 text-brandInfo-800";
  }
}

const HEALTH_SCOPE_STEP_TONES: Partial<Record<AccountHealthScope, string>> = {
  "scrape:association-single":
    "border-brandInfo-200 bg-brandInfo-100 text-brandInfo-800",
  "scrape:club-single":
    "border-brandSecondary-200 bg-brandSecondary-100 text-brandSecondary-800",
  "scrape:grades-batch":
    "border-brandAccent-200 bg-brandAccent-100 text-brandAccent-800",
  "internal:club-to-association-sync":
    "border-brandWarning-200 bg-brandWarning-100 text-brandWarning-900",
  "internal:association-to-club-sync":
    "border-brandWarning-200 bg-brandWarning-100 text-brandWarning-900",
  "scrape:grades-lookup-teams-batch":
    "border-brandSecondary-300 bg-brandSecondary-100 text-brandSecondary-900",
  "scrape:fixture-discovery-batch":
    "border-brandSuccess-200 bg-brandSuccess-100 text-brandSuccess-800",
};

export function healthRunStepIndexClass(
  scope: string,
  status: AccountHealthItemStatus | string
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
    return (
      HEALTH_SCOPE_STEP_TONES[scope as AccountHealthScope] ??
      "border-brandInfo-200 bg-brandInfo-100 text-brandInfo-800"
    );
  }
  return "border-brandPrimary-200 bg-brandPrimary-50 text-brandPrimary-700";
}

export const healthRunBlockingInProgressStyles = {
  border: "border-brandWarning-200",
  header: "border-brandWarning-200 bg-brandWarning-50",
  icon: "border-brandWarning-300 bg-brandWarning-100 text-brandWarning-700",
  iconGlyph: "text-brandWarning-700",
} as const;

export const healthRunBlockingFailedStyles = {
  border: "border-brandError-200",
  header: "border-brandError-200 bg-brandError-50",
  icon: "border-brandError-300 bg-brandError-100 text-brandError-700",
  iconGlyph: "text-brandError-700",
} as const;
