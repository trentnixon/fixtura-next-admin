"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import {
  Pagination,
  PaginationInfo,
  PaginationNext,
  PaginationPages,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useNotificationIssues } from "@/hooks/data-collection/useNotificationIssues";
import type { NotificationHealthPresetDays } from "@/types/notificationHealth";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  RefreshCw,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NOTIFICATION_ISSUES_PAGE_SIZE_OPTIONS,
  parseNotificationIssuesSearchParams,
  type NotificationIssuesSearchParamsInput,
} from "../utils/notificationIssuesUrl";
import {
  PRESET_OPTIONS,
  sortRecordEntries,
  toInputDate,
} from "../../../components/notificationHealthUi";
import { NotificationIssuesTable } from "./NotificationIssuesTable";
import { pickIssueScreenshotArtifact } from "../utils/notificationIssuesTableUi";

export interface NotificationIssuesClientProps {
  searchParams: NotificationIssuesSearchParamsInput;
}

function firstParam(
  value: string | string[] | undefined
): string | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function toDateInputFromIso(iso: string | undefined): string {
  if (!iso) return "";
  try {
    return iso.slice(0, 10);
  } catch {
    return "";
  }
}

export function NotificationIssuesClient({
  searchParams,
}: NotificationIssuesClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { params, queryEnabled, customRange, includeArtifacts } = useMemo(
    () => parseNotificationIssuesSearchParams(searchParams),
    [searchParams]
  );

  const { data, meta, isLoading, error, refetch, isFetching } =
    useNotificationIssues({
      params,
      enabled: queryEnabled,
    });

  const updateUrl = useCallback(
    (
      patch: Record<string, string | undefined>,
      options?: { resetPage?: boolean }
    ) => {
      const sp = new URLSearchParams();
      for (const [key, value] of Object.entries(searchParams)) {
        const v = firstParam(value);
        if (v != null && v !== "") sp.set(key, v);
      }
      for (const [key, value] of Object.entries(patch)) {
        if (value === undefined || value === "") sp.delete(key);
        else sp.set(key, value);
      }
      if (options?.resetPage) {
        sp.set("page", "1");
      }
      const qs = sp.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, router, searchParams]
  );

  const presetDays =
    params.mode === "preset" ? params.days : (7 as NotificationHealthPresetDays);

  const dateFrom =
    params.mode === "range"
      ? toDateInputFromIso(params.createdAt_gte)
      : "";
  const dateTo =
    params.mode === "range" ? toDateInputFromIso(params.createdAt_lte) : "";

  const messageValue = params.message ?? "";
  const stepValue = params.step ?? "";
  const retryableFilter = params.retryable === true;
  const selectorDriftFilter = params.selectorDrift === true;

  const pagination = data?.pagination;
  const totalPages = pagination?.pageCount ?? 0;
  const currentPage = pagination?.page ?? params.page ?? 1;
  const pageSize = pagination?.pageSize ?? params.pageSize ?? 50;

  const facetStepRows = sortRecordEntries(data?.facets.byStep ?? {});

  const screenshotCountOnPage = useMemo(() => {
    if (!data?.issues || !includeArtifacts) return 0;
    return data.issues.filter(
      (row) => pickIssueScreenshotArtifact(row.artifacts)?.fileUrl
    ).length;
  }, [data?.issues, includeArtifacts]);

  const handlePresetDaysChange = (days: NotificationHealthPresetDays) => {
    updateUrl(
      {
        days: String(days),
        createdAt_gte: undefined,
        createdAt_lte: undefined,
      },
      { resetPage: true }
    );
  };

  const handleCustomRangeToggle = (enabled: boolean) => {
    if (!enabled) {
      updateUrl(
        {
          days: String(presetDays),
          createdAt_gte: undefined,
          createdAt_lte: undefined,
        },
        { resetPage: true }
      );
      return;
    }
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 7);
    updateUrl(
      {
        days: undefined,
        createdAt_gte: `${toInputDate(from)}T00:00:00.000Z`,
        createdAt_lte: `${toInputDate(to)}T23:59:59.999Z`,
      },
      { resetPage: true }
    );
  };

  const handleDateFromChange = (value: string) => {
    updateUrl(
      {
        days: undefined,
        createdAt_gte: value ? `${value}T00:00:00.000Z` : undefined,
      },
      { resetPage: true }
    );
  };

  const handleDateToChange = (value: string) => {
    updateUrl(
      {
        days: undefined,
        createdAt_lte: value ? `${value}T23:59:59.999Z` : undefined,
      },
      { resetPage: true }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/dashboard/data#notification-health"
          className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to notification health
        </Link>
      </div>

      <SectionContainer
        title="Notification issues"
        description="Individual failure issue rows from scraper notifications. Drill down from health by step, or search and paginate here."
        icon={<Bell className="h-6 w-6 text-slate-600" />}
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching || !queryEnabled}
            className="gap-2"
          >
            <RefreshCw
              className={cn("h-4 w-4", isFetching && "animate-spin")}
            />
            Refresh
          </Button>
        }
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Switch
                  id="notification-issues-custom"
                  checked={customRange}
                  onCheckedChange={handleCustomRangeToggle}
                />
                <Label htmlFor="notification-issues-custom">
                  Custom date range
                </Label>
              </div>
              {!customRange ? (
                <Select
                  value={String(presetDays)}
                  onValueChange={(v) =>
                    handlePresetDaysChange(
                      Number(v) as NotificationHealthPresetDays
                    )
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Window" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESET_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={String(o.value)}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex flex-wrap items-end gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="ni-from" className="text-xs">
                      From (UTC date)
                    </Label>
                    <Input
                      id="ni-from"
                      type="date"
                      value={dateFrom}
                      onChange={(e) => handleDateFromChange(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ni-to" className="text-xs">
                      To (UTC date)
                    </Label>
                    <Input
                      id="ni-to"
                      type="date"
                      value={dateTo}
                      onChange={(e) => handleDateToChange(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
            {data?.window && (
              <p className="text-sm text-slate-500">
                Window:{" "}
                <span className="font-medium text-slate-700">
                  {new Date(data.window.from).toLocaleString()} —{" "}
                  {new Date(data.window.to).toLocaleString()}
                </span>
              </p>
            )}
          </div>

          {!queryEnabled && customRange && (
            <p className="text-sm text-amber-700">
              Choose start and end dates to load issues.
            </p>
          )}

          <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <h3 className="text-sm font-semibold text-slate-800">Filters</h3>
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-1">
                <Label htmlFor="ni-step" className="text-xs">
                  Step
                </Label>
                <Input
                  id="ni-step"
                  value={stepValue}
                  placeholder="e.g. request_timeout"
                  className="w-[200px] font-mono text-sm"
                  onChange={(e) =>
                    updateUrl(
                      { step: e.target.value || undefined },
                      { resetPage: true }
                    )
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="ni-message" className="text-xs">
                  Message contains
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="ni-message"
                    defaultValue={messageValue}
                    key={messageValue}
                    placeholder="Search message…"
                    className="w-[220px] text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        updateUrl(
                          {
                            message:
                              (e.target as HTMLInputElement).value || undefined,
                          },
                          { resetPage: true }
                        );
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Search messages"
                    onClick={() => {
                      const el = document.getElementById(
                        "ni-message"
                      ) as HTMLInputElement | null;
                      updateUrl(
                        { message: el?.value || undefined },
                        { resetPage: true }
                      );
                    }}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 pb-1">
                <Switch
                  id="ni-retryable"
                  checked={retryableFilter}
                  onCheckedChange={(checked) =>
                    updateUrl(
                      { retryable: checked ? "true" : undefined },
                      { resetPage: true }
                    )
                  }
                />
                <Label htmlFor="ni-retryable" className="text-sm">
                  Retryable only
                </Label>
              </div>
              <div className="flex items-center gap-2 pb-1">
                <Switch
                  id="ni-selector-drift"
                  checked={selectorDriftFilter}
                  onCheckedChange={(checked) =>
                    updateUrl(
                      { selectorDrift: checked ? "true" : undefined },
                      { resetPage: true }
                    )
                  }
                />
                <Label htmlFor="ni-selector-drift" className="text-sm">
                  Selector drift only
                </Label>
              </div>
              <div className="flex items-center gap-2 pb-1">
                <Switch
                  id="ni-artifacts"
                  checked={includeArtifacts}
                  onCheckedChange={(checked) =>
                    updateUrl(
                      { includeArtifacts: checked ? undefined : "false" },
                      { resetPage: false }
                    )
                  }
                />
                <Label htmlFor="ni-artifacts" className="text-sm">
                  Load screenshots from CMS
                </Label>
              </div>
            </div>

            {facetStepRows.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-xs text-slate-500">By step:</span>
                {facetStepRows.map(({ key, count }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      updateUrl({ step: key }, { resetPage: true })
                    }
                  >
                    <Badge
                      variant={stepValue === key ? "default" : "outline"}
                      className="cursor-pointer font-mono text-xs"
                    >
                      {key} ({count})
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </div>

          {meta?.notificationsTruncated && (
            <div
              className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
              role="status"
            >
              <div className="flex gap-2">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <span>
                  Results capped at {meta.maxNotifications.toLocaleString()}{" "}
                  notifications; issue list reflects only scanned rows. Narrow
                  the date range if you need full coverage.
                </span>
              </div>
            </div>
          )}

          {isLoading && <LoadingState message="Loading notification issues…" />}

          {error && !isLoading && (
            <ErrorState
              title="Could not load notification issues"
              error={error}
              onRetry={() => refetch()}
            />
          )}

          {data && !isLoading && (
            <>
              <div className="space-y-1 text-sm text-muted-foreground">
                {pagination ? (
                  <p>
                    Showing page {pagination.page} of{" "}
                    {Math.max(pagination.pageCount, 1)} (
                    {pagination.totalIssues.toLocaleString()} issue
                    {pagination.totalIssues === 1 ? "" : "s"} across{" "}
                    {pagination.totalNotifications.toLocaleString()}{" "}
                    notification
                    {pagination.totalNotifications === 1 ? "" : "s"})
                  </p>
                ) : null}
                {includeArtifacts ? (
                  <p>
                    Screenshots: {screenshotCountOnPage} of{" "}
                    {data.issues.length} on this page
                    {meta?.artifactsIncluded === false
                      ? " (CMS did not include artifacts — check includeArtifacts on the request)"
                      : screenshotCountOnPage === 0
                        ? ". None matched — common for request_timeout before capture, or jobId mismatch in CMS."
                        : "."}
                  </p>
                ) : (
                  <p className="text-amber-800">
                    Screenshot loading is off. Enable &quot;Load screenshots from
                    CMS&quot; to fetch artifact URLs from the issues API.
                  </p>
                )}
              </div>

              <NotificationIssuesTable
                issues={data.issues}
                includeArtifacts={includeArtifacts}
              />

              {totalPages > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Per page:
                    </span>
                    <select
                      value={pageSize}
                      onChange={(e) =>
                        updateUrl(
                          { pageSize: e.target.value, page: "1" },
                          { resetPage: true }
                        )
                      }
                      className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                      aria-label="Items per page"
                    >
                      {NOTIFICATION_ISSUES_PAGE_SIZE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.max(totalPages, 1)}
                    onPageChange={(page) =>
                      updateUrl({ page: String(page) })
                    }
                    variant="primary"
                  >
                    <PaginationInfo
                      format="long"
                      totalItems={pagination?.totalIssues ?? 0}
                      itemsPerPage={pageSize}
                      className="mr-2"
                    />
                    <div className="flex items-center gap-1">
                      <PaginationPrevious />
                      <PaginationPages />
                      <PaginationNext />
                    </div>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </SectionContainer>
    </div>
  );
}
