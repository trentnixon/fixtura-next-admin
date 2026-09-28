"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  Building,
  Calendar,
  ChevronDown,
  ExternalLink,
  Gauge,
  Info,
  RefreshCw,
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
import { StatusBadge } from "@/components/ui-library";
import type { GradeData } from "@/types/grade";
import TriggerFixtureDiscoveryButton from "./TriggerFixtureDiscoveryButton";
import GradeRemoveFixturesTrigger from "./GradeRemoveFixturesTrigger";
import TriggerResultBatchScrapeButton from "@/app/dashboard/competitions/components/TriggerResultBatchScrapeButton";

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Australia/Sydney",
  }).format(date);
}

export interface GradeSnapshotSectionProps {
  grade: GradeData;
  gradeId: number;
  competitionId: number;
  associationId?: number;
  cmsUrl: string | null;
  daysSinceUpdate: number | null;
}

function formatSyncedAgo(days: number | null): string {
  if (days === null) return "Unknown";
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function GradeStat({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1 border-b border-slate-200 px-4 py-4 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
      <div className="flex items-center gap-2 text-xs font-medium uppercase text-slate-500">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-50 text-slate-500">
          {icon}
        </span>
        {label}
      </div>
      <p className="text-xl font-semibold leading-tight text-slate-900">
        {value}
      </p>
      <p className="text-sm text-slate-500">{detail}</p>
    </div>
  );
}

function GradeFact({
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

export function GradeSnapshotSection({
  grade,
  gradeId,
  competitionId,
  associationId,
  cmsUrl,
  daysSinceUpdate,
}: GradeSnapshotSectionProps) {
  return (
    <SectionContainer
      title="Grade Snapshot"
      description="Teams, age group, play day, and the last sync."
      icon={<Gauge className="h-5 w-5 text-slate-500" aria-hidden />}
    >
      <GradeSnapshotActions
        grade={grade}
        gradeId={gradeId}
        competitionId={competitionId}
        associationId={associationId}
        cmsUrl={cmsUrl}
      />

      <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
        <GradeStat
          label="Teams"
          value={String(grade.teamData?.length ?? 0)}
          detail="Linked to this grade"
          icon={<Users className="h-4 w-4" />}
        />
        <GradeStat
          label="Age group"
          value={grade.topLineData.ageGroup || "—"}
          detail={grade.topLineData.gender || "Gender not set"}
          icon={<Info className="h-4 w-4" />}
        />
        <GradeStat
          label="Days played"
          value={grade.topLineData.daysPlayed || "—"}
          detail={grade.competitionData.season || "Season not set"}
          icon={<Calendar className="h-4 w-4" />}
        />
        <GradeStat
          label="Last synced"
          value={formatSyncedAgo(daysSinceUpdate)}
          detail={formatDate(grade.topLineData.updatedAt)}
          icon={<Activity className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <GradeFact label="Competition">
          <StatusBadge
            status={grade.competitionData.status === "Active"}
            trueLabel="Active"
            falseLabel="Inactive"
          />
        </GradeFact>
        <GradeFact label="Grade ID">{gradeId > 0 ? gradeId : "—"}</GradeFact>
        <GradeFact label="PlayHQ ID">
          <span className="break-all">
            {grade.topLineData.gradeId || "—"}
          </span>
        </GradeFact>
      </div>
    </SectionContainer>
  );
}

interface GradeSnapshotActionsProps {
  grade: GradeData;
  gradeId: number;
  competitionId: number;
  associationId?: number;
  cmsUrl: string | null;
}

function GradeSnapshotActions({
  grade,
  gradeId,
  competitionId,
  associationId,
  cmsUrl,
}: GradeSnapshotActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {associationId !== undefined && associationId > 0 && (
        <Button asChild variant="accent" size="sm">
          <Link href={`/dashboard/association/${associationId}`}>
            <Building className="h-4 w-4" />
            View Association
          </Link>
        </Button>
      )}

      {competitionId > 0 && (
        <Button asChild variant="accent" size="sm">
          <Link href={`/dashboard/competitions/${competitionId}`}>
            <Trophy className="h-4 w-4" />
            View Competition
          </Link>
        </Button>
      )}

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
          {grade.topLineData.url ? (
            <DropdownMenuItem asChild>
              <Link
                href={grade.topLineData.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Calendar className="h-4 w-4" />
                View on PlayHQ
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem disabled>
              <Calendar className="h-4 w-4" />
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="accent" size="sm">
            <RefreshCw className="h-4 w-4" />
            Data actions
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Queue background jobs</DropdownMenuLabel>
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
  );
}

export { SnapshotMetric as GradeSnapshotMetric } from "@/app/dashboard/fixtures/_components/_utils/snapshotMetric";
