"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import StatCard from "@/components/ui-library/metrics/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Activity, Building, Calendar, Gauge, ShieldCheck } from "lucide-react";
import { ReactNode } from "react";

import { CompetitionAdminDetailResponse } from "@/types/competitionAdminDetail";

function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString();
}

function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `${value.toFixed(0)}%`;
}

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

interface SnapshotSectionProps {
  meta: CompetitionAdminDetailResponse["meta"];
  counts: CompetitionAdminDetailResponse["counts"];
  accountCoverage: CompetitionAdminDetailResponse["analytics"]["summary"]["accountCoverage"];
  timeline: CompetitionAdminDetailResponse["analytics"]["summary"]["timeline"];
  strapiLocation: { competition?: string } | null;
  isFetching: boolean;
  actionChildren?: ReactNode;
  associationId?: number | null;
}

export function SnapshotSection({
  meta,
  counts,
  accountCoverage,
  timeline,
  strapiLocation,
  isFetching,
  actionChildren,
  associationId,
}: SnapshotSectionProps) {
  return (
    <SectionContainer
      title="Competition Snapshot"
      description="Key stats for the selected competition."
      action={
        <div className="flex items-center gap-2">
          {associationId !== undefined && associationId !== null && (
            <Button asChild variant="accent" size="sm">
              <Link href={`/dashboard/association/${associationId}`}>
                <Building className="mr-1 h-4 w-4" />
                View Association
              </Link>
            </Button>
          )}
          {meta.url && (
            <Button asChild variant="primary" size="sm">
              <Link href={meta.url} target="_blank" rel="noopener noreferrer">
                <Calendar className="h-4 w-4 mr-1" />
                View on PlayHQ
              </Link>
            </Button>
          )}
          <Button
            asChild
            variant="primary"
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
          {actionChildren}
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
          title="Linked Accounts"
          value={formatNumber(accountCoverage.association.accountCount)}
          icon={<Building className="h-5 w-5" />}
          description={
            accountCoverage.association.hasAccount
              ? "Clubs or associations with Fixtura accounts"
              : "No linked Fixtura accounts yet"
          }
          variant="accent"
        />
        <StatCard
          title="Club Coverage"
          value={formatPercent(accountCoverage.clubs.coveragePercent)}
          icon={<Gauge className="h-5 w-5" />}
          description={`${formatNumber(
            accountCoverage.clubs.withAccount
          )} with account • ${formatNumber(
            accountCoverage.clubs.withoutAccount
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
  );
}
