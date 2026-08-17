"use client";

import { useEffect, useMemo, useState } from "react";
import { useNotificationHealth } from "@/hooks/data-collection/useNotificationHealth";
import type {
  FetchNotificationHealthParams,
  NotificationHealthPresetDays,
} from "@/types/notificationHealth";
import type { NotificationIssuesLinkQuery } from "@/types/notificationIssues";
import { NotificationHealthOverview } from "./NotificationHealthOverview";
import { NotificationHealthDetailPanels } from "./NotificationHealthSection";
import { toInputDate } from "./notificationHealthUi";

export function NotificationHealthDashboard() {
  const [customRange, setCustomRange] = useState(false);
  const [presetDays, setPresetDays] = useState<NotificationHealthPresetDays>(7);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    if (!customRange || dateFrom || dateTo) return;
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 7);
    setDateFrom(toInputDate(from));
    setDateTo(toInputDate(to));
  }, [customRange, dateFrom, dateTo]);

  const params: FetchNotificationHealthParams = useMemo(() => {
    if (!customRange) return { mode: "preset", days: presetDays };
    return {
      mode: "range",
      createdAt_gte: dateFrom ? `${dateFrom}T00:00:00.000Z` : undefined,
      createdAt_lte: dateTo ? `${dateTo}T23:59:59.999Z` : undefined,
    };
  }, [customRange, presetDays, dateFrom, dateTo]);

  const queryEnabled = !customRange || (Boolean(dateFrom) && Boolean(dateTo));

  const issuesLinkQuery: NotificationIssuesLinkQuery | undefined =
    useMemo(() => {
      if (!queryEnabled) return undefined;
      if (!customRange) return { days: presetDays };
      return {
        createdAt_gte: `${dateFrom}T00:00:00.000Z`,
        createdAt_lte: `${dateTo}T23:59:59.999Z`,
      };
    }, [queryEnabled, customRange, presetDays, dateFrom, dateTo]);

  const { data, meta, isLoading, error, refetch, isFetching } =
    useNotificationHealth({ params, enabled: queryEnabled });

  return (
    <div className="flex flex-col gap-6">
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
        issuesLinkQuery={issuesLinkQuery}
      />

      {data && !isLoading ? (
        <NotificationHealthDetailPanels
          data={data}
          issuesLinkQuery={issuesLinkQuery}
        />
      ) : null}
    </div>
  );
}
