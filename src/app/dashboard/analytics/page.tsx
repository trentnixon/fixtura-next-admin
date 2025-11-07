import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

import { SubscriptionTrendsWidget } from "./components/SubscriptionTrendsWidget";
import { GlobalAnalyticsWidget } from "./components/GlobalAnalyticsWidget";
import { TrialConversionWidget } from "./components/TrialConversionWidget";
import { RevenueChart } from "./components/RevenueChart";
import { CohortRetentionWidget } from "./components/CohortRetentionWidget";

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
        title="Analytics Dashboard"
        byLine="Business Intelligence"
      />
      <PageContainer padding="lg" spacing="lg">
        <SectionContainer
          title="Global Overview"
          description="System-wide metrics and comprehensive analysis"
        >
          <GlobalAnalyticsWidget />
        </SectionContainer>

        <SectionContainer
          title="Revenue Trends"
          description="Monthly and quarterly revenue patterns"
        >
          <RevenueChart />
        </SectionContainer>

        <SectionContainer
          title="Trial Conversion"
          description="Trial progression and conversion funnel analysis"
        >
          <TrialConversionWidget />
        </SectionContainer>

        <SectionContainer
          title="Subscription Lifecycle"
          description="Subscription stages, renewals, and churn patterns"
        >
          <SubscriptionTrendsWidget />
        </SectionContainer>

        <SectionContainer
          title="Cohort Retention"
          description="Customer acquisition and retention by cohort"
        >
          <CohortRetentionWidget />
        </SectionContainer>
      </PageContainer>
    </>
  );
}
