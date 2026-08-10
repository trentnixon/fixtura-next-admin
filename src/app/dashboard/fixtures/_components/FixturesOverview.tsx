"use client";

import { useState } from "react";
import { FixturesStats } from "./FixturesStats";
import { AssociationSelector } from "./AssociationSelector";
import { AssociationFixturesTable } from "./AssociationFixturesTable";
import { FixturesTimeline } from "./FixturesTimeline";
import { FixturesDistributions } from "./FixturesDistributions";
import { TopEntities } from "./TopEntities";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, CalendarDays, Gauge, ListTree } from "lucide-react";

const fixtureTabs = [
  {
    value: "snapshot",
    label: "Snapshot",
    icon: Gauge,
  },
  {
    value: "timeline",
    label: "Timeline",
    icon: CalendarDays,
  },
  {
    value: "coverage",
    label: "Coverage",
    icon: BarChart3,
  },
  {
    value: "associations",
    label: "Associations",
    icon: ListTree,
  },
] as const;

/**
 * FixturesOverview Component
 *
 * Main container for the fixtures page.
 * Shows statistics and allows users to select an association to view its fixtures.
 */
export default function FixturesOverview() {
  const [selectedAssociation, setSelectedAssociation] = useState<number | null>(
    null,
  );

  return (
    <Tabs defaultValue="snapshot" className="w-full min-w-0 max-w-full">
      <TabsList className="mb-4 h-auto w-full flex-wrap justify-start rounded-md bg-slate-100 p-1 lg:w-auto">
        {fixtureTabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="min-h-10 gap-2"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="snapshot" className="mt-6 space-y-6">
        <FixturesStats />
      </TabsContent>

      <TabsContent value="timeline" className="mt-6 space-y-6">
        <SectionContainer
          title="Fixture Timing"
          description="Daily fixture volume and status movement across the active fixture window."
        >
          <div className="grid gap-6 lg:grid-cols-3">
            <FixturesTimeline />
          </div>
        </SectionContainer>
      </TabsContent>

      <TabsContent value="coverage" className="mt-6 space-y-6">
        <SectionContainer
          title="Fixture Coverage"
          description="Status mix, weekly distribution, and high-volume fixture entities."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <FixturesDistributions />
          </div>
        </SectionContainer>

        <div className="grid gap-6">
          <TopEntities />
        </div>
      </TabsContent>

      <TabsContent value="associations" className="mt-6">
        {selectedAssociation === null ? (
          <AssociationSelector
            onSelect={(associationId) => setSelectedAssociation(associationId)}
          />
        ) : (
          <AssociationFixturesTable
            associationId={selectedAssociation}
            onBack={() => setSelectedAssociation(null)}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
