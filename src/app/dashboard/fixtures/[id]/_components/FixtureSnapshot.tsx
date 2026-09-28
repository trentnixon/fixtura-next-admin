"use client";

import {
  Calendar,
  Clock,
  Download,
  Gauge,
  MapPin,
  Trophy,
  Users,
} from "lucide-react";
import { format } from "date-fns";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui-library";
import { toFixtureDisplayText } from "@/app/dashboard/fixtures/_components/_utils/fixtureDisplayText";
import { SnapshotMetric } from "@/app/dashboard/fixtures/_components/_utils/snapshotMetric";
import { getStatusBadge } from "@/app/dashboard/fixtures/_components/_utils/statusUtils";
import { SingleFixtureDetailResponse } from "@/types/fixtureDetail";
import FixtureSnapshotActions from "./FixtureSnapshotActions";

interface FixtureSnapshotProps {
  data: SingleFixtureDetailResponse;
  fixtureId: number;
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  try {
    return format(new Date(value), "EEE, d MMM yyyy");
  } catch {
    return value;
  }
}

export default function FixtureSnapshot({
  data,
  fixtureId,
}: FixtureSnapshotProps) {
  const { fixture, grade, downloads, renderStatus, meta } = data;

  const renderCount =
    renderStatus.upcomingGamesRenders.length +
    renderStatus.gameResultsRenders.length;

  const statusLabel = fixture.isFinished
    ? "Finished"
    : toFixtureDisplayText(fixture.status, "Unknown");

  const details = [
    {
      icon: Calendar,
      label: "Date",
      value: formatDate(fixture.dates.date),
    },
    {
      icon: Clock,
      label: "Time",
      value: fixture.dates.time ?? "—",
    },
    {
      icon: MapPin,
      label: "Venue",
      value: toFixtureDisplayText(fixture.venue.ground, "—"),
    },
    {
      icon: Trophy,
      label: "Round",
      value: toFixtureDisplayText(fixture.round, "—"),
    },
  ];

  return (
    <SectionContainer
      title="Fixture Snapshot"
      description="Fixture metadata, schedule, and operational context."
      icon={<Gauge className="h-5 w-5 text-slate-500" aria-hidden />}
      action={
        <FixtureSnapshotActions
          fixtureId={fixtureId}
          scorecardUrl={fixture.matchDetails.urlToScoreCard}
          grade={grade}
        />
      }
    >
      <div className="space-y-5">
        <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
          <SnapshotMetric
            title="Status"
            value={statusLabel}
            detail={
              fixture.isFinished ? "Match complete" : "From CMS game metadata"
            }
            icon={<Trophy className="h-4 w-4" />}
          />
          <SnapshotMetric
            title="Grade"
            value={grade?.gradeName ?? "—"}
            detail={grade?.association?.name ?? "Not linked"}
            icon={<Users className="h-4 w-4" />}
          />
          <SnapshotMetric
            title="Media"
            value={String(downloads.length)}
            detail={`download${downloads.length === 1 ? "" : "s"} linked`}
            icon={<Download className="h-4 w-4" />}
          />
          <SnapshotMetric
            title="Quality"
            value={`${meta.validation.overallScore}%`}
            detail={`${renderCount} render${renderCount === 1 ? "" : "s"} · ${meta.validation.status}`}
            icon={<Gauge className="h-4 w-4" />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {getStatusBadge(fixture.status)}
          <StatusBadge
            status={fixture.isFinished}
            trueLabel="Finished"
            falseLabel="Not finished"
          />
          <Badge variant="outline" className="bg-slate-50 text-slate-600">
            Fixture #{fixtureId}
          </Badge>
          <Badge variant="outline" className="bg-slate-50 text-slate-600">
            {toFixtureDisplayText(fixture.type)}
          </Badge>
          {fixture.gameID ? (
            <Badge variant="outline" className="bg-slate-50 text-slate-600">
              Game {fixture.gameID}
            </Badge>
          ) : null}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {details.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 rounded-md border border-slate-200 bg-white px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-50 text-slate-500">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-xs font-medium uppercase text-slate-500">
                  {label}
                </span>
              </div>
              <span className="text-right text-sm font-medium text-slate-900">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
