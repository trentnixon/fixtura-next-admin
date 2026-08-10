"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useNotificationHealth } from "@/hooks/data-collection/useNotificationHealth";
import type {
  FetchNotificationHealthParams,
  NotificationHealthPresetDays,
} from "@/types/notificationHealth";
import type { NotificationIssuesLinkQuery } from "@/types/notificationIssues";
import { cn } from "@/lib/utils";
import { buildNotificationIssuesHref } from "../notifications/issues/utils/notificationIssuesUrl";
import { DataOperationsStrip } from "./DataOperationsStrip";
import { NotificationHealthOverview } from "./NotificationHealthOverview";
import { NotificationHealthDetailPanels } from "./NotificationHealthSection";
import { formatHealthWindowLabel, toInputDate } from "./notificationHealthUi";

export function DataDashboardOverview() {
  const [customRange, setCustomRange] = useState(false);
  const [presetDays, setPresetDays] = useState<NotificationHealthPresetDays>(7);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  useEffect(() => {
    if (!customRange) return;
    if (dateFrom || dateTo) return;
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 7);
    setDateFrom(toInputDate(from));
    setDateTo(toInputDate(to));
  }, [customRange, dateFrom, dateTo]);

  const params: FetchNotificationHealthParams = useMemo(() => {
    if (!customRange) {
      return { mode: "preset", days: presetDays };
    }
    const createdAt_gte = dateFrom ? `${dateFrom}T00:00:00.000Z` : undefined;
    const createdAt_lte = dateTo ? `${dateTo}T23:59:59.999Z` : undefined;
    return { mode: "range", createdAt_gte, createdAt_lte };
  }, [customRange, presetDays, dateFrom, dateTo]);

  const queryEnabled = !customRange || (Boolean(dateFrom) && Boolean(dateTo));

  const issuesLinkQuery: NotificationIssuesLinkQuery | undefined = useMemo(() => {
    if (!queryEnabled) return undefined;
    if (!customRange) {
      return { days: presetDays };
    }
    return {
      createdAt_gte: `${dateFrom}T00:00:00.000Z`,
      createdAt_lte: `${dateTo}T23:59:59.999Z`,
    };
  }, [queryEnabled, customRange, presetDays, dateFrom, dateTo]);

  const { data, meta, isLoading, error, refetch, isFetching } =
    useNotificationHealth({
      params,
      enabled: queryEnabled,
    });

  const issuesListHref =
    issuesLinkQuery && (data?.issues.totalIssueRows ?? 0) > 0
      ? buildNotificationIssuesHref(issuesLinkQuery)
      : undefined;

  const windowLabel = formatHealthWindowLabel(customRange, presetDays);

  const scrollToNotificationHealth = () => {
    document
      .getElementById("notification-health")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex flex-col gap-6">
      <DataOperationsStrip
        notificationHealth={data}
        healthLoading={isLoading}
        healthError={error}
        windowLabel={windowLabel}
        onNotificationsClick={scrollToNotificationHealth}
        issuesListHref={issuesListHref}
      />

      <NotificationHealthOverview
        customRange={customRange}
        onCustomRangeChange={setCustomRange}
        presetDays={presetDays}
        onPresetDaysChange={setPresetDays}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        queryEnabled={queryEnabled}
        data={data}
        meta={meta}
        isLoading={isLoading}
        error={error}
        refetch={refetch}
        isFetching={isFetching}
      />

      {data && !isLoading && (
        <Collapsible open={breakdownOpen} onOpenChange={setBreakdownOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-100">
            Full notification breakdown
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-slate-500 transition-transform",
                breakdownOpen && "rotate-180",
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="rounded-b-md border border-t-0 border-slate-200 bg-white px-4 pb-4">
            <NotificationHealthDetailPanels
              data={data}
              issuesLinkQuery={issuesLinkQuery}
            />
          </CollapsibleContent>
        </Collapsible>
      )}

      <div className="border-t border-slate-200 pt-2">
        <h2 className="text-sm font-semibold text-slate-700">
          Scraper jobs by scope
        </h2>
      </div>
    </div>
  );
}
