/**
 * Navigation utilities for budget drill-down routes
 */

/**
 * Navigate to period detail page
 */
export function getPeriodDetailUrl(period: string, granularity: "daily" | "weekly" | "monthly"): string {
  return `/dashboard/budget/period/${granularity}/${encodeURIComponent(period)}`;
}

/**
 * Navigate to account analytics page
 */
export function getAccountAnalyticsUrl(accountId: string | number): string {
  return `/dashboard/budget/account/${accountId}`;
}

/**
 * Navigate to render detail page
 */
export function getRenderDetailUrl(renderId: string | number): string {
  return `/dashboard/renders/${renderId}`;
}

/**
 * Navigate to scheduler analytics page
 */
export function getSchedulerAnalyticsUrl(schedulerId: string | number): string {
  return `/dashboard/budget/scheduler/${schedulerId}`;
}

/**
 * Build query parameters for period filtering
 */
export function buildPeriodQueryParams(params: {
  startDate?: string;
  endDate?: string;
  period?: string;
  granularity?: string;
}): string {
  const searchParams = new URLSearchParams();
  if (params.startDate) searchParams.set("startDate", params.startDate);
  if (params.endDate) searchParams.set("endDate", params.endDate);
  if (params.period) searchParams.set("period", params.period);
  if (params.granularity) searchParams.set("granularity", params.granularity);
  return searchParams.toString();
}

