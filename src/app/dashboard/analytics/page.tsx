import CreatePage from "@/components/scaffolding/containers/createPage";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import { SectionTitle } from "@/components/type/titles";

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
    <CreatePage>
      <CreatePageTitle
        title="Analytics Dashboard"
        byLine="Business Intelligence"
      />

      <section className="flex flex-col gap-8 my-8">
        <SectionTitle>Global Overview</SectionTitle>
        <GlobalAnalyticsWidget />
      </section>

      <section className="flex flex-col gap-8 my-8">
        <SectionTitle>Revenue Trends</SectionTitle>
        <RevenueChart />
      </section>

      <section className="flex flex-col gap-8 my-8">
        <SectionTitle>Trial Conversion</SectionTitle>
        <TrialConversionWidget />
      </section>

      <section className="flex flex-col gap-8 my-8">
        <SectionTitle>Subscription Lifecycle</SectionTitle>
        <SubscriptionTrendsWidget />
      </section>

      <section className="flex flex-col gap-8 my-8">
        <SectionTitle>Cohort Retention</SectionTitle>
        <CohortRetentionWidget />
      </section>
    </CreatePage>
  );
}
