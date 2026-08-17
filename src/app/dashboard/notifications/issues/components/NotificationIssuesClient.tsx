"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Bug,
  ChevronDown,
  ImageIcon,
  ListFilter,
  RadioTower,
  RefreshCw,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationInfo,
  PaginationNext,
  PaginationPages,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import ErrorState from "@/components/ui-library/states/ErrorState";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { useNotificationIssues } from "@/hooks/data-collection/useNotificationIssues";
import { cn } from "@/lib/utils";
import type { NotificationHealthPresetDays } from "@/types/notificationHealth";
import {
  PRESET_OPTIONS,
  sortRecordEntries,
  toInputDate,
} from "../../components/notificationHealthUi";
import {
  NOTIFICATION_ISSUES_DEFAULT_DAYS,
  NOTIFICATION_ISSUES_PAGE_SIZE_OPTIONS,
  parseNotificationIssuesSearchParams,
  type NotificationIssuesSearchParamsInput,
} from "../utils/notificationIssuesUrl";
import { pickIssueScreenshotArtifact } from "../utils/notificationIssuesTableUi";
import { NotificationIssuesList } from "./NotificationIssuesList";

export interface NotificationIssuesClientProps {
  searchParams: NotificationIssuesSearchParamsInput;
}

interface SummaryCardProps {
  label: string;
  value: number;
  meta: string;
  icon: ReactNode;
  tone: string;
  selected?: boolean;
  onClick?: () => void;
}

function firstParam(value: string | string[] | undefined): string | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function toDateInputFromIso(iso: string | undefined): string {
  return iso ? iso.slice(0, 10) : "";
}

function SummaryCard({
  label,
  value,
  meta,
  icon,
  tone,
  selected = false,
  onClick,
}: SummaryCardProps) {
  const content = (
    <Card
      className={cn(
        "h-full border shadow-sm transition",
        tone,
        onClick && "hover:shadow-md",
        selected && "ring-2 ring-offset-1",
      )}
    >
      <CardContent className="flex min-h-[92px] items-center gap-3 p-3.5">
        <div className="rounded-md bg-white/75 p-2">{icon}</div>
        <div className="min-w-0 flex-1 text-left">
          <div className="text-xs font-medium opacity-75">{label}</div>
          <div className="text-xl font-bold leading-tight tabular-nums">
            {value.toLocaleString()}
          </div>
          <div className="truncate text-xs opacity-75">{meta}</div>
        </div>
        {selected ? (
          <Badge
            className="border-current bg-white/80 text-current"
            variant="outline"
          >
            Active
          </Badge>
        ) : null}
      </CardContent>
    </Card>
  );

  return onClick ? (
    <button type="button" className="h-full w-full" onClick={onClick}>
      {content}
    </button>
  ) : (
    content
  );
}

function TextFilter({
  id,
  label,
  value,
  placeholder,
  mono = false,
  onApply,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  mono?: boolean;
  onApply: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs">
        {label}
      </Label>
      <Input
        id={id}
        key={value}
        defaultValue={value}
        placeholder={placeholder}
        className={cn("text-sm", mono && "font-mono")}
        onBlur={(event) => {
          if (event.target.value !== value) onApply(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onApply((event.target as HTMLInputElement).value);
          }
        }}
      />
    </div>
  );
}

