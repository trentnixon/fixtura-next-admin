import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  CircleDollarSign,
  Clock3,
  Home,
  LineChart,
  RefreshCcw,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { SubscriptionTrendsWidget } from "./components/SubscriptionTrendsWidget";
import { GlobalAnalyticsWidget } from "./components/GlobalAnalyticsWidget";
import { TrialConversionWidget } from "./components/TrialConversionWidget";
import { RevenueChart } from "./components/RevenueChart";
import { CohortRetentionWidget } from "./components/CohortRetentionWidget";

interface AnalyticsSection {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
  content: ReactNode;
}

const analyticsSections: AnalyticsSection[] = [
  {
    value: "snapshot",
    label: "Snapshot",
    description:
      "System-wide activity, revenue, trial conversion, and account mix.",
    icon: BarChart3,
    content: <GlobalAnalyticsWidget />,
  },
  {
    value: "revenue",
    label: "Revenue",
    description: "Monthly and quarterly revenue patterns.",
    icon: CircleDollarSign,
    content: <RevenueChart />,
  },
  {
    value: "trials",
    label: "Trials",
    description: "Trial progression and conversion funnel analysis.",
    icon: Target,
    content: <TrialConversionWidget />,
  },
  {
    value: "subscriptions",
    label: "Subscriptions",
    description: "Subscription stages, renewals, churn, and growth.",
    icon: RefreshCcw,
    content: <SubscriptionTrendsWidget />,
  },
  {
    value: "cohorts",
    label: "Cohorts",
    description:
      "Customer acquisition, retention, lifecycle, and cohort revenue.",
    icon: Users,
    content: <CohortRetentionWidget />,
  },
];

const workspaceStats = [
  {
    label: "Views",
    value: analyticsSections.length,
  },
  {
    label: "Refresh",
    value: "5-10m",
  },
  {
    label: "Signals",
    value: "Revenue",
  },
];

/**
 * Analytics Dashboard Page
 *
 * Provides comprehensive analytics insights including global metrics, revenue trends,
 * trial conversion funnels, cohort retention analysis, and subscription lifecycle data.
 */
export default function AnalyticsPage() {
  return (
    <>
      <CreatePageTitle
        title="Analytics"
        byLine="Business intelligence"
        byLineBottom="Revenue, subscription, trial, and cohort performance"
      />
      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Analytics Workspace"
          description="Route context, data cadence, and available analytics views for the business intelligence workflow."
          variant="compact"
          contentClassName="space-y-4"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      className="flex items-center gap-1"
                      href="/dashboard"
                    >
                      <Home className="h-3.5 w-3.5" />
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Analytics</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div>
                <h2 className="text-lg font-semibold leading-tight text-slate-950">
                  Analytics insight workspace
                </h2>
                <p className="text-sm text-muted-foreground">
                  Scan the system snapshot, then move through focused revenue,
                  trial, subscription, and cohort views.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-slate-600 lg:justify-end">
              <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-medium">
                <Clock3 className="mr-1.5 h-3.5 w-3.5" />
                React Query cache
              </span>
              <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-medium">
                <LineChart className="mr-1.5 h-3.5 w-3.5" />
                Business signals
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 border-t border-slate-200 pt-3 text-sm sm:grid-cols-3">
            {workspaceStats.map((stat) => (
              <WorkspaceStatus
                key={stat.label}
                label={stat.label}
                value={String(stat.value)}
              />
            ))}
          </div>
        </SectionContainer>

        <Tabs
          defaultValue={analyticsSections[0].value}
          className="w-full min-w-0 max-w-full"
        >
          <TabsList className="h-auto w-full flex-wrap justify-start rounded-md bg-slate-100 p-1">
            {analyticsSections.map((section) => {
              const Icon = section.icon;

              return (
                <TabsTrigger
                  key={section.value}
                  value={section.value}
                  className="min-h-10 gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {analyticsSections.map((section) => (
            <TabsContent
              key={section.value}
              value={section.value}
              className="mt-6 space-y-6"
            >
              <SectionContainer
                title={section.label}
                description={section.description}
                variant="compact"
                contentClassName="space-y-4"
              >
                {section.content}
              </SectionContainer>
            </TabsContent>
          ))}
        </Tabs>
      </PageContainer>
    </>
  );
}

function WorkspaceStatus({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 px-3 py-2">
      <div className="text-xs font-medium uppercase text-slate-500">
        {label}
      </div>
      <div className="mt-1 truncate font-semibold text-slate-900">{value}</div>
    </div>
  );
}
