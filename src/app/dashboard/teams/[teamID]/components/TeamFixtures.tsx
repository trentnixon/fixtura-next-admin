"use client";

import { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Database, ExternalLink } from "lucide-react";

import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { SnapshotMetric } from "@/app/dashboard/fixtures/_components/_utils/snapshotMetric";
import {
  getRowColorClass,
  getStatusBadge,
} from "@/app/dashboard/fixtures/_components/_utils/statusUtils";
import { toFixtureDisplayText } from "@/app/dashboard/fixtures/_components/_utils/fixtureDisplayText";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui-library";
import {
  sectionTabListClass,
  sectionTabTriggerClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import type { GameMetaData, TeamData } from "@/types/teamsById";
import {
  classifyTeamFixture,
  formatStoredDate,
  playHqUrl,
  teamFixtureOpponent,
  teamFixtureScore,
  teamFixtureSortTime,
  type TeamFixtureGroup,
} from "./teamFixtureModel";

const fixtureTabs = [
  { value: "scheduled", label: "Scheduled", icon: CalendarDays },
  { value: "complete", label: "Complete", icon: CheckCircle2 },
] as const;

const fixtureCopy: Record<TeamFixtureGroup, { detail: string; empty: string }> =
  {
    scheduled: {
      detail: "Still to play",
      empty: "No scheduled fixtures for this team.",
    },
    complete: {
      detail: "Final, abandoned, or marked finished",
      empty: "No completed fixtures for this team.",
    },
  };

export interface TeamFixturesProps {
  team: TeamData;
  cmsFixtureBase: string;
}

function cmsFixtureUrl(base: string, gameId: number): string | null {
  if (!base || gameId <= 0) return null;
  return `${base}${gameId}`;
}

export function TeamFixtures({ team, cmsFixtureBase }: TeamFixturesProps) {
  const teamName = team.TopLineData?.teamName?.trim() ?? "";
  const games = useMemo(() => team.gameMetaData ?? [], [team.gameMetaData]);
  const sport = team.association?.Sport?.trim() || "Unknown sport";

  const grouped = useMemo(() => {
    const scheduled: GameMetaData[] = [];
    const complete: GameMetaData[] = [];

    for (const game of games) {
      if (classifyTeamFixture(game) === "complete") {
        complete.push(game);
      } else {
        scheduled.push(game);
      }
    }

    scheduled.sort(
      (a, b) => teamFixtureSortTime(a) - teamFixtureSortTime(b),
    );
    complete.sort((a, b) => teamFixtureSortTime(b) - teamFixtureSortTime(a));

    return { scheduled, complete };
  }, [games]);

  const [listGroup, setListGroup] = useState<TeamFixtureGroup>(
    grouped.scheduled.length > 0 ? "scheduled" : "complete",
  );

  const showScore = games.some((game) => teamFixtureScore(game) !== null);
  const rows = grouped[listGroup];
  const columnCount = showScore ? 7 : 6;

  if (games.length === 0) {
    return (
      <SectionContainer
        title="Fixtures"
        description={`${sport} games linked to this team.`}
        icon={<CalendarDays className="h-5 w-5 text-slate-500" aria-hidden />}
      >
        <EmptyState
          title="No fixtures stored"
          description="This team has no game metadata yet."
          variant="minimal"
        />
      </SectionContainer>
    );
  }

  return (
    <SectionContainer
      title="Fixtures"
      description={`${games.length} ${sport} fixture${games.length === 1 ? "" : "s"} linked to this team.`}
      icon={<CalendarDays className="h-5 w-5 text-slate-500" aria-hidden />}
    >
      <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-3">
        <SnapshotMetric
          title="Total"
          value={String(games.length)}
          detail="Linked to this team"
          icon={<CalendarDays className="h-4 w-4" />}
        />
        <SnapshotMetric
          title="Scheduled"
          value={String(grouped.scheduled.length)}
          detail={fixtureCopy.scheduled.detail}
          icon={<CalendarDays className="h-4 w-4" />}
        />
        <SnapshotMetric
          title="Complete"
          value={String(grouped.complete.length)}
          detail={fixtureCopy.complete.detail}
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
      </div>

      <Tabs
        value={listGroup}
        onValueChange={(value) => {
          if (value === "scheduled" || value === "complete") {
            setListGroup(value);
          }
        }}
      >
        <TabsList variant="primary" className={sectionTabListClass}>
          {fixtureTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                variant="section"
                className={sectionTabTriggerClass}
              >
                <Icon className="h-4 w-4 shrink-0 text-current" aria-hidden />
                {tab.label} ({grouped[tab.value].length})
              </TabsTrigger>
            );
          })}
        </TabsList>
        <TabsContent value={listGroup} className="mt-4 space-y-4">
          <p className="text-sm text-slate-500">{fixtureCopy[listGroup].detail}</p>
          <div className="overflow-hidden rounded-md border">
            <ScrollArea className="w-full">
              <Table className="min-w-[760px]">
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead>Date</TableHead>
                    <TableHead>Opposition</TableHead>
                    <TableHead>Ground</TableHead>
                    <TableHead>Round</TableHead>
                    <TableHead>Status</TableHead>
                    {showScore ? <TableHead>Score</TableHead> : null}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={columnCount}
                        className="py-8 text-center text-sm text-muted-foreground"
                      >
                        {fixtureCopy[listGroup].empty}
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((game) => {
                      const opposition = teamFixtureOpponent(game, teamName);
                      const score = teamFixtureScore(game);
                      const playHq = playHqUrl(game.urlToScoreCard);
                      const cmsUrl = cmsFixtureUrl(cmsFixtureBase, game.id);
                      const time = game.time?.trim();

                      return (
                        <TableRow
                          key={game.id}
                          className={getRowColorClass(game.status)}
                        >
                          <TableCell className="whitespace-nowrap text-sm">
                            <div>{formatStoredDate(game.date)}</div>
                            {time ? (
                              <div className="text-xs text-slate-500">{time}</div>
                            ) : null}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium text-slate-900">
                              {opposition.opponent}
                            </div>
                            <div className="text-xs text-slate-500">
                              {opposition.side === "Unmatched"
                                ? "Fixture"
                                : opposition.side}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {toFixtureDisplayText(game.ground)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm">
                            {toFixtureDisplayText(game.round)}
                          </TableCell>
                          <TableCell>{getStatusBadge(game.status)}</TableCell>
                          {showScore ? (
                            <TableCell className="text-sm">
                              {score || "—"}
                            </TableCell>
                          ) : null}
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <DashboardLinkButton
                                href={`/dashboard/fixtures/${game.id}`}
                                trailingIcon="arrow"
                              >
                                View
                              </DashboardLinkButton>
                              {playHq ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  asChild
                                >
                                  <a
                                    href={playHq}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Open on PlayHQ"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </Button>
                              ) : null}
                              {cmsUrl ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  asChild
                                >
                                  <a
                                    href={cmsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Open in CMS"
                                  >
                                    <Database className="h-4 w-4" />
                                  </a>
                                </Button>
                              ) : null}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </SectionContainer>
  );
}
