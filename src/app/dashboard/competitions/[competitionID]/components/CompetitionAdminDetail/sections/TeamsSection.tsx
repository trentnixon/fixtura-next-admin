"use client";

import { Fragment, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
import { CompetitionAdminDetailResponse } from "@/types/competitionAdminDetail";

function AccountStatus({ linked }: { linked: boolean }) {
  const Icon = linked ? CheckCircle2 : XCircle;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium",
        linked
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-rose-200 bg-rose-50 text-rose-700",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {linked ? "Account linked" : "No account"}
    </span>
  );
}

interface TeamsSectionProps {
  teams: CompetitionAdminDetailResponse["analytics"]["tables"]["teams"];
  clubs: CompetitionAdminDetailResponse["clubs"];
}

export function TeamsSection({ teams, clubs }: TeamsSectionProps) {
  const MAX_VISIBLE_GRADES = 3;
  const clubLookup = useMemo(() => {
    const map = new Map<
      number,
      CompetitionAdminDetailResponse["clubs"][number]
    >();
    clubs.forEach((club) => {
      map.set(club.id, club);
    });
    return map;
  }, [clubs]);

  const groupedTeams = useMemo(() => {
    const map = new Map<
      string,
      {
        key: string;
        clubName: string;
        clubId: number | null;
        clubHasAccount: boolean;
        clubAccountNames: string[];
        clubAccountId: number | null;
        teams: TeamsSectionProps["teams"];
      }
    >();

    teams.forEach((team) => {
      const teamAccountNames = team.clubAccountNames ?? [];
      const clubName = team.clubName ?? "Independent / Unassigned";
      const groupKey =
        team.clubId !== null
          ? `club-${team.clubId}`
          : `club-${clubName.toLowerCase()}`;
      const existing = map.get(groupKey);
      const clubRecord =
        team.clubId !== null ? clubLookup.get(team.clubId) : undefined;
      const recordAccountNames = (clubRecord?.accounts ?? [])
        .map((account) => account.name)
        .filter((name): name is string => Boolean(name));
      const recordHasAccount =
        clubRecord?.hasFixturaAccount ?? team.clubHasFixturaAccount;
      const primaryAccountId = clubRecord?.accounts?.[0]?.id ?? null;

      const clubLinked = recordHasAccount || team.clubHasFixturaAccount;

      if (existing) {
        existing.clubHasAccount = existing.clubHasAccount || clubLinked;
        if (existing.clubId === null && team.clubId !== null) {
          existing.clubId = team.clubId;
        }
        if (recordAccountNames.length > 0 || teamAccountNames.length > 0) {
          existing.clubAccountNames = Array.from(
            new Set([
              ...existing.clubAccountNames,
              ...teamAccountNames,
              ...recordAccountNames,
            ]),
          );
        }
        if (existing.clubAccountId === null && primaryAccountId !== null) {
          existing.clubAccountId = primaryAccountId;
        }
        existing.teams.push(team);
      } else {
        map.set(groupKey, {
          key: groupKey,
          clubName,
          clubId: team.clubId,
          clubHasAccount: clubLinked,
          clubAccountNames: Array.from(
            new Set([...teamAccountNames, ...recordAccountNames]),
          ),
          clubAccountId: primaryAccountId,
          teams: [team],
        });
      }
    });

    return Array.from(map.values())
      .map((group) => ({
        ...group,
        teams: [...group.teams].sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
        ),
      }))
      .sort((a, b) =>
        a.clubName.localeCompare(b.clubName, undefined, {
          sensitivity: "base",
        }),
      );
  }, [teams, clubLookup]);

  return (
    <SectionContainer
      title="Teams"
      description="Teams participating in this competition with club linkage details."
    >
      <ScrollArea className="w-full">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="min-w-[280px]">Team</TableHead>
              <TableHead className="min-w-[260px]">Grades</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedTeams.map((group) => (
              <Fragment key={group.key}>
                <TableRow className="border-y border-slate-200 bg-slate-50 hover:bg-slate-50">
                  <TableCell colSpan={3} className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex min-w-0 flex-wrap items-center gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {group.clubName}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {group.teams.length}{" "}
                            {group.teams.length === 1 ? "team" : "teams"}
                            {group.clubAccountNames.length > 0
                              ? ` - Contacts: ${group.clubAccountNames.join(", ")}`
                              : ""}
                          </p>
                        </div>
                        <AccountStatus linked={group.clubHasAccount} />
                      </div>
                      <div className="flex items-center gap-2">
                        {group.clubId !== null ? (
                          <Button asChild size="sm" variant="accent">
                            <Link href={`/dashboard/clubs/${group.clubId}`}>
                              View Club
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        ) : null}
                        {group.clubHasAccount &&
                        group.clubAccountId !== null ? (
                          <Button asChild size="sm" variant="primary">
                            <Link
                              href={`/dashboard/accounts/club/${group.clubAccountId}`}
                            >
                              View Account
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
                {group.teams.map((team) => {
                  const teamGrades = team.grades ?? [];

                  return (
                    <TableRow key={team.id}>
                      <TableCell>
                        <div className="min-w-0 border-l-2 border-slate-200 pl-4">
                          <p className="truncate text-sm font-medium text-slate-900">
                            {team.name}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Team #{team.id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {teamGrades.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-2">
                            {teamGrades
                              .slice(0, MAX_VISIBLE_GRADES)
                              .map((grade) => (
                                <Badge
                                  key={grade.id}
                                  variant="outline"
                                  className="bg-slate-50 text-slate-600"
                                >
                                  {grade.name ?? `Grade #${grade.id}`}
                                </Badge>
                              ))}
                            {teamGrades.length > MAX_VISIBLE_GRADES && (
                              <Badge variant="secondary">
                                +{teamGrades.length - MAX_VISIBLE_GRADES} more
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild size="sm" variant="primary">
                          <Link href={`/dashboard/teams/${team.id}`}>
                            View
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </SectionContainer>
  );
}
