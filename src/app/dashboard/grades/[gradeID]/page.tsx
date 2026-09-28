"use client";

import { useGradeByID } from "@/hooks/grades/useGradeByID";
import { useParams } from "next/navigation";
import { CalendarDays, Gauge } from "lucide-react";

import { useGlobalContext } from "@/components/providers/GlobalContext";
import { GradeTeamsTable } from "./components/gradeTeamsTable";
import { GradeFixturesTable } from "./components/GradeFixturesTable";
import { GradeSnapshotSection } from "./components/GradeSnapshotSection";
import { daysFromToday } from "@/lib/utils";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingState, ErrorState } from "@/components/ui-library";
import {
  sectionTabListClass,
  sectionTabTriggerClass,
} from "@/lib/actions/siteNavigationButtonStyles";

const gradeDetailTabs = [
  { value: "snapshot", label: "Snapshot", icon: Gauge },
  { value: "fixtures", label: "Fixtures", icon: CalendarDays },
] as const;

function formatTitleDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Australia/Sydney",
  }).format(date);
}

export default function DisplayGradeInRender() {
  const { gradeID } = useParams();
  const { strapiLocation } = useGlobalContext();
  const {
    data: grade,
    isLoading,
    isError,
    error,
  } = useGradeByID(gradeID ? parseInt(gradeID as string) : 0);

  if (isLoading) {
    return <LoadingState message="Loading grade details..." />;
  }

  if (isError || !grade) {
    return (
      <ErrorState
        title="Error Loading Grade"
        error={
          error instanceof Error
            ? error
            : "We encountered an issue while fetching the grade information."
        }
        description="We encountered an issue while fetching the grade information."
      />
    );
  }

  const daysSinceUpdate = grade.topLineData.updatedAt
    ? daysFromToday(grade.topLineData.updatedAt)
    : null;
  const gradeId = grade.topLineData.id ?? 0;
  const competitionId = grade.competitionData.id ?? 0;
  const associationId = grade.competitionData.association.id;
  const cmsUrl =
    strapiLocation?.grade && gradeId > 0
      ? `${strapiLocation.grade}${gradeId}`
      : null;

  return (
    <>
      <CreatePageTitle
        title={grade.topLineData.gradeName || "Grade Details"}
        byLine={`${grade.competitionData.association.name} • ${grade.competitionData.season}`}
        byLineBottom={`${grade.competitionData.competitionName} • Last synced ${formatTitleDate(
          grade.topLineData.updatedAt,
        )}`}
        image={
          grade.competitionData.association.Logo || "/placeholder-logo.png"
        }
      />

      <PageContainer padding="xs" spacing="lg">
        <Tabs defaultValue="snapshot" className="w-full min-w-0 max-w-full">
          <div className="pb-8">
            <TabsList variant="primary" className={sectionTabListClass}>
              {gradeDetailTabs.map((tab) => {
                const Icon = tab.icon;

                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    variant="section"
                    className={sectionTabTriggerClass}
                  >
                    <Icon
                      className="h-4 w-4 shrink-0 text-current"
                      aria-hidden
                    />
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <TabsContent value="snapshot" className="mt-0 space-y-6">
            <GradeSnapshotSection
              grade={grade}
              gradeId={gradeId}
              competitionId={competitionId}
              associationId={associationId}
              cmsUrl={cmsUrl}
              daysSinceUpdate={daysSinceUpdate}
            />
            <GradeTeamsTable />
          </TabsContent>

          <TabsContent value="fixtures" className="mt-0">
            {gradeId > 0 ? <GradeFixturesTable gradeId={gradeId} /> : null}
          </TabsContent>
        </Tabs>
      </PageContainer>
    </>
  );
}
