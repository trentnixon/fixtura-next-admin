"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  ChevronDown,
  ImageIcon,
  List,
  ListFilter,
  RefreshCw,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import {
  OverviewDataWorkspace,
  type WorkspaceMetricTile,
} from "@/app/dashboard/components/live-snapshot/OverviewDataWorkspace";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import { LabeledSegmentedControl } from "@/components/ui-library/forms/LabeledSegmentedControl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ErrorState from "@/components/ui-library/states/ErrorState";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { useNotificationIssues } from "@/hooks/data-collection/useNotificationIssues";
import {
  sectionTabListInverseClass,
  sectionTabTriggerInverseClass,
  siteNavigationGroupDividerClass,
  siteNavigationGroupItemClass,
  siteNavigationGroupShellClass,
} from "@/lib/actions/siteNavigationButtonStyles";
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
import { NotificationIssuesCharts } from "./NotificationIssuesCharts";
import { NotificationIssuesList } from "./NotificationIssuesList";

const ISSUES_VIEW_TABS = [
  { value: "list", label: "List", icon: List },
  { value: "charts", label: "Charts", icon: BarChart3 },
] as const;

export interface NotificationIssuesClientProps {
  searchParams: NotificationIssuesSearchParamsInput;
}

function firstParam(value: string | string[] | undefined): string | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function toDateInputFromIso(iso: string | undefined): string {
  return iso ? iso.slice(0, 10) : "";
}

