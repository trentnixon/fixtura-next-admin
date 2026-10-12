"use client";

import { useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import { LabeledSegmentedControl } from "@/components/ui-library/forms/LabeledSegmentedControl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ErrorState from "@/components/ui-library/states/ErrorState";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { useNotificationIssues } from "@/hooks/data-collection/useNotificationIssues";
import {
  siteNavigationGroupDividerClass,
  siteNavigationGroupItemClass,
  siteNavigationGroupShellClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { cn } from "@/lib/utils";
import type { NotificationHealthPresetDays } from "@/types/notificationHealth";
import { PRESET_OPTIONS, toInputDate } from "../../components/notificationHealthUi";
import {
  NOTIFICATION_ISSUES_DEFAULT_DAYS,
  parseNotificationIssuesSearchParams,
  type NotificationIssuesSearchParamsInput,
} from "../utils/notificationIssuesUrl";
import { formatScopeLabel } from "@/app/dashboard/data/utils/formatScrapeScope";
import { groupNotificationIssues } from "../utils/notificationIssueGroups";
import { countCardContextValues } from "../utils/notificationIssuesContextFilters";
import { formatStepLabel } from "../utils/notificationIssuesTableUi";
import { NotificationIssuesList } from "./NotificationIssuesList";

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

function ContextChipRow({
  label,
  rows,
  activeKey,
  formatLabel,
  onToggle,
}: {
  label: string;
  rows: { key: string; count: number }[];
  activeKey?: string;
  formatLabel: (key: string) => string;
  onToggle: (key: string) => void;
}) {
  if (rows.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-full text-xs font-medium text-muted-foreground sm:w-auto">
        {label}
      </span>
      {rows.map((row) => {
        const active = activeKey === row.key;
        return (
          <button key={row.key} type="button" onClick={() => onToggle(row.key)}>
            <Badge
              variant="outline"
              className={cn(
                "cursor-pointer text-xs font-normal",
                active
                  ? "border-slate-500 bg-slate-200 text-slate-900"
                  : "border-slate-200 bg-white text-slate-700",
              )}
            >
              {formatLabel(row.key)} · {row.count.toLocaleString()}
            </Badge>
          </button>
        );
      })}
    </div>
  );
}

export function NotificationIssuesClient({
  searchParams,
}: NotificationIssuesClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { params, queryEnabled, customRange, cardTone } = useMemo(
    () => parseNotificationIssuesSearchParams(searchParams),
    [searchParams],
  );

  const { data, meta, isLoading, error, refetch, isFetching } =
    useNotificationIssues({ params, enabled: queryEnabled });

  const updateUrl = useCallback(
    (
      patch: Record<string, string | undefined>,
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
      next.delete("page");
      next.delete("pageSize");
      next.delete("includeArtifacts");
      next.delete("service");
      next.delete("queueName");
      next.delete("kind");
      next.delete("issueScope");
      next.delete("selectorDrift");
      next.delete("message");
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

  const presetSegmentOptions = PRESET_OPTIONS.map((option) => ({
    value: String(option.value),
    label: `${option.value}d`,
  }));

  const stepFilterRows = useMemo(
    () =>
      data?.issues
        ? countCardContextValues(data.issues, (row) => row.step)
        : [],
    [data?.issues],
  );

  const scopeFilterRows = useMemo(
    () =>
      data?.issues
        ? countCardContextValues(
            data.issues,
            (row) => row.notification.scope,
          )
        : [],
    [data?.issues],
  );

  const activeFilters = [
    ...(params.search
      ? [
          {
            key: "search",
            label: "Message",
            value: params.search,
            tone: "blue",
          },
        ]
      : []),
    ...(params.step
      ? [
          {
            key: "step",
            label: "Step",
            value: formatStepLabel(params.step),
            tone: "amber",
          },
        ]
      : []),
    ...(params.scope
      ? [
          {
            key: "scope",
            label: "Scope",
            value: formatScopeLabel(params.scope),
            tone: "emerald",
          },
        ]
      : []),
    ...(cardTone
      ? [
          {
            key: "tone",
            label: "Type",
            value: cardTone === "failure" ? "Failure" : "Warning",
            tone: cardTone === "failure" ? "rose" : "amber",
          },
        ]
      : []),
    ...(params.retryable
      ? [{ key: "retryable", label: "Retryable", value: "Only", tone: "blue" }]
      : []),
  ];

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
    updateUrl({
      search: undefined,
      step: undefined,
      scope: undefined,
      tone: undefined,
      retryable: undefined,
    });
  };

  const handleCustomRangeToggle = (enabled: boolean) => {
    if (!enabled) {
      updateUrl({
        days: String(presetDays),
        createdAt_gte: undefined,
        createdAt_lte: undefined,
      });
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
    );
  };

  const groupedOnPage = useMemo(
    () =>
      data?.issues
        ? groupNotificationIssues(
            data.issues,
            params.step ? { stepFocus: params.step } : undefined,
          )
        : null,
    [data?.issues, params.step],
  );
  const problemCount =
    (groupedOnPage?.failures.length ?? 0) +
    (groupedOnPage?.warnings.length ?? 0);
  const listDescription = `${problemCount} unique problem${problemCount === 1 ? "" : "s"} in this view`;

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
        byLineBottom="Each card is one problem message. Open the latest run to investigate."
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
              <OverviewRecordPanel
                title="What failed"
                description={listDescription}
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
                <div className="mb-4 space-y-3">
                  <div className="relative min-w-0">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="ni-search"
                      aria-label="Search by message on the card"
                      key={params.search ?? ""}
                      defaultValue={params.search ?? ""}
                      placeholder="Search the error message…"
                      className="rounded-full border-slate-200 bg-white pl-9 shadow-none"
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          const search = (
                            event.target as HTMLInputElement
                          ).value.trim();
                          updateUrl({ search: search || undefined });
                        }
                      }}
                    />
                  </div>

                  <ContextChipRow
                    label="Step on card"
                    rows={stepFilterRows}
                    activeKey={params.step}
                    formatLabel={formatStepLabel}
                    onToggle={(key) =>
                      updateUrl({
                        step: params.step === key ? undefined : key,
                      })
                    }
                  />

                  <ContextChipRow
                    label="Scope on card"
                    rows={scopeFilterRows}
                    activeKey={params.scope}
                    formatLabel={formatScopeLabel}
                    onToggle={(key) =>
                      updateUrl({
                        scope: params.scope === key ? undefined : key,
                      })
                    }
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Type on card
                    </span>
                    <Button
                      type="button"
                      variant={cardTone === "failure" ? "accent" : "outline"}
                      size="sm"
                      className="h-8 rounded-full text-xs"
                      onClick={() =>
                        updateUrl({
                          tone:
                            cardTone === "failure" ? undefined : "failure",
                        })
                      }
                    >
                      Failures
                    </Button>
                    <Button
                      type="button"
                      variant={cardTone === "warning" ? "accent" : "outline"}
                      size="sm"
                      className="h-8 rounded-full text-xs"
                      onClick={() =>
                        updateUrl({
                          tone:
                            cardTone === "warning" ? undefined : "warning",
                        })
                      }
                    >
                      Warnings
                    </Button>
                    <Button
                      type="button"
                      variant={params.retryable ? "accent" : "outline"}
                      size="sm"
                      className="h-8 rounded-full text-xs"
                      onClick={() =>
                        updateUrl({
                          retryable: params.retryable ? undefined : "true",
                        })
                      }
                    >
                      Retryable only
                    </Button>
                  </div>

                  {activeFilters.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-2">
                      {activeFilters.map((filter) => (
                        <button
                          key={filter.key}
                          type="button"
                          onClick={() =>
                            updateUrl({ [filter.key]: undefined })
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
                </div>

                <NotificationIssuesList
                  issues={data.issues}
                  stepFocus={params.step}
                  cardToneFilter={cardTone}
                />
              </OverviewRecordPanel>
            </>
          ) : null}
        </div>
      </PageContainer>
    </>
  );
}
