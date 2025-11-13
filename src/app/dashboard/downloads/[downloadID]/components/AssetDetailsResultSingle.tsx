"use client";

import type { CricketGame } from "@/types/downloadAsset";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import CricketGameCard from "./CricketGameCard";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DatabaseIcon } from "lucide-react";

interface AssetDetailsResultSingleProps {
  game: CricketGame;
}

/**
 * AssetDetailsResultSingle Component
 *
 * Displays CricketResultSingle asset-specific data:
 * - Single cricket game result
 * - Full game details with teams, performances, match context
 * - CMS link button
 */
export default function AssetDetailsResultSingle({
  game,
}: AssetDetailsResultSingleProps) {
  const { strapiLocation } = useGlobalContext();

  // Build CMS link URL
  const gameId = game.gameID;
  const cmsUrl = `${strapiLocation.fixture.cricket}?page=1&pageSize=10&sort=round:ASC&_q=${encodeURIComponent(gameId)}`;

  return (
    <SectionContainer
      title="Game Result"
      description="Single cricket game result with full details"
    >
      <div className="space-y-4">
        {/* CMS Link Button */}
        {gameId && (
          <div className="flex justify-end">
            <Button variant="primary" asChild size="sm">
              <Link href={cmsUrl} target="_blank" rel="noopener noreferrer">
                <DatabaseIcon className="h-4 w-4 mr-2" />
                View in CMS
              </Link>
            </Button>
          </div>
        )}

        {/* Game Card */}
        <CricketGameCard game={game} variant="default" />
      </div>
    </SectionContainer>
  );
}

