"use client";

import { ExternalLink, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import FixtureMetadata from "./FixtureMetadata";
import { SingleFixtureDetailResponse } from "@/types/fixtureDetail";

interface ClubInfo {
  id: number;
  name: string;
}

interface FixtureActionsBarProps {
  scorecardUrl: string | null;
  clubs: ClubInfo[];
  renderIds: number[];
  data: SingleFixtureDetailResponse;
}

export default function FixtureActionsBar({
  scorecardUrl,
  clubs,
  renderIds,
  data,
}: FixtureActionsBarProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {/* View External Scorecard */}
          {scorecardUrl && (
            <Button variant="primary" size="sm" asChild>
              <a
                href={`https://www.playhq.com${scorecardUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View External Scorecard</span>
              </a>
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Render Actions Dropdown */}
          {renderIds.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="accent"
                  size="sm"
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Renders <ChevronDown className="ml-1 w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {renderIds.map((renderId) => (
                  <DropdownMenuItem key={renderId} asChild>
                    <a
                      href={`/dashboard/renders/${renderId}`}
                      className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span>Render #{renderId}</span>
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Clubs Actions Dropdown */}
          {clubs.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="accent"
                  size="sm"
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Clubs <ChevronDown className="ml-1 w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {clubs.map((club) => (
                  <DropdownMenuItem key={club.id} asChild>
                    <a
                      href={`/dashboard/club/${club.id}`}
                      className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span>{club.name}</span>
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      {/* Game Metadata */}
      <FixtureMetadata data={data} />
    </>
  );
}
