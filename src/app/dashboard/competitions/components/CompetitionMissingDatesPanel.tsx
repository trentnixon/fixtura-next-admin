"use client";

import Link from "next/link";
import { CompetitionAdminStatsAvailableCompetition } from "@/types/competitionAdminStats";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";

const MAX_VISIBLE = 8;

interface CompetitionMissingDatesPanelProps {
  competitions: CompetitionAdminStatsAvailableCompetition[];
}

export default function CompetitionMissingDatesPanel({
  competitions,
}: CompetitionMissingDatesPanelProps) {
  if (competitions.length === 0) return null;

  const visible = competitions.slice(0, MAX_VISIBLE);
  const remaining = competitions.length - visible.length;

  return (
    <div className="space-y-3">
      <ul className="divide-y divide-slate-100 rounded-md border border-slate-200">
        {visible.map((competition) => (
          <li
            key={competition.id}
            className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 text-sm"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-800">
                {competition.name}
              </p>
              <p className="text-xs text-muted-foreground">
                ID {competition.id}
                {competition.associationName
                  ? ` · ${competition.associationName}`
                  : ""}
                {competition.sport ? ` · ${competition.sport}` : ""}
              </p>
            </div>
            <DashboardLinkButton
              href={`/dashboard/competitions/${competition.id}`}
              trailingIcon="arrow"
              className="shrink-0"
            >
              Open
            </DashboardLinkButton>
          </li>
        ))}
      </ul>
      {remaining > 0 && (
        <p className="text-xs text-muted-foreground">
          and {remaining} more — search in the{" "}
          <Link href="#competitions-table" className="font-medium underline">
            Snapshot
          </Link>{" "}
          tab.
        </p>
      )}
    </div>
  );
}
