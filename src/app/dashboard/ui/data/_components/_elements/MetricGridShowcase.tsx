"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import StatCard from "@/components/ui-library/metrics/StatCard";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import { Database, Clock, MemoryStick } from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Metric Grid Showcase
 *
 * Displays MetricGrid component examples
 */
export default function MetricGridShowcase() {
  return (
    <SectionContainer
      title="Metric Grid"
      description="Responsive grid container for metric cards"
    >
      <div className="space-y-6">
        <ElementContainer title="3 Column Grid">
          <MetricGrid columns={3} gap="lg">
            <StatCard
              title="Collections"
              value={1234}
              icon={<Database className="h-6 w-6 text-blue-500" />}
            />
            <StatCard
              title="Average Time"
              value="45s"
              icon={<Clock className="h-6 w-6 text-purple-500" />}
            />
            <StatCard
              title="Memory Usage"
              value="256MB"
              icon={<MemoryStick className="h-6 w-6 text-cyan-500" />}
            />
          </MetricGrid>
          <div className="mt-6">
            <CodeExample
              code={`import MetricGrid from "@/components/ui-library/metrics/MetricGrid";

<MetricGrid columns={3} gap="lg">
  <StatCard title="Collections" value={1234} />
  <StatCard title="Average Time" value="45s" />
  <StatCard title="Memory Usage" value="256MB" />
</MetricGrid>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="4 Column Grid">
          <MetricGrid columns={4} gap="md">
            <StatCard title="Total" value={1000} />
            <StatCard title="Active" value={750} />
            <StatCard title="Pending" value={200} />
            <StatCard title="Failed" value={50} />
          </MetricGrid>
          <div className="mt-6">
            <CodeExample
              code={`<MetricGrid columns={4} gap="md">
  <StatCard title="Total" value={1000} />
  <StatCard title="Active" value={750} />
  <StatCard title="Pending" value={200} />
  <StatCard title="Failed" value={50} />
</MetricGrid>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Grid Options">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Columns: 1, 2, 3, or 4
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Gap: sm, md, or lg
              </p>
            </div>
            <MetricGrid columns={2} gap="sm">
              <StatCard title="Column 1" value={100} />
              <StatCard title="Column 2" value={200} />
            </MetricGrid>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<MetricGrid columns={2} gap="sm">
  <StatCard title="Column 1" value={100} />
  <StatCard title="Column 2" value={200} />
</MetricGrid>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}

