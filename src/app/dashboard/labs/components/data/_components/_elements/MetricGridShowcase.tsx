"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import StatCard from "@/components/ui-library/metrics/StatCard";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import { SubsectionTitle } from "@/components/type/titles";
import { Database, Clock, MemoryStick } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { CARD_TOKENS } from "./cardTokens";

/**
 * MetricGrid showcase - responsive grids of stat cards
 */
export default function MetricGridShowcase() {
  return (
    <SectionContainer
      title="Metric Grid"
      description="Responsive grid container for metric cards"
    >
      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <SubsectionTitle>3 Columns</SubsectionTitle>
            <span className="text-xs text-muted-foreground">gap md</span>
          </div>
          <MetricGrid columns={3} gap="md">
            <StatCard
              title="Collections"
              value={1234}
              icon={<Database className="h-4 w-4 text-blue-500" />}
            />
            <StatCard
              title="Average Time"
              value="45s"
              icon={<Clock className="h-4 w-4 text-purple-500" />}
            />
            <StatCard
              title="Memory Usage"
              value="256MB"
              icon={<MemoryStick className="h-4 w-4 text-cyan-500" />}
            />
          </MetricGrid>
          <ComponentRef token={CARD_TOKENS.metricGrid.cols3} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <SubsectionTitle>4 Columns</SubsectionTitle>
            <span className="text-xs text-muted-foreground">gap sm</span>
          </div>
          <MetricGrid columns={4} gap="sm">
            <StatCard title="Total" value={1000} />
            <StatCard title="Active" value={750} />
            <StatCard title="Pending" value={200} />
            <StatCard title="Failed" value={50} />
          </MetricGrid>
          <ComponentRef token={CARD_TOKENS.metricGrid.cols4} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <SubsectionTitle>Compact 2 Columns</SubsectionTitle>
            <span className="text-xs text-muted-foreground">gap sm</span>
          </div>
          <MetricGrid columns={2} gap="sm">
            <StatCard title="Column 1" value={100} />
            <StatCard title="Column 2" value={200} />
          </MetricGrid>
          <ComponentRef token={CARD_TOKENS.metricGrid.cols2Compact} />
        </div>
      </div>
    </SectionContainer>
  );
}