export function NotificationIssuesClient({
  searchParams,
}: NotificationIssuesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const { params, queryEnabled, customRange, includeArtifacts } = useMemo(
    () => parseNotificationIssuesSearchParams(searchParams),
    [searchParams],
  );

  const { data, meta, isLoading, error, refetch, isFetching } =
    useNotificationIssues({ params, enabled: queryEnabled });

  const updateUrl = useCallback(
    (
      patch: Record<string, string | undefined>,
      options?: { resetPage?: boolean },
    ) => {
      const next = new URLSearchParams();
      for (const [key, value] of Object.entries(searchParams)) {
        const first = firstParam(value);
        if (first != null && first !== "") next.set(key, first);
      }
      for (const [key, value] of Object.entries(patch)) {
        if (!value) next.delete(key);
        else next.set(key, value);
      }
      if (options?.resetPage) next.set("page", "1");
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    if (firstParam(searchParams.days) === "" && !customRange) {
      updateUrl({ days: String(NOTIFICATION_ISSUES_DEFAULT_DAYS) });
    }
  }, [customRange, searchParams.days, updateUrl]);

  const presetDays =
    params.mode === "preset"
      ? params.days
      : (NOTIFICATION_ISSUES_DEFAULT_DAYS as NotificationHealthPresetDays);
  const dateFrom =
    params.mode === "range" ? toDateInputFromIso(params.createdAt_gte) : "";
  const dateTo =
    params.mode === "range" ? toDateInputFromIso(params.createdAt_lte) : "";

  const pagination = data?.pagination;
  const totalPages = pagination?.pageCount ?? 0;
  const currentPage = pagination?.page ?? params.page ?? 1;
  const pageSize = pagination?.pageSize ?? params.pageSize ?? 50;
  const issueStart =
    pagination && pagination.totalIssues > 0
      ? (pagination.page - 1) * pagination.pageSize + 1
      : 0;
  const issueEnd = pagination
    ? Math.min(pagination.page * pagination.pageSize, pagination.totalIssues)
    : 0;

  const facetStepRows = sortRecordEntries(data?.facets.byStep ?? {});

  const screenshotCountOnPage = useMemo(() => {
    if (!data?.issues || !includeArtifacts) return 0;
    return data.issues.filter(
      (row) => pickIssueScreenshotArtifact(row.artifacts)?.fileUrl,
    ).length;
  }, [data?.issues, includeArtifacts]);

  const dimensionFilters = [
    { key: "service", label: "Service", value: params.service, tone: "blue" },
    { key: "scope", label: "Scope", value: params.scope, tone: "emerald" },
    {
      key: "queueName",
      label: "Queue",
      value: params.queueName,
      tone: "violet",
    },
    { key: "kind", label: "Kind", value: params.kind, tone: "indigo" },
    {
      key: "issueScope",
      label: "Issue scope",
      value: params.issueScope,
      tone: "cyan",
    },
  ].filter((filter) => Boolean(filter.value));

  const activeFilters = [
    ...(params.search
      ? [
          {
            key: "search",
            label: "Search",
            value: params.search,
            tone: "blue",
          },
        ]
      : []),
    ...(params.message
      ? [
          {
            key: "message",
            label: "Message only",
            value: params.message,
            tone: "rose",
          },
        ]
      : []),
    ...(params.step
      ? [{ key: "step", label: "Step", value: params.step, tone: "amber" }]
      : []),
    ...dimensionFilters,
    ...(params.retryable
      ? [{ key: "retryable", label: "Retryable", value: "Only", tone: "blue" }]
      : []),
    ...(params.selectorDrift
      ? [
          {
            key: "selectorDrift",
            label: "Selector drift",
            value: "Only",
            tone: "violet",
          },
        ]
      : []),
  ];

  useEffect(() => {
    if (dimensionFilters.length > 0) setAdvancedOpen(true);
  }, [dimensionFilters.length]);

  const chipTone = (tone: string) => {
    const tones: Record<string, string> = {
      amber: "border-warning-200 bg-warning-50 text-warning-800",
      blue: "border-info-200 bg-info-50 text-info-800",
      emerald: "border-success-200 bg-success-50 text-success-800",
      violet: "border-violet-200 bg-violet-50 text-violet-800",
      indigo: "border-indigo-200 bg-indigo-50 text-indigo-800",
      cyan: "border-cyan-200 bg-cyan-50 text-cyan-800",
      rose: "border-rose-200 bg-rose-50 text-rose-800",
    };
    return tones[tone] ?? "border-slate-200 bg-slate-50 text-slate-800";
  };

  const clearFilters = () => {
    updateUrl(
      {
        search: undefined,
        message: undefined,
        step: undefined,
        service: undefined,
        scope: undefined,
        queueName: undefined,
        kind: undefined,
        issueScope: undefined,
        retryable: undefined,
        selectorDrift: undefined,
      },
      { resetPage: true },
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
        { resetPage: true },
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
      { resetPage: true },
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/dashboard/notifications"
        className="inline-flex w-fit items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to notification health
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-end">
        <div className="flex items-center gap-2 pb-2">
          <Switch
            id="notification-issues-custom"
            checked={customRange}
            onCheckedChange={handleCustomRangeToggle}
          />
          <Label htmlFor="notification-issues-custom">Custom range</Label>
        </div>

        {!customRange ? (
          <Select
            value={String(presetDays)}
            onValueChange={(value) =>
              updateUrl(
                {
                  days: value,
                  createdAt_gte: undefined,
                  createdAt_lte: undefined,
                },
                { resetPage: true },
              )
            }
          >
            <SelectTrigger
              id="notification-issue-range"
              aria-label="Issue period"
              className="w-[170px]"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRESET_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="flex flex-wrap gap-2">
            <div className="space-y-1">
              <Label htmlFor="ni-from" className="text-xs">
                From (UTC)
              </Label>
              <Input
                id="ni-from"
                type="date"
                value={dateFrom}
                onChange={(event) =>
                  updateUrl(
                    {
                      days: undefined,
                      createdAt_gte: event.target.value
                        ? `${event.target.value}T00:00:00.000Z`
                        : undefined,
                    },
                    { resetPage: true },
                  )
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ni-to" className="text-xs">
                To (UTC)
              </Label>
              <Input
                id="ni-to"
                type="date"
                value={dateTo}
                onChange={(event) =>
                  updateUrl(
                    {
                      days: undefined,
                      createdAt_lte: event.target.value
                        ? `${event.target.value}T23:59:59.999Z`
                        : undefined,
                    },
                    { resetPage: true },
                  )
                }
              />
            </div>
          </div>
        )}

        {data?.window ? (
          <div className="pb-2 text-xs text-muted-foreground">
            {new Date(data.window.from).toLocaleDateString()} –{" "}
            {new Date(data.window.to).toLocaleDateString()}
          </div>
        ) : null}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching || !queryEnabled}
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {data && !isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total issues"
            value={pagination?.totalIssues ?? 0}
            meta="Matching issue rows"
            icon={<ListFilter className="h-4 w-4" />}
            tone="border-slate-200 bg-slate-50 text-slate-800"
          />
          <SummaryCard
            label="Notifications"
            value={pagination?.totalNotifications ?? 0}
            meta="Notifications represented"
            icon={<RadioTower className="h-4 w-4" />}
            tone="border-info-200 bg-info-50 text-info-800"
          />
          <SummaryCard
            label="Retryable"
            value={data.facets.retryableCount}
            meta="Select to filter"
            icon={<RefreshCw className="h-4 w-4" />}
            tone="border-warning-200 bg-warning-50 text-warning-800 ring-warning-400"
            selected={params.retryable === true}
            onClick={() =>
              updateUrl(
                { retryable: params.retryable ? undefined : "true" },
                { resetPage: true },
              )
            }
          />
          <SummaryCard
            label="Selector drift"
            value={data.facets.selectorDriftCount}
            meta="Select to filter"
            icon={<Bug className="h-4 w-4" />}
            tone="border-violet-200 bg-violet-50 text-violet-800 ring-violet-400"
            selected={params.selectorDrift === true}
            onClick={() =>
              updateUrl(
                {
                  selectorDrift: params.selectorDrift ? undefined : "true",
                },
                { resetPage: true },
              )
            }
          />
        </div>
      ) : null}

      <Card className="border-slate-200 shadow-none">
        <CardContent className="space-y-4 p-4">
          {activeFilters.length > 0 ? (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground"
                onClick={clearFilters}
              >
                <RotateCcw className="h-4 w-4" />
                Clear filters
              </Button>
            </div>
          ) : null}

          <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <div className="grid gap-3 lg:grid-cols-[minmax(280px,1fr)_auto] lg:items-end">
              <div className="space-y-1">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="ni-search"
                    aria-label="Search notification issues"
                    key={params.search ?? ""}
                    defaultValue={params.search ?? ""}
                    placeholder="Search messages, URLs, IDs, clubs…"
                    className="pl-9"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        const search = (
                          event.target as HTMLInputElement
                        ).value.trim();
                        updateUrl(
                          {
                            search: search || undefined,
                          },
                          { resetPage: true },
                        );
                      }
                    }}
                  />
                </div>
              </div>

              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2 lg:w-auto"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  More filters
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition",
                      advancedOpen && "rotate-180",
                    )}
                  />
                </Button>
              </CollapsibleTrigger>
            </div>

            <div className="mt-8 flex items-center justify-between gap-6 overflow-x-auto border-t border-slate-200 pt-4 whitespace-nowrap">
              <div className="flex items-center gap-2">
                {facetStepRows.length > 0 ? (
                  <>
                    <span className="text-xs text-muted-foreground">
                      Top steps:
                    </span>
                    {facetStepRows.slice(0, 6).map((row) => (
                      <button
                        key={row.key}
                        type="button"
                        onClick={() =>
                          updateUrl(
                            {
                              step:
                                params.step === row.key ? undefined : row.key,
                            },
                            { resetPage: true },
                          )
                        }
                      >
                        <Badge
                          variant="outline"
                          className={cn(
                            "cursor-pointer font-mono",
                            params.step === row.key
                              ? "border-warning-400 bg-warning-100 text-warning-900"
                              : "border-warning-200 bg-warning-50 text-warning-800",
                          )}
                        >
                          {row.key} · {row.count.toLocaleString()}
                        </Badge>
                      </button>
                    ))}
                  </>
                ) : null}
              </div>

              <div className="flex shrink-0 items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="ni-artifacts"
                    checked={includeArtifacts}
                    onCheckedChange={(checked) =>
                      updateUrl({
                        includeArtifacts: checked ? undefined : "false",
                      })
                    }
                  />
                  <Label
                    htmlFor="ni-artifacts"
                    className="inline-flex items-center gap-1.5"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Screenshots
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="ni-page-size" className="text-sm">
                    Per page
                  </Label>
                  <select
                    id="ni-page-size"
                    value={pageSize}
                    onChange={(event) =>
                      updateUrl(
                        { pageSize: event.target.value },
                        { resetPage: true },
                      )
                    }
                    className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                  >
                    {NOTIFICATION_ISSUES_PAGE_SIZE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <CollapsibleContent>
              <div className="grid gap-3 rounded-md border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-2 xl:grid-cols-5">
                <TextFilter
                  id="ni-service"
                  label="Service"
                  value={params.service ?? ""}
                  placeholder="python-scraper"
                  mono
                  onApply={(value) =>
                    updateUrl(
                      { service: value || undefined },
                      { resetPage: true },
                    )
                  }
                />
                <TextFilter
                  id="ni-scope"
                  label="Scope"
                  value={params.scope ?? ""}
                  placeholder="fixtures"
                  mono
                  onApply={(value) =>
                    updateUrl(
                      { scope: value || undefined },
                      { resetPage: true },
                    )
                  }
                />
                <TextFilter
                  id="ni-queue"
                  label="Queue"
                  value={params.queueName ?? ""}
                  placeholder="fixture-discovery"
                  mono
                  onApply={(value) =>
                    updateUrl(
                      { queueName: value || undefined },
                      { resetPage: true },
                    )
                  }
                />
                <TextFilter
                  id="ni-kind"
                  label="Kind"
                  value={params.kind ?? ""}
                  placeholder="job.completed"
                  mono
                  onApply={(value) =>
                    updateUrl({ kind: value || undefined }, { resetPage: true })
                  }
                />
                <TextFilter
                  id="ni-issue-scope"
                  label="Issue scope"
                  value={params.issueScope ?? ""}
                  placeholder="fixture"
                  mono
                  onApply={(value) =>
                    updateUrl(
                      { issueScope: value || undefined },
                      { resetPage: true },
                    )
                  }
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {activeFilters.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
              <span className="text-xs font-medium text-muted-foreground">
                Active:
              </span>
              {activeFilters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() =>
                    updateUrl({ [filter.key]: undefined }, { resetPage: true })
                  }
                  aria-label={`Remove ${filter.label} filter`}
                >
                  <Badge variant="outline" className={chipTone(filter.tone)}>
                    {filter.label}: {filter.value}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                </button>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {!queryEnabled && customRange ? (
        <div className="rounded-md border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-900">
          Choose both start and end dates to load issues.
        </div>
      ) : null}

      {meta?.notificationsTruncated ? (
        <div
          className="rounded-md border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-900"
          role="status"
        >
          <div className="flex gap-2">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>
              Results are capped at {meta.maxNotifications.toLocaleString()}{" "}
              notifications. Narrow the date range for complete issue coverage.
            </span>
          </div>
        </div>
      ) : null}

      {isLoading ? (
        <LoadingState message="Loading notification issues…" />
      ) : null}

      {error && !isLoading ? (
        <ErrorState
          title="Could not load notification issues"
          error={error}
          onRetry={() => refetch()}
        />
      ) : null}

      {data && !isLoading ? (
        <section
          className="space-y-4"
          aria-labelledby="notification-issue-results"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="notification-issue-results"
                className="text-base font-semibold text-slate-900"
              >
                Issue inbox
              </h2>
              <p className="text-sm text-muted-foreground">
                Showing {issueStart.toLocaleString()}–
                {issueEnd.toLocaleString()} of{" "}
                {pagination?.totalIssues.toLocaleString() ?? 0} issues across{" "}
                {pagination?.totalNotifications.toLocaleString() ?? 0}{" "}
                notifications
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge
                variant="outline"
                className="border-slate-200 bg-slate-50 text-slate-700"
              >
                Page {pagination?.page ?? 1} of{" "}
                {Math.max(pagination?.pageCount ?? 0, 1)}
              </Badge>
              {includeArtifacts && meta?.artifactsIncluded === false ? (
                <Badge
                  variant="outline"
                  className="border-warning-200 bg-warning-50 text-warning-800"
                >
                  Evidence unavailable from CMS
                </Badge>
              ) : includeArtifacts ? (
                <Badge
                  variant="outline"
                  className="border-info-200 bg-info-50 text-info-800"
                >
                  {screenshotCountOnPage} of {data.issues.length} screenshots
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-warning-200 bg-warning-50 text-warning-800"
                >
                  Screenshots off · faster loading
                </Badge>
              )}
            </div>
          </div>

          <NotificationIssuesList
            issues={data.issues}
            includeArtifacts={includeArtifacts}
          />

          {totalPages > 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.max(totalPages, 1)}
                onPageChange={(page) => updateUrl({ page: String(page) })}
                variant="primary"
                className="w-full flex-wrap justify-between gap-4 rounded-none border-0 bg-transparent p-0"
              >
                <PaginationInfo
                  format="long"
                  totalItems={pagination?.totalIssues ?? 0}
                  itemsPerPage={pageSize}
                />
                <div className="flex items-center gap-1">
                  <PaginationPrevious />
                  <PaginationPages />
                  <PaginationNext />
                </div>
              </Pagination>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
