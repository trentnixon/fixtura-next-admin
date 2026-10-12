import type { NotificationHealthPresetDays } from "@/types/notificationHealth";
import type {
  FetchNotificationIssuesParams,
  NotificationIssuesLinkQuery,
} from "@/types/notificationIssues";

const PRESET_DAYS = [7, 14, 30, 60] as const;

export const NOTIFICATION_ISSUES_DEFAULT_DAYS: NotificationHealthPresetDays = 7;

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

function parseBool(raw: string | undefined): boolean | undefined {
  if (raw === "true") return true;
  if (raw === "false") return false;
  return undefined;
}

export type IssueCardToneFilter = "failure" | "warning";

export interface ParsedNotificationIssuesSearch {
  params: FetchNotificationIssuesParams;
  /** False when custom range mode is selected but both dates are missing. */
  queryEnabled: boolean;
  /** True when URL uses createdAt_* instead of days preset. */
  customRange: boolean;
  /** Client-only filter matching Failure / Warning on cards. */
  cardTone?: IssueCardToneFilter;
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
  const toneRaw = firstParam(searchParams.tone);
  const cardTone: IssueCardToneFilter | undefined =
    toneRaw === "failure" || toneRaw === "warning" ? toneRaw : undefined;

  const params: FetchNotificationIssuesParams = {
    ...windowParams,
    scope: firstParam(searchParams.scope),
    step: firstParam(searchParams.step),
    search: firstParam(searchParams.search)?.trim() || undefined,
    jobId: firstParam(searchParams.jobId),
    runId: firstParam(searchParams.runId),
    includeArtifacts: true,
    ...(retryable !== undefined ? { retryable } : {}),
  };

  return { params, queryEnabled, customRange, cardTone };
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