function groupedItemClass(withDivider: boolean) {
  return cn(
    siteNavigationGroupItemClass,
    withDivider && siteNavigationGroupDividerClass,
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
        className={cn(
          "rounded-full border-transparent bg-white text-sm shadow-none",
          mono && "font-mono",
        )}
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

  const presetSegmentOptions = PRESET_OPTIONS.map((option) => ({
    value: String(option.value),
    label: `${option.value}d`,
  }));

  const pageSizeOptions = NOTIFICATION_ISSUES_PAGE_SIZE_OPTIONS.map(
    (option) => ({
      value: String(option),
      label: String(option),
    }),
  );

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

  const metrics = useMemo((): WorkspaceMetricTile[] => {
    if (!data) return [];
    return [
      {
        id: "total-issues",
        label: "Total issues",
        value: (pagination?.totalIssues ?? 0).toLocaleString(),
        meta: "Matching issue rows",
      },
      {
        id: "notifications",
        label: "Notifications",
        value: (pagination?.totalNotifications ?? 0).toLocaleString(),
        meta: "Notifications represented",
      },
      {
        id: "retryable",
        label: "Retryable",
        value: data.facets.retryableCount.toLocaleString(),
        meta: params.retryable ? "Filter active" : "Tap to filter",
      },
      {
        id: "selector-drift",
        label: "Selector drift",
        value: data.facets.selectorDriftCount.toLocaleString(),
        meta: params.selectorDrift ? "Filter active" : "Tap to filter",
      },
    ];
  }, [data, pagination?.totalIssues, pagination?.totalNotifications, params.retryable, params.selectorDrift]);

  const headerActions = (
    <div className={siteNavigationGroupShellClass}>
      <Button
        variant="ghost"
        size="sm"
        className={groupedItemClass(true)}
        asChild
      >
        <Link href="/dashboard/notifications">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Health
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={groupedItemClass(false)}
        type="button"
        onClick={() => refetch()}
        disabled={isFetching || !queryEnabled}
      >
        <RefreshCw
          className={cn("h-4 w-4", isFetching && "animate-spin")}
          aria-hidden
        />
        Refresh
      </Button>
    </div>
  );

  const windowLabel = data?.window
    ? `${new Date(data.window.from).toLocaleDateString()} – ${new Date(data.window.to).toLocaleDateString()}`
    : null;

  return (
    <>
      <CreatePageTitle
        title="Notification issues"
        byLine="Failure investigation inbox"
        byLineBottom="Search issue signals, inspect operational context, and open the affected scraper run"
      >
        {headerActions}
      </CreatePageTitle>

      <PageContainer padding="xs" spacing="lg">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-full border border-slate-200 bg-slate-50/60 px-4 py-2 lg:flex-row lg:flex-wrap lg:items-center">
            <div className="flex shrink-0 items-center gap-2">
              <Switch
                id="notification-issues-custom"
                checked={customRange}
                onCheckedChange={handleCustomRangeToggle}
              />
              <Label htmlFor="notification-issues-custom" className="text-sm">
                Custom range
              </Label>
            </div>

            {!customRange ? (
              <LabeledSegmentedControl
                label="Period"
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
                options={presetSegmentOptions}
                className="min-w-0 shrink-0"
                shellClassName="h-auto shrink-0 rounded-full"
                ariaLabel="Issue period"
              />
            ) : (
              <div className="flex flex-wrap items-center gap-2">
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
                  aria-label="From (UTC)"
                  className="w-auto rounded-full border-transparent bg-white shadow-none"
                />
                <span className="text-sm text-muted-foreground">–</span>
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
                  aria-label="To (UTC)"
                  className="w-auto rounded-full border-transparent bg-white shadow-none"
                />
              </div>
            )}

            {windowLabel ? (
              <span className="text-xs text-muted-foreground lg:ml-1">
                {windowLabel}
              </span>
            ) : null}
          </div>

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
                  notifications. Narrow the date range for complete issue
                  coverage.
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
            <>
              <OverviewDataWorkspace
                title="Issue snapshot"
                description={
                  windowLabel
                    ? `${windowLabel} · page ${pagination?.page ?? 1} of ${Math.max(pagination?.pageCount ?? 0, 1)}`
                    : "Matching issue rows for the selected window"
                }
                icon={ListFilter}
                badge={
                  activeFilters.length > 0 ? (
                    <Badge variant="outline">Filtered</Badge>
                  ) : null
                }
                metrics={metrics}
                columns={4}
                action={
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={params.retryable ? "accent" : "outline"}
                      size="sm"
                      className={cn(
                        !params.retryable &&
                          "border-slate-200 bg-white shadow-none",
                      )}
                      onClick={() =>
                        updateUrl(
                          {
                            retryable: params.retryable ? undefined : "true",
                          },
                          { resetPage: true },
                        )
                      }
                    >
                      Retryable
                    </Button>
                    <Button
                      type="button"
                      variant={params.selectorDrift ? "accent" : "outline"}
                      size="sm"
                      className={cn(
                        !params.selectorDrift &&
                          "border-slate-200 bg-white shadow-none",
                      )}
                      onClick={() =>
                        updateUrl(
                          {
                            selectorDrift: params.selectorDrift
                              ? undefined
                              : "true",
                          },
                          { resetPage: true },
                        )
                      }
                    >
                      Selector drift
                    </Button>
                  </div>
                }
              />

              <OverviewRecordPanel
                title="Search & filters"
                description="Narrow the issue inbox by message, step, and scraper dimensions"
                action={
                  activeFilters.length > 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2 border-slate-200 bg-slate-50 shadow-none"
                      onClick={clearFilters}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Clear filters
                    </Button>
                  ) : null
                }
              >
                <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                  <div className="flex flex-col gap-3 rounded-full border border-slate-200 bg-slate-50/60 px-4 py-2 lg:flex-row lg:flex-wrap lg:items-center">
                    <div className="relative min-w-0 flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="ni-search"
                        aria-label="Search notification issues"
                        key={params.search ?? ""}
                        defaultValue={params.search ?? ""}
                        placeholder="Search messages, URLs, IDs, clubs…"
                        className="rounded-full border-transparent bg-white pl-9 shadow-none"
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            const search = (
                              event.target as HTMLInputElement
                            ).value.trim();
                            updateUrl(
                              { search: search || undefined },
                              { resetPage: true },
                            );
                          }
                        }}
                      />
                    </div>

                    <CollapsibleTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 rounded-full border-slate-200 bg-white shadow-none lg:w-auto"
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

                    <LabeledSegmentedControl
                      label="Per page"
                      value={String(pageSize)}
                      onValueChange={(value) =>
                        updateUrl({ pageSize: value }, { resetPage: true })
                      }
                      options={pageSizeOptions}
                      className="shrink-0"
                      shellClassName="h-auto shrink-0 rounded-full"
                    />

                    <div className="flex shrink-0 items-center gap-2">
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
                        className="inline-flex items-center gap-1.5 text-sm"
                      >
                        <ImageIcon className="h-4 w-4" />
                        Screenshots
                      </Label>
                    </div>
                  </div>

                  {facetStepRows.length > 0 ? (
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
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
                    </div>
                  ) : null}

                  <CollapsibleContent>
                    <div className="mt-4 grid gap-3 rounded-lg border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-2 xl:grid-cols-5">
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
                          updateUrl(
                            { kind: value || undefined },
                            { resetPage: true },
                          )
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

                  {activeFilters.length > 0 ? (
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                      <span className="text-xs font-medium text-muted-foreground">
                        Active:
                      </span>
                      {activeFilters.map((filter) => (
                        <button
                          key={filter.key}
                          type="button"
                          onClick={() =>
                            updateUrl(
                              { [filter.key]: undefined },
                              { resetPage: true },
                            )
                          }
                          aria-label={`Remove ${filter.label} filter`}
                        >
                          <Badge
                            variant="outline"
                            className={chipTone(filter.tone)}
                          >
                            {filter.label}: {filter.value}
                            <X className="ml-1 h-3 w-3" />
                          </Badge>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </Collapsible>
              </OverviewRecordPanel>

              <Tabs defaultValue="list" className="w-full">
                <TabsList
                  variant="sectionInverse"
                  className={cn(sectionTabListInverseClass, "mb-4")}
                >
                  {ISSUES_VIEW_TABS.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        variant="sectionInverse"
                        className={sectionTabTriggerInverseClass}
                      >
                        <Icon
                          className="h-4 w-4 shrink-0 text-current"
                          aria-hidden
                        />
                        {tab.label}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                <TabsContent value="list" className="mt-0">
                  <OverviewRecordPanel
                    title="Issue inbox"
                    description={`Showing ${issueStart.toLocaleString()}–${issueEnd.toLocaleString()} of ${pagination?.totalIssues.toLocaleString() ?? 0} issues across ${pagination?.totalNotifications.toLocaleString() ?? 0} notifications`}
                    badge={
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
                          Page {pagination?.page ?? 1} of{" "}
                          {Math.max(pagination?.pageCount ?? 0, 1)}
                        </span>
                        {includeArtifacts &&
                        meta?.artifactsIncluded === false ? (
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
                            {screenshotCountOnPage} of {data.issues.length}{" "}
                            screenshots
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
                    }
                    footer={
                      totalPages > 0 ? (
                        <Pagination
                          currentPage={currentPage}
                          totalPages={Math.max(totalPages, 1)}
                          onPageChange={(page) =>
                            updateUrl({ page: String(page) })
                          }
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
                      ) : null
                    }
                  >
                    <NotificationIssuesList
                      issues={data.issues}
                      includeArtifacts={includeArtifacts}
                    />
                  </OverviewRecordPanel>
                </TabsContent>

                <TabsContent value="charts" className="mt-0">
                  <NotificationIssuesCharts
                    facets={data.facets}
                    pagination={data.pagination}
                    issues={data.issues}
                    activeStep={params.step}
                    activeIssueScope={params.issueScope}
                    onStepFilter={(step) =>
                      updateUrl(
                        {
                          step: params.step === step ? undefined : step,
                        },
                        { resetPage: true },
                      )
                    }
                    onIssueScopeFilter={(scope) =>
                      updateUrl(
                        {
                          issueScope:
                            params.issueScope === scope ? undefined : scope,
                        },
                        { resetPage: true },
                      )
                    }
                  />
                </TabsContent>
              </Tabs>
            </>
          ) : null}
        </div>
      </PageContainer>
    </>
  );
}
