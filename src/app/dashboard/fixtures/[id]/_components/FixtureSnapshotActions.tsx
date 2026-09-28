"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Calendar,
  ChevronDown,
  ExternalLink,
  Layers,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { useGlobalContext } from "@/components/providers/GlobalContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { GradeDetail } from "@/types/fixtureDetail";
import {
  ResultSingleScrapeConfirmDialog,
  ResultSingleScrapeMenuItem,
} from "./TriggerResultSingleScrapeButton";

export interface FixtureSnapshotActionsProps {
  fixtureId: number;
  scorecardUrl: string | null;
  grade: GradeDetail | null;
}

export default function FixtureSnapshotActions({
  fixtureId,
  scorecardUrl,
  grade,
}: FixtureSnapshotActionsProps) {
  const { strapiLocation } = useGlobalContext();
  const [resultScrapeDialogOpen, setResultScrapeDialogOpen] = useState(false);
  const cmsUrl = `${strapiLocation.fixture.cricket}${fixtureId}`;
  const playHqScorecard = scorecardUrl
    ? scorecardUrl.startsWith("http")
      ? scorecardUrl
      : `https://www.playhq.com${scorecardUrl}`
    : null;

  return (
    <>
      <div className="flex flex-wrap items-center justify-end gap-2">
        {grade?.id ? (
          <Button asChild variant="accent" size="sm">
            <Link href={`/dashboard/grades/${grade.id}`}>
              <Layers className="h-4 w-4" />
              View Grade
            </Link>
          </Button>
        ) : null}

        {grade?.association?.id ? (
          <Button asChild variant="accent" size="sm">
            <Link href={`/dashboard/association/${grade.association.id}`}>
              <Building2 className="h-4 w-4" />
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
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Destinations</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {playHqScorecard ? (
              <DropdownMenuItem asChild>
                <Link
                  href={playHqScorecard}
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
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Queue background jobs</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ResultSingleScrapeMenuItem
              scorecardUrl={scorecardUrl}
              onOpen={() => setResultScrapeDialogOpen(true)}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ResultSingleScrapeConfirmDialog
        open={resultScrapeDialogOpen}
        onOpenChange={setResultScrapeDialogOpen}
        fixtureId={fixtureId}
      />
    </>
  );
}
