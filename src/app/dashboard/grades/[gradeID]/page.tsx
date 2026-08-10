"use client";

import { useGradeByID } from "@/hooks/grades/useGradeByID";
import { useParams } from "next/navigation";

import {
  Activity,
  Calendar,
  ChevronDown,
  DatabaseIcon,
  ExternalLinkIcon,
  Info,
  Search,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { GradeTeamsTable } from "./components/gradeTeamsTable";
import TriggerFixtureDiscoveryButton from "./components/TriggerFixtureDiscoveryButton";
import GradeRemoveFixturesTrigger from "./components/GradeRemoveFixturesTrigger";
import TriggerResultBatchScrapeButton from "@/app/dashboard/competitions/components/TriggerResultBatchScrapeButton";
import { daysFromToday } from "@/lib/utils";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingState, ErrorState, StatusBadge } from "@/components/ui-library";
import type { ReactNode } from "react";

function formatDate(value?: string | null): string {
  if (!value) return "-";
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

  if (isError) {
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

  const daysSinceUpdate = grade?.topLineData.updatedAt
    ? daysFromToday(grade.topLineData.updatedAt)
    : null;
  const gradeId = grade?.topLineData.id ?? 0;
  const competitionId = grade?.competitionData.id ?? 0;
  const associationId = grade?.competitionData.association.id;
  const cmsUrl =
    strapiLocation?.grade && gradeId > 0
      ? `${strapiLocation.grade}${gradeId}`
      : null;

  return (
    <>
      <CreatePageTitle
        title={grade?.competitionData.competitionName || "Grade Details"}
        byLine={`${grade?.competitionData.association.name} - ${grade?.competitionData.season}`}
        byLineBottom={grade?.topLineData.gradeName}
        image={
          grade?.competitionData.association.Logo || "/placeholder-logo.png"
        }
      />

      <PageContainer padding="xs" spacing="lg">
        <Tabs defaultValue="snapshot" className="w-full">
          <TabsList variant="primary" className="mb-4">
            <TabsTrigger value="snapshot">Grade Snapshot</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
          </TabsList>

          <TabsContent value="snapshot" className="space-y-6">
            <SectionContainer
              title="Grade Snapshot"
              description="Operational context and collection actions for this grade."
              action={
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {competitionId > 0 && (
                    <Button asChild variant="primary" size="sm">
                      <Link href={`/dashboard/competitions/${competitionId}`}>
                        <Trophy className="h-4 w-4" />
                        View Competition
                      </Link>
                    </Button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="primary" size="sm">
                        <ExternalLinkIcon className="h-4 w-4" />
                        Open
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Destinations</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {grade?.topLineData.url ? (
                        <DropdownMenuItem asChild>
                          <Link
                            href={grade.topLineData.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLinkIcon className="h-4 w-4" />
                            View on PlayHQ
                          </Link>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem disabled>
                          <ExternalLinkIcon className="h-4 w-4" />
                          View on PlayHQ
                        </DropdownMenuItem>
                      )}
                      {cmsUrl ? (
                        <DropdownMenuItem asChild>
                          <Link
                            href={cmsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <DatabaseIcon className="h-4 w-4" />
                            Open in CMS
                          </Link>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem disabled>
                          <DatabaseIcon className="h-4 w-4" />
                          Open in CMS
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="accent" size="sm">
                        <Search className="h-4 w-4" />
                        Data actions
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                      <DropdownMenuLabel>
                        Queue background jobs
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <TriggerFixtureDiscoveryButton
                        gradeId={gradeId}
                        disabled={!gradeId}
                        triggerMode="menu-item"
                      />
                      <TriggerResultBatchScrapeButton
                        sourceType="grade"
                        sourceId={gradeId}
                        disabled={!gradeId}
                        triggerMode="menu-item"
                      />
                      <GradeRemoveFixturesTrigger
                        gradeId={gradeId}
                        associationId={associationId}
                        disabled={!gradeId}
                        triggerMode="menu-item"
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              }
            >
              <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
                <SnapshotMetric
                  title="Teams"
                  value={String(grade?.teamData?.length ?? 0)}
                  detail="Linked to this grade"
                  icon={<Users className="h-4 w-4" />}
                />
                <SnapshotMetric
                  title="Age Group"
                  value={grade?.topLineData.ageGroup || "N/A"}
                  detail={grade?.topLineData.gender || "Gender not provided"}
                  icon={<Info className="h-4 w-4" />}
                />
                <SnapshotMetric
                  title="Days Played"
                  value={grade?.topLineData.daysPlayed || "N/A"}
                  detail={grade?.competitionData.season || "Season unknown"}
                  icon={<Calendar className="h-4 w-4" />}
                />
                <SnapshotMetric
                  title="Last Synced"
                  value={
                    daysSinceUpdate !== null
                      ? `${daysSinceUpdate}d ago`
                      : "Unknown"
                  }
                  detail={formatDate(grade?.topLineData.updatedAt)}
                  icon={<Activity className="h-4 w-4" />}
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <StatusBadge
                  status={grade?.competitionData.status === "Active"}
                  trueLabel="Active"
                  falseLabel="Inactive"
                />
                <Badge variant="outline" className="bg-slate-50 text-slate-600">
                  Grade #{gradeId || "N/A"}
                </Badge>
                <Badge variant="outline" className="bg-slate-50 text-slate-600">
                  PlayHQ ID {grade?.topLineData.gradeId || "N/A"}
                </Badge>
                {daysSinceUpdate !== null && (
                  <span suppressHydrationWarning>
                    <StatusBadge
                      status={daysSinceUpdate < 7}
                      variant={daysSinceUpdate < 7 ? "info" : "warning"}
                      trueLabel={`Updated ${daysSinceUpdate} days ago`}
                      falseLabel={`Updated ${daysSinceUpdate} days ago`}
                    />
                  </span>
                )}
              </div>
            </SectionContainer>
          </TabsContent>

          <TabsContent value="teams">
            <GradeTeamsTable />
          </TabsContent>
        </Tabs>
      </PageContainer>
    </>
  );
}

interface SnapshotMetricProps {
  title: string;
  value: string;
  detail: string;
  icon: ReactNode;
}

function SnapshotMetric({ title, value, detail, icon }: SnapshotMetricProps) {
  return (
    <div className="flex min-w-0 items-center gap-3 border-b border-slate-200 px-4 py-3 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-slate-50 text-slate-500">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <p className="truncate text-lg font-semibold leading-none text-slate-900">
            {value}
          </p>
          <p className="truncate text-xs font-medium uppercase text-slate-500">
            {title}
          </p>
        </div>
        <p className="mt-1 truncate text-xs text-slate-500">{detail}</p>
      </div>
    </div>
  );
}
