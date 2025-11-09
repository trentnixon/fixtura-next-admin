"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Activity,
  BarChart3,
  Building,
  Calendar,
  ExternalLink,
  Gauge,
  LineChart,
  PieChart as PieChartIcon,
  ShieldCheck,
} from "lucide-react";

import { useCompetitionAdminDetail } from "@/hooks/competitions/useCompetitionAdminDetail";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import StatCard from "@/components/ui-library/metrics/StatCard";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ChartCard from "@/components/modules/charts/ChartCard";
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString();
}

function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `${value.toFixed(0)}%`;
}

export default function CompetitionAdminDetail() {
  const { competitionID } = useParams<{ competitionID: string }>();
  const competitionId = Number(competitionID);
  const { strapiLocation } = useGlobalContext();

  const { data, isLoading, isFetching, isError, error, refetch } =
    useCompetitionAdminDetail(
      Number.isNaN(competitionId) ? undefined : competitionId
    );

  const gradeChartConfig: ChartConfig = useMemo(
    () => ({
      teamCount: { label: "Teams", color: "hsl(var(--chart-1))" },
    }),
    []
  );

  const clubPenetrationConfig: ChartConfig = useMemo(
    () => ({
      count: { label: "Clubs", color: "hsl(var(--chart-2))" },
    }),
    []
  );

  const timelineChartConfig: ChartConfig = useMemo(
    () => ({
      days: { label: "Days", color: "hsl(var(--chart-3))" },
    }),
    []
  );

  if (isLoading && !data) {
    return <LoadingState message="Loading competition detail..." />;
  }

  if (isError) {
    return (
      <ErrorState
        error={
          error instanceof Error
            ? error
            : new Error("Failed to load competition detail.")
        }
        onRetry={refetch}
      />
    );
  }

  if (!data) {
    return null;
  }

  const { meta, association, counts, analytics, grades } = data;
  const timeline = analytics.summary.timeline;

  const timelineChartData =
    analytics.charts.timelineProgress.length > 0
      ? analytics.charts.timelineProgress
      : [
          { segment: "elapsed", days: timeline.daysElapsed ?? 0 },
          { segment: "remaining", days: timeline.daysRemaining ?? 0 },
        ];

  return (
    <>
      <CreatePageTitle
        title={meta.name}
        byLine={
          association
            ? `${association.name} • ${meta.season ?? "Season unknown"}`
            : meta.season ?? "Season unknown"
        }
        byLineBottom={`Status: ${meta.status} • Last synced ${formatDate(
          meta.lastSyncedAt
        )}`}
      />

      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Competition Snapshot"
          description="Key stats for the selected competition."
          action={
            <div className="flex items-center gap-2">
              {meta.url && (
                <Button asChild variant="outline" size="sm">
                  <Link
                    href={meta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Competition
                  </Link>
                </Button>
              )}
              <Button
                asChild
                variant="outline"
                size="sm"
                disabled={!strapiLocation?.competition}
              >
                <Link
                  href={
                    strapiLocation?.competition
                      ? `${strapiLocation.competition}${meta.id}`
                      : "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ShieldCheck className="h-4 w-4 mr-1" />
                  Open in CMS
                </Link>
              </Button>
              {isFetching && (
                <Badge variant="outline" className="ml-2">
                  Refreshing…
                </Badge>
              )}
            </div>
          }
        >
          <MetricGrid columns={4} gap="lg">
            <StatCard
              title="Teams"
              value={formatNumber(counts.teamCount)}
              icon={<Activity className="h-5 w-5" />}
              description={`Grades ${formatNumber(
                counts.gradeCount
              )} • Clubs ${formatNumber(counts.clubCount)}`}
              variant="primary"
            />
            <StatCard
              title="Association Accounts"
              value={formatNumber(
                analytics.summary.accountCoverage.association.accountCount
              )}
              icon={<Building className="h-5 w-5" />}
              description={
                analytics.summary.accountCoverage.association.hasAccount
                  ? "Association has Fixtura account"
                  : "Association not onboarded"
              }
              variant="accent"
            />
            <StatCard
              title="Club Coverage"
              value={formatPercent(
                analytics.summary.accountCoverage.clubs.coveragePercent
              )}
              icon={<Gauge className="h-5 w-5" />}
              description={`${formatNumber(
                analytics.summary.accountCoverage.clubs.withAccount
              )} with account • ${formatNumber(
                analytics.summary.accountCoverage.clubs.withoutAccount
              )} without`}
              variant="secondary"
            />
            <StatCard
              title="Timeline Progress"
              value={formatPercent(timeline.progressPercent)}
              icon={<Calendar className="h-5 w-5" />}
              description={`Start: ${formatDate(
                timeline.startDate
              )} • End: ${formatDate(timeline.endDate)}`}
              variant="light"
            />
          </MetricGrid>
        </SectionContainer>

        {association && (
          <SectionContainer
            title="Association Overview"
            description="High-level information about the owning association."
            variant="compact"
          >
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>{association.name}</CardTitle>
                  <CardDescription>
                    Sport: {association.sport ?? "N/A"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    PlayHQ ID: {association.playHqId ?? "—"}
                  </p>
                  <Badge
                    variant={
                      association.hasFixturaAccount ? "default" : "secondary"
                    }
                  >
                    {association.hasFixturaAccount
                      ? "Fixtura Account Linked"
                      : "No Fixtura Account"}
                  </Badge>
                </CardContent>
              </Card>
              <Card className="md:col-span-2 xl:col-span-2">
                <CardHeader>
                  <CardTitle>Association Contacts</CardTitle>
                  <CardDescription>
                    People associated with this competition in Fixtura.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {association.accounts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No linked accounts.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {association.accounts.map((account) => (
                        <Badge key={account.id} variant="outline">
                          {account.name ??
                            ([account.firstName, account.lastName]
                              .filter(Boolean)
                              .join(" ") ||
                              `Account #${account.id}`)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </SectionContainer>
        )}

        <SectionContainer
          title="Analytics"
          description="Visualise grade distribution, club coverage, and timeline progress."
        >
          <div className="grid gap-6 lg:grid-cols-3">
            <ChartCard
              title="Teams per Grade"
              description="Total teams in each grade."
              icon={BarChart3}
              chartConfig={gradeChartConfig}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.charts.gradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="gradeName"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="teamCount"
                    fill="hsl(var(--chart-1))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Club Account Penetration"
              description="Clubs with and without Fixtura accounts."
              icon={PieChartIcon}
              chartConfig={clubPenetrationConfig}
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.charts.clubAccountPenetration}
                    dataKey="count"
                    nameKey="label"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                  >
                    {analytics.charts.clubAccountPenetration.map(
                      (entry, index) => (
                        <Cell
                          key={entry.label}
                          fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                        />
                      )
                    )}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Timeline Progress"
              description="Elapsed vs remaining days for the competition."
              icon={LineChart}
              chartConfig={timelineChartConfig}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timelineChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="segment" />
                  <YAxis allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="days"
                    fill="hsl(var(--chart-3))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </SectionContainer>

        <SectionContainer
          title="Insights"
          description="Actionable recommendations from analytics outputs."
          variant="compact"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Clubs Missing Accounts</CardTitle>
                <CardDescription>
                  Clubs participating without Fixtura accounts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {analytics.insights.clubsMissingAccounts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    All clubs are linked to Fixtura accounts.
                  </p>
                ) : (
                  analytics.insights.clubsMissingAccounts.map((club) => (
                    <div
                      key={club.id}
                      className="flex items-start justify-between gap-4"
                    >
                      <div>
                        <p className="font-medium text-sm">{club.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Teams: {club.teamCount} • Grades:{" "}
                          {club.grades.length > 0
                            ? club.grades.join(", ")
                            : "—"}
                        </p>
                      </div>
                      <Badge variant="secondary">{club.teamCount} teams</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grades Needing Account Support</CardTitle>
                <CardDescription>
                  Grades with low Fixtura account coverage.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {analytics.insights.gradesNeedingAccountSupport.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    All grades meet Fixtura coverage expectations.
                  </p>
                ) : (
                  analytics.insights.gradesNeedingAccountSupport.map(
                    (grade) => (
                      <div
                        key={grade.id}
                        className="flex items-center justify-between gap-4"
                      >
                        <p className="font-medium text-sm">{grade.name}</p>
                        <Badge variant="outline">
                          {grade.teamCount} team
                          {grade.teamCount === 1 ? "" : "s"}
                        </Badge>
                      </div>
                    )
                  )
                )}
              </CardContent>
            </Card>
          </div>
        </SectionContainer>

        <SectionContainer
          title="Grades"
          description="Detailed grade breakdown including coverage and team information."
        >
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Age Group</TableHead>
                  <TableHead>Teams</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead>Clubs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell className="font-medium">{grade.name}</TableCell>
                    <TableCell>{grade.gender ?? "—"}</TableCell>
                    <TableCell>{grade.ageGroup ?? "—"}</TableCell>
                    <TableCell>{formatNumber(grade.teamCount)}</TableCell>
                    <TableCell>
                      {formatPercent(grade.accountCoveragePercent)} (
                      {formatNumber(grade.teamsWithFixturaAccount)} /{" "}
                      {formatNumber(
                        grade.teamsWithoutFixturaAccount +
                          grade.teamsWithFixturaAccount
                      )}
                      )
                    </TableCell>
                    <TableCell>
                      {formatNumber(grade.clubsRepresented)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </SectionContainer>

        <SectionContainer
          title="Clubs"
          description="Participating clubs with Fixtura coverage and competition links."
        >
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Club</TableHead>
                  <TableHead>Fixtura Account</TableHead>
                  <TableHead>Teams</TableHead>
                  <TableHead>Grades</TableHead>
                  <TableHead>Competition URL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.tables.clubs.map((club) => (
                  <TableRow key={club.id}>
                    <TableCell className="font-medium">{club.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={club.hasFixturaAccount ? "default" : "outline"}
                      >
                        {club.hasFixturaAccount ? "Linked" : "Missing"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatNumber(club.teamCount)}</TableCell>
                    <TableCell>
                      {club.grades.length > 0 ? club.grades.join(", ") : "—"}
                    </TableCell>
                    <TableCell>
                      {club.competitionUrl ? (
                        <Link
                          href={club.competitionUrl}
                          target="_blank"
                          className="text-primary underline text-sm"
                        >
                          Open
                        </Link>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </SectionContainer>

        <SectionContainer
          title="Teams"
          description="Teams participating in this competition with club linkage details."
        >
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Age Group</TableHead>
                  <TableHead>Club</TableHead>
                  <TableHead>Club Account</TableHead>
                  <TableHead>Grades</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.tables.teams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell>{team.gender ?? "—"}</TableCell>
                    <TableCell>{team.ageGroup ?? "—"}</TableCell>
                    <TableCell>{team.clubName ?? "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          team.clubHasFixturaAccount ? "default" : "secondary"
                        }
                      >
                        {team.clubHasFixturaAccount ? "Linked" : "Missing"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {team.grades.length > 0
                        ? team.grades
                            .map((grade) => grade.name ?? `Grade #${grade.id}`)
                            .join(", ")
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </SectionContainer>
      </PageContainer>
    </>
  );
}
