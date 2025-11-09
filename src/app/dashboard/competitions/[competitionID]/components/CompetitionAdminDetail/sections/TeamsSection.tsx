"use client";

import { Fragment, useMemo } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowUpRight } from "lucide-react";

import { CompetitionAdminDetailResponse } from "@/types/competitionAdminDetail";

function AccountStatusIcon({ linked }: { linked: boolean }) {
  const Icon = linked ? CheckCircle2 : XCircle;
  return (
    <Icon
      className={linked ? "h-4 w-4 text-emerald-500" : "h-4 w-4 text-rose-500"}
      aria-label={linked ? "Linked" : "Missing"}
    />
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
      const clubName = team.clubName ?? "Independent / Unassigned";
      const groupKey =
        team.clubId !== null
          ? `club-${team.clubId}`
          : `club-${clubName.toLowerCase()}`;
      const existing = map.get(groupKey);
      const clubRecord =
        team.clubId !== null ? clubLookup.get(team.clubId) : undefined;
      const recordAccountNames = clubRecord?.accounts
        ?.map((account) => account.name)
        .filter(Boolean) as string[];
      const recordHasAccount =
        clubRecord?.hasFixturaAccount ?? team.clubHasFixturaAccount;
      const primaryAccountId = clubRecord?.accounts?.[0]?.id ?? null;

      const clubLinked = recordHasAccount || team.clubHasFixturaAccount;

      if (existing) {
        existing.clubHasAccount = existing.clubHasAccount || clubLinked;
        if (existing.clubId === null && team.clubId !== null) {
          existing.clubId = team.clubId;
        }
        if (recordAccountNames.length > 0 || team.clubAccountNames.length > 0) {
          existing.clubAccountNames = Array.from(
            new Set([
              ...existing.clubAccountNames,
              ...team.clubAccountNames,
              ...(recordAccountNames ?? []),
            ])
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
            new Set([
              ...(team.clubAccountNames ?? []),
              ...(recordAccountNames ?? []),
            ])
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
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
        ),
      }))
      .sort((a, b) =>
        a.clubName.localeCompare(b.clubName, undefined, { sensitivity: "base" })
      );
  }, [teams, clubLookup]);

  return (
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
              <TableHead>Grades</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedTeams.map((group) => (
              <Fragment key={group.key}>
                <TableRow className="bg-muted/40">
                  <TableCell colSpan={5} className="py-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <AccountStatusIcon linked={group.clubHasAccount} />
                        <div>
                          <p className="font-semibold text-slate-900">
                            {group.clubName}
                          </p>
                          {group.clubAccountNames.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Contacts: {group.clubAccountNames.join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {group.clubId !== null ? (
                          <Button asChild size="sm" variant="accent">
                            <Link href={`/dashboard/clubs/${group.clubId}`}>
                              View Club
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
                            </Link>
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
                {group.teams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell className="font-medium pl-12">
                      {team.name}
                    </TableCell>
                    <TableCell>{team.gender ?? "—"}</TableCell>
                    <TableCell>{team.ageGroup ?? "—"}</TableCell>
                    <TableCell>
                      {team.grades.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-2">
                          {team.grades
                            .slice(0, MAX_VISIBLE_GRADES)
                            .map((grade) => (
                              <Badge key={grade.id} variant="outline">
                                {grade.name ?? `Grade #${grade.id}`}
                              </Badge>
                            ))}
                          {team.grades.length > MAX_VISIBLE_GRADES && (
                            <Badge variant="secondary">
                              +{team.grades.length - MAX_VISIBLE_GRADES} more
                            </Badge>
                          )}
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/dashboard/teams/${team.id}`}>
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </SectionContainer>
  );
}
