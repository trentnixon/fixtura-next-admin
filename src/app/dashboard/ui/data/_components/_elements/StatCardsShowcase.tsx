"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import StatCard from "@/components/ui-library/metrics/StatCard";
import { Database, AlertCircle, Users, TrendingUp } from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Stat Cards Showcase
 *
 * Displays StatCard component examples
 */
export default function StatCardsShowcase() {
  return (
    <SectionContainer
      title="Stat Cards"
      description="Enhanced metric cards with optional trend indicators and theme variants"
    >
      <div className="space-y-6">
        <ElementContainer title="Brand Color Variants">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Primary Theme"
              value={1234}
              icon={<Database className="h-5 w-5" />}
              description="Brand primary color"
              variant="primary"
            />
            <StatCard
              title="Secondary Theme"
              value={567}
              icon={<Users className="h-5 w-5" />}
              description="Brand secondary color"
              variant="secondary"
            />
            <StatCard
              title="Accent Theme"
              value="2.5%"
              icon={<AlertCircle className="h-5 w-5" />}
              description="Brand accent color"
              variant="accent"
            />
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import StatCard from "@/components/ui-library/metrics/StatCard";
import { Database } from "lucide-react";

<StatCard
  title="Primary Theme"
  value={1234}
  variant="primary"
  icon={<Database className="h-5 w-5" />}
  description="Brand primary color"
/>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Light & Dark Themes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard
              title="Light Theme"
              value={1234}
              icon={<Database className="h-5 w-5" />}
              description="Default light theme"
              variant="light"
            />
            <StatCard
              title="Dark Theme"
              value={567}
              icon={<Users className="h-5 w-5" />}
              description="Dark theme variant"
              variant="dark"
            />
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<StatCard
  title="Light Theme"
  value={1234}
  variant="light"
  description="Default light theme"
/>

<StatCard
  title="Dark Theme"
  value={567}
  variant="dark"
  description="Dark theme variant"
/>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="With Trend Indicators">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Total Collections"
              value={1234}
              trend={+5.2}
              icon={<Database className="h-5 w-5" />}
              description="Last 30 days"
              variant="primary"
            />
            <StatCard
              title="Active Users"
              value={567}
              trend={-2.1}
              icon={<Users className="h-5 w-5" />}
              description="Last 7 days"
              variant="secondary"
            />
            <StatCard
              title="Error Rate"
              value="2.5%"
              trend={0}
              trendLabel="No change"
              icon={<AlertCircle className="h-5 w-5" />}
              description="Last 24 hours"
              variant="accent"
            />
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<StatCard
  title="Total Collections"
  value={1234}
  trend={+5.2}
  variant="primary"
  icon={<Database className="h-5 w-5" />}
  description="Last 30 days"
/>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Dark Theme with Trends">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Revenue"
              value="$12.5K"
              trend={+8.3}
              icon={<TrendingUp className="h-5 w-5" />}
              description="This month"
              variant="dark"
            />
            <StatCard
              title="Orders"
              value={892}
              trend={-1.2}
              icon={<Database className="h-5 w-5" />}
              description="Last week"
              variant="dark"
            />
            <StatCard
              title="Customers"
              value={1247}
              trend={+12.5}
              icon={<Users className="h-5 w-5" />}
              description="This quarter"
              variant="dark"
            />
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<StatCard
  title="Revenue"
  value="$12.5K"
  trend={+8.3}
  variant="dark"
  description="This month"
/>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
