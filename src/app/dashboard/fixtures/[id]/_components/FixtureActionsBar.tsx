"use client";

import { Building2, ChevronDown, ExternalLink, ImageIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import FixtureMetadata from "./FixtureMetadata";
import TriggerResultSingleScrapeButton from "./TriggerResultSingleScrapeButton";

interface ClubInfo {
  id: number;
  name: string;
}

interface FixtureActionsBarProps {
  fixtureId: number;
  scorecardUrl: string | null;
  clubs: ClubInfo[];
  renderIds: number[];
}

export default function FixtureActionsBar({
  fixtureId,
  scorecardUrl,
  clubs,
  renderIds,
}: FixtureActionsBarProps) {
  const hasOpenItems =
    Boolean(scorecardUrl) || clubs.length > 0 || renderIds.length > 0;

  return (
    <div className="flex flex-col gap-2 sm:items-end">
      <div className="flex flex-wrap items-center gap-2">
        {hasOpenItems && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="primary" size="sm">
                Open <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {scorecardUrl && (
                <DropdownMenuItem asChild>
                  <a
                    href={`https://www.playhq.com${scorecardUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>PlayHQ scorecard</span>
                  </a>
                </DropdownMenuItem>
              )}

              {clubs.map((club) => (
                <DropdownMenuItem key={club.id} asChild>
                  <a
                    href={`/dashboard/club/${club.id}`}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <Building2 className="h-4 w-4" />
                    <span>{club.name}</span>
                  </a>
                </DropdownMenuItem>
              ))}

              {renderIds.map((renderId) => (
                <DropdownMenuItem key={renderId} asChild>
                  <a
                    href={`/dashboard/renders/${renderId}`}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>Render #{renderId}</span>
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="accent" size="sm">
              Data actions <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1">
            <TriggerResultSingleScrapeButton
              fixtureId={fixtureId}
              scorecardUrl={scorecardUrl}
              className="w-full justify-start"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <FixtureMetadata fixtureId={fixtureId} />
    </div>
  );
}
