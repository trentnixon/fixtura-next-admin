"use client";

import { useState } from "react";
import type { CricketGame } from "@/types/downloadAsset";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Trophy,
  Calendar,
  MapPin,
  Users,
  DatabaseIcon,
} from "lucide-react";
import Text from "@/components/ui-library/foundation/Text";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import CricketGameCard from "./CricketGameCard";
import { formatDate } from "@/lib/utils";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import Link from "next/link";

interface AssetDetailsCricketResultsProps {
  games: CricketGame[];
}

/**
 * AssetDetailsCricketResults Component
 *
 * Displays CricketResults asset-specific data:
 * - Games list with count in an accordion format
 * - Each game can be expanded/collapsed
 * - Game summary shown in header
 * - Full game details shown when expanded
 */
export default function AssetDetailsCricketResults({
  games,
}: AssetDetailsCricketResultsProps) {
  const { strapiLocation } = useGlobalContext();

  // Track which games are open (default: all closed)
  const [openGames, setOpenGames] = useState<Set<string>>(new Set());

  const toggleGame = (gameId: string) => {
    const newOpenGames = new Set(openGames);
    if (newOpenGames.has(gameId)) {
      newOpenGames.delete(gameId);
    } else {
      newOpenGames.add(gameId);
    }
    setOpenGames(newOpenGames);
  };

  if (!games || games.length === 0) {
    return (
      <SectionContainer
        title="Cricket Results"
        description="Game results and team performances"
      >
        <Card className="shadow-none border">
          <CardContent className="p-6">
            <Text className="text-muted-foreground">No games found.</Text>
          </CardContent>
        </Card>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer
      title="Cricket Results"
      description={`${games.length} fixture${
        games.length !== 1 ? "s" : ""
      } found`}
    >
      <div className="space-y-3">
        {games.map((game, index) => {
          const gameId = game.gameID || `game-${index}`;
          const isOpen = openGames.has(gameId);

          // Get game summary info
          const homeTeamName = game.homeTeam?.name || "Home Team";
          const awayTeamName = game.awayTeam?.name || "Away Team";
          const homeScore = game.homeTeam?.score || "0/0";
          const awayScore = game.awayTeam?.score || "0/0";
          const gameDate = game.date ? formatDate(game.date) : game.date;
          const ground = game.ground;
          const status = game.status;

          // Parse scores to determine winner (compare runs before "/")
          const homeRuns = parseInt(homeScore.split("/")[0] || "0");
          const awayRuns = parseInt(awayScore.split("/")[0] || "0");
          const homeWon = homeRuns > awayRuns;
          const awayWon = awayRuns > homeRuns;

          return (
            <Collapsible
              key={gameId}
              open={isOpen}
              onOpenChange={() => toggleGame(gameId)}
            >
              <Card className="shadow-none border transition-shadow hover:shadow-sm">
                <div className="relative">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-4 h-auto hover:bg-slate-50 pr-20"
                    >
                      <div className="flex items-center gap-4 flex-1 text-left">
                        {/* Game Number/Icon */}
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center">
                            <Trophy className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>

                        {/* Game Summary */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Text className="font-semibold text-base">
                              {game.gradeName || `Game ${index + 1}`}
                            </Text>
                            {status && (
                              <Badge
                                variant="outline"
                                className={
                                  status.toLowerCase() === "completed"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : status.toLowerCase() === "in progress"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-slate-50 text-slate-700 border-slate-200"
                                }
                              >
                                {status}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                            {gameDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{gameDate}</span>
                              </div>
                            )}
                            {ground && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{ground}</span>
                              </div>
                            )}
                            {game.round && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>Round {game.round}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <span
                              className={
                                homeWon ? "text-emerald-700 font-semibold" : ""
                              }
                            >
                              {homeTeamName} {homeScore}
                            </span>
                            <span className="text-muted-foreground">vs</span>
                            <span
                              className={
                                awayWon ? "text-emerald-700 font-semibold" : ""
                              }
                            >
                              {awayTeamName} {awayScore}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Chevron Icon */}
                      <div className="flex-shrink-0">
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </Button>
                  </CollapsibleTrigger>

                  {/* CMS Link Button - Positioned absolutely to avoid nesting */}
                  {game.gameID && strapiLocation.fixture?.cricket && (
                    <div className="absolute right-12 top-1/2 -translate-y-1/2 z-10">
                      <Link
                        href={`${strapiLocation.fixture.cricket}?page=1&pageSize=10&sort=round:ASC&_q=${game.gameID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-blue-50"
                          title="View in CMS"
                        >
                          <DatabaseIcon className="h-4 w-4 text-blue-600" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                <CollapsibleContent>
                  <div className="px-4 pb-4 pt-2">
                    <CricketGameCard game={game} variant="nested" />
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
      </div>
    </SectionContainer>
  );
}
