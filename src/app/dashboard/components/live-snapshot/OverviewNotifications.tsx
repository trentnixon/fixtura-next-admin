"use client";

import { useState } from "react";
import { FileText, Mail, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import {
  sectionTabListClass,
  sectionTabTriggerClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import type { AdminInvoiceListRow } from "@/types/adminInvoice";
import type { ContactFormSubmission } from "@/types/contact-form";
import type { RerenderRequest } from "@/types/rerender-request";
import { FinancialInvoiceQueueList } from "../financials/FinancialInvoiceQueueList";
import { ContactFormAttentionList } from "./ContactFormAttentionList";
import { DashboardLinkButton } from "./DashboardLinkButton";
import { OverviewRecordPanel } from "./OverviewRecordPanel";
import { RerenderRequestAttentionList } from "./RerenderRequestAttentionList";

const NOTIFICATION_TABS = [
  {
    value: "emails",
    label: "New emails",
    description: "Unseen or unacknowledged contact form messages",
    href: "/dashboard/contact",
    action: "Inbox",
    icon: Mail,
  },
  {
    value: "rerenders",
    label: "Re-render requests",
    description: "CMS requests waiting for admin handling",
    href: "/dashboard/rerender-requests",
    action: "View all",
    icon: RefreshCw,
  },
  {
    value: "invoices",
    label: "Invoice requests",
    description: "Recently submitted billing requests awaiting action",
    href: "/dashboard/orders/invoices",
    action: "Invoice queue",
    icon: FileText,
  },
] as const;

type NotificationTab = (typeof NOTIFICATION_TABS)[number]["value"];

function isNotificationTab(value: string): value is NotificationTab {
  return (
    value === "emails" || value === "rerenders" || value === "invoices"
  );
}

interface QueueState<T> {
  items: T[];
  total: number;
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
}

interface OverviewNotificationsProps {
  emails: QueueState<ContactFormSubmission>;
  rerenders: QueueState<RerenderRequest>;
  invoices: QueueState<AdminInvoiceListRow>;
}

function QueueCount({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <Badge
      variant="outline"
      className="ml-1 border-amber-300 bg-amber-50 px-1.5 py-0 text-[10px] font-semibold text-amber-900"
    >
      {count}
    </Badge>
  );
}

/**
 * Overview notifications — emails, re-render requests, and new invoice requests.
 */
export function OverviewNotifications({
  emails,
  rerenders,
  invoices,
}: OverviewNotificationsProps) {
  const [tab, setTab] = useState<NotificationTab>("emails");
  const active =
    NOTIFICATION_TABS.find((item) => item.value === tab) ??
    NOTIFICATION_TABS[0];
  const total = emails.total + rerenders.total + invoices.total;

  return (
    <OverviewRecordPanel
      title="Notifications"
      description={active.description}
      badge={
        total > 0 ? (
          <Badge variant="outline">
            {total} open
          </Badge>
        ) : null
      }
      action={
        <DashboardLinkButton href={active.href} trailingIcon="external">
          {active.action}
        </DashboardLinkButton>
      }
    >
      <Tabs
        value={tab}
        onValueChange={(value) => {
          if (isNotificationTab(value)) setTab(value);
        }}
        className="w-full"
      >
        <TabsList
          variant="primary"
          className={sectionTabListClass}
          aria-label="Notification queues"
        >
          {NOTIFICATION_TABS.map(({ value, label, icon: Icon }) => {
            const count =
              value === "emails"
                ? emails.total
                : value === "rerenders"
                  ? rerenders.total
                  : invoices.total;

            return (
              <TabsTrigger
                key={value}
                value={value}
                variant="section"
                className={sectionTabTriggerClass}
              >
                <Icon className="h-4 w-4 shrink-0 text-current" aria-hidden />
                {label}
                <QueueCount count={count} />
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="emails" className="mt-4">
          <ContactFormAttentionList
            items={emails.items}
            isLoading={emails.isLoading}
            error={emails.error}
            onRetry={emails.onRetry}
          />
        </TabsContent>

        <TabsContent value="rerenders" className="mt-4">
          <RerenderRequestAttentionList
            items={rerenders.items}
            isLoading={rerenders.isLoading}
            error={rerenders.error}
            onRetry={rerenders.onRetry}
          />
        </TabsContent>

        <TabsContent value="invoices" className="mt-4">
          {invoices.isLoading ? (
            <LoadingState
              variant="minimal"
              message="Loading invoice requests…"
            />
          ) : invoices.error ? (
            <ErrorState
              variant="default"
              title="Could not load invoice requests"
              error={invoices.error}
              onRetry={invoices.onRetry}
            />
          ) : (
            <FinancialInvoiceQueueList items={invoices.items} />
          )}
        </TabsContent>
      </Tabs>
    </OverviewRecordPanel>
  );
}
