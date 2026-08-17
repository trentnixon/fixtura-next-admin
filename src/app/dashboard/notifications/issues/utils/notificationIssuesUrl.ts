import type { NotificationHealthPresetDays } from "@/types/notificationHealth";
import type {
  FetchNotificationIssuesParams,
  NotificationIssuesLinkQuery,
} from "@/types/notificationIssues";

const PRESET_DAYS = [7, 14, 30, 60] as const;
const PAGE_SIZE_OPTIONS = [25, 50, 100] as const;

export const NOTIFICATION_ISSUES_DEFAULT_DAYS: NotificationHealthPresetDays = 7;
export const NOTIFICATION_ISSUES_DEFAULT_PAGE_SIZE = 50;

export type NotificationIssuesSearchParamsInput = Record<
  string,
  string | string[] | undefined
>;

function firstParam(value: string | string[] | undefined): string | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function parsePresetDays(
  raw: string | undefined,
): NotificationHealthPresetDays {
  const n = Number(raw);
  if (PRESET_DAYS.includes(n as (typeof PRESET_DAYS)[number])) {
    return n as NotificationHealthPresetDays;
  }
  return NOTIFICATION_ISSUES_DEFAULT_DAYS;
}

function parsePositiveInt(
  raw: string | undefined,
  fallback: number,
  max?: number,
): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1) return fallback;
  if (max != null && n > max) return max;
  return Math.floor(n);
}

function parseBool(raw: string | undefined): boolean | undefined {
  if (raw === "true") return true;
  if (raw === "false") return false;
  return undefined;
}

export interface ParsedNotificationIssuesSearch {
  params: FetchNotificationIssuesParams;
  /** False when custom range mode is selected but both dates are missing. */
  queryEnabled: boolean;
  /** True when URL uses createdAt_* instead of days preset. */
  customRange: boolean;
  /** Whether CMS artifact batch load is requested (default true). */
  includeArtifacts: boolean;
}

/**
 * Derives fetch params from Next.js searchParams (URL source of truth).
 */
export function parseNotificationIssuesSearchParams(
  searchParams: NotificationIssuesSearchParamsInput,
): ParsedNotificationIssuesSearch {
  const createdAt_gte = firstParam(searchParams.createdAt_gte);
  const createdAt_lte = firstParam(searchParams.createdAt_lte);
  const customRange = Boolean(createdAt_gte || createdAt_lte);

  const windowParams: FetchNotificationIssuesParams = customRange
    ? {
        mode: "range",
        createdAt_gte,
        createdAt_lte,
      }
    : {
        mode: "preset",
        days: parsePresetDays(firstParam(searchParams.days)),
      };

  const queryEnabled =
    !customRange || (Boolean(createdAt_gte) && Boolean(createdAt_lte));

  const retryable = parseBool(firstParam(searchParams.retryable));
  const selectorDrift = parseBool(firstParam(searchParams.selectorDrift));
  const artifactsParam = firstParam(searchParams.includeArtifacts);
  /** Screenshots on by default; pass `includeArtifacts=false` to skip CMS artifact batch load. */
  const includeArtifacts = artifactsParam !== "false";

  const params: FetchNotificationIssuesParams = {
    ...windowParams,
    scope: firstParam(searchParams.scope),
    service: firstParam(searchParams.service),
    queueName: firstParam(searchParams.queueName),
    kind: firstParam(searchParams.kind),
    step: firstParam(searchParams.step),
    issueScope: firstParam(searchParams.issueScope),
    search: firstParam(searchParams.search)?.trim() || undefined,
    message: firstParam(searchParams.message),
    jobId: firstParam(searchParams.jobId),
    runId: firstParam(searchParams.runId),
    page: parsePositiveInt(firstParam(searchParams.page), 1),
    pageSize: parsePositiveInt(
      firstParam(searchParams.pageSize),
      NOTIFICATION_ISSUES_DEFAULT_PAGE_SIZE,
      200,
    ),
    ...(retryable !== undefined ? { retryable } : {}),
    ...(selectorDrift !== undefined ? { selectorDrift } : {}),
    ...(includeArtifacts ? { includeArtifacts: true } : {}),
  };

  return { params, queryEnabled, customRange, includeArtifacts };
}

export function buildNotificationIssuesQuery(
  linkQuery: NotificationIssuesLinkQuery,
  extra?: Record<string, string | number | boolean | undefined>,
): URLSearchParams {
  const sp = new URLSearchParams();

  if ("days" in linkQuery) {
    sp.set("days", String(linkQuery.days));
  } else {
    sp.set("createdAt_gte", linkQuery.createdAt_gte);
    sp.set("createdAt_lte", linkQuery.createdAt_lte);
  }

  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      if (value === undefined || value === "" || value === false) continue;
      sp.set(key, String(value));
    }
  }

  return sp;
}

export function buildNotificationIssuesHref(
  linkQuery: NotificationIssuesLinkQuery,
  extra?: Record<string, string | number | boolean | undefined>,
): string {
  const qs = buildNotificationIssuesQuery(linkQuery, extra).toString();
  return `/dashboard/notifications/issues${qs ? `?${qs}` : ""}`;
}

export { PAGE_SIZE_OPTIONS as NOTIFICATION_ISSUES_PAGE_SIZE_OPTIONS };
