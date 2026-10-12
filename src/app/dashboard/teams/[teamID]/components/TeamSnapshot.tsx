"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  Building,
  Building2,
  ChevronDown,
  ExternalLink,
  Gauge,
  Info,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState, StatusBadge } from "@/components/ui-library";
import { SnapshotMetric } from "@/app/dashboard/fixtures/_components/_utils/snapshotMetric";
import type { TeamData } from "@/types/teamsById";
import {
  externalUrl,
  formatStoredDate,
  formatSyncedAgo,
  playHqUrl,
} from "./teamFixtureModel";

export interface TeamSnapshotProps {
  team: TeamData;
  cmsUrl: string | null;
  daysSinceUpdate: number | null;
}

function positiveId(id: number | null | undefined): number | null {
  if (typeof id !== "number" || !Number.isFinite(id) || id <= 0) return null;
  return id;
}

function TeamFact({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-4 rounded-md border border-slate-200 bg-white px-3 py-2.5">
      <span className="shrink-0 text-xs font-medium uppercase text-slate-500">
        {label}
      </span>
      <div className="min-w-0 text-right text-sm font-medium text-slate-900">
        {children}
      </div>
    </div>
  );
}

export function TeamSnapshot({
  team,
  cmsUrl,
  daysSinceUpdate,
}: TeamSnapshotProps) {
  const clubId = positiveId(team.club?.id);
  const gradeId = positiveId(team.grades?.id);
  const competitionId = positiveId(team.competition?.id);
  const associationId = positiveId(team.association?.id);
  const playHqTeamUrl = playHqUrl(team.TopLineData?.href);
  const competitionActive =
    team.competition?.status?.trim().toLowerCase() === "active" ||
    team.competition?.isActive === true;
  const contacts = team.TopLineData?.contactDetails ?? [];
  const website = externalUrl(team.club?.website?.website);
  const address = team.club?.location?.address?.trim() || null;

  return (
    <>
      <SectionContainer
        title="Team Snapshot"
        description="Record, grade, and the last sync."
        icon={<Gauge className="h-5 w-5 text-slate-500" aria-hidden />}
      >
        <div className="flex flex-wrap items-center gap-2">
          {clubId ? (
            <Button asChild variant="accent" size="sm">
              <Link href={`/dashboard/club/${clubId}`}>
                <Building2 className="h-4 w-4" />
                View Club
              </Link>
            </Button>
          ) : null}
          {gradeId ? (
            <Button asChild variant="accent" size="sm">
              <Link href={`/dashboard/grades/${gradeId}`}>
                <Users className="h-4 w-4" />
                View Grade
              </Link>
            </Button>
          ) : null}
          {competitionId ? (
            <Button asChild variant="accent" size="sm">
              <Link href={`/dashboard/competitions/${competitionId}`}>
                <Trophy className="h-4 w-4" />
                View Competition
              </Link>
            </Button>
          ) : null}
          {associationId ? (
            <Button asChild variant="accent" size="sm">
              <Link href={`/dashboard/association/${associationId}`}>
                <Building className="h-4 w-4" />
                View Association
              </Link>
            </Button>
          ) : null}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="primary" size="sm">
                <ExternalLink className="h-4 w-4" />
                Open
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Destinations</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {playHqTeamUrl ? (
                <DropdownMenuItem asChild>
                  <Link
                    href={playHqTeamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on PlayHQ
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem disabled>
                  <ExternalLink className="h-4 w-4" />
                  View on PlayHQ
                </DropdownMenuItem>
              )}
              {cmsUrl ? (
                <DropdownMenuItem asChild>
                  <Link href={cmsUrl} target="_blank" rel="noopener noreferrer">
                    <ShieldCheck className="h-4 w-4" />
                    Open in CMS
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem disabled>
                  <ShieldCheck className="h-4 w-4" />
                  Open in CMS
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
          <SnapshotMetric
            title="Played"
            value={String(team.TopLineData?.gamesPlayed ?? 0)}
            detail="Stored on the team"
            icon={<Activity className="h-4 w-4" />}
          />
          <SnapshotMetric
            title="Wins"
            value={String(team.TopLineData?.wins ?? 0)}
            detail="Recorded results"
            icon={<Trophy className="h-4 w-4" />}
          />
          <SnapshotMetric
            title="Losses"
            value={String(team.TopLineData?.losses ?? 0)}
            detail="Recorded results"
            icon={<Activity className="h-4 w-4" />}
          />
          <SnapshotMetric
            title="Form"
            value={team.TopLineData?.form?.trim() || "—"}
            detail="Recent results"
            icon={<Info className="h-4 w-4" />}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <TeamFact label="Age">{team.TopLineData?.age?.trim() || "—"}</TeamFact>
          <TeamFact label="Gender">
            {team.TopLineData?.gender?.trim() || "—"}
          </TeamFact>
          <TeamFact label="Grade">
            {gradeId ? (
              <Link
                href={`/dashboard/grades/${gradeId}`}
                className="hover:underline"
              >
                {team.grades?.gradeName?.trim() || "View grade"}
              </Link>
            ) : (
              team.grades?.gradeName?.trim() || "—"
            )}
          </TeamFact>
          <TeamFact label="Competition">
            <StatusBadge
              status={competitionActive}
              trueLabel="Active"
              falseLabel="Inactive"
            />
          </TeamFact>
          <TeamFact label="PlayHQ ID">
            <span className="break-all">
              {team.TopLineData?.teamID?.trim() || "—"}
            </span>
          </TeamFact>
          <TeamFact label="Last synced">
            <span className="block">{formatSyncedAgo(daysSinceUpdate)}</span>
            <span className="block text-xs font-normal text-slate-500">
              {formatStoredDate(team.TopLineData?.updatedAt)}
            </span>
          </TeamFact>
        </div>
      </SectionContainer>

      <SectionContainer
        title="Club"
        description={team.club?.Sport?.trim() || "Club linked to this team."}
        icon={<Building2 className="h-5 w-5 text-slate-500" aria-hidden />}
      >
        {team.club?.Name?.trim() ? (
          <div className="grid gap-3 md:grid-cols-2">
            <TeamFact label="Name">
              {clubId ? (
                <Link
                  href={`/dashboard/club/${clubId}`}
                  className="hover:underline"
                >
                  {team.club.Name}
                </Link>
              ) : (
                team.club.Name
              )}
            </TeamFact>
            <TeamFact label="Website">
              {website ? (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Club website
                </a>
              ) : (
                "—"
              )}
            </TeamFact>
            <TeamFact label="Address">
              {address ? (
                <span className="inline-flex items-start justify-end gap-1">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span>{address}</span>
                </span>
              ) : (
                "—"
              )}
            </TeamFact>
          </div>
        ) : (
          <EmptyState
            title="No club linked"
            description="This team has no club record on the team response."
            variant="minimal"
          />
        )}
      </SectionContainer>

      <SectionContainer
        title="Contacts"
        description="People stored on the team."
        icon={<Users className="h-5 w-5 text-slate-500" aria-hidden />}
      >
        {contacts.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact, index) => {
              const email = contact.email?.trim() || "";
              const phone = contact.phone?.trim() || "";
              return (
                <div
                  key={`${contact.name}-${email}-${index}`}
                  className="rounded-md border border-slate-200 bg-white px-3 py-3"
                >
                  <p className="text-sm font-medium text-slate-900">
                    {contact.name?.trim() || "Unnamed contact"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {contact.role?.trim() || "Role not set"}
                  </p>
                  <div className="mt-2 space-y-1 text-sm text-slate-700">
                    {phone ? (
                      <a
                        href={`tel:${phone}`}
                        className="flex items-center gap-2 hover:underline"
                      >
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        {phone}
                      </a>
                    ) : null}
                    {email ? (
                      <a
                        href={`mailto:${email}`}
                        className="flex items-center gap-2 hover:underline"
                      >
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        {email}
                      </a>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No contacts stored"
            description="PlayHQ has not returned contact details for this team."
            variant="minimal"
          />
        )}
      </SectionContainer>
    </>
  );
}
