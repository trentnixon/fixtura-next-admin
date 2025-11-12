"use client";

import { useState } from "react";
import type { CricketGame } from "@/types/downloadAsset";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronDown,
  ChevronUp,
  Trophy,
  Calendar,
  MapPin,
  Users,
  Info,
  Target,
  Copy,
  Check,
} from "lucide-react";
import Text from "@/components/ui-library/foundation/Text";
import { formatDate } from "@/lib/utils";
import { parsePromptData } from "@/utils/downloadAsset";
import CricketTeamCard from "./CricketTeamCard";
import MatchContextCard from "./MatchContextCard";
import AccountBiasCard from "./AccountBiasCard";

interface CricketGameCardProps {
  game: CricketGame;
  variant?: "default" | "nested";
}

/**
 * CricketGameCard Component
 *
 * Displays a single cricket game with:
 * - Game information (ID, status, date, type, ground, round)
 * - Grade information (name, gender, ageGroup)
 * - Result statement
 * - Home and away teams with performances
 * - Match context (if available from prompt)
 * - Account bias (if available from prompt)
 *
 * @param variant - "default" renders with Card wrapper, "nested" renders without Card wrapper (for use in accordions)
 */
export default function CricketGameCard({ game, variant = "default" }: CricketGameCardProps) {
  const [isMatchContextOpen, setIsMatchContextOpen] = useState(false);
  const [isAccountBiasOpen, setIsAccountBiasOpen] = useState(false);
  const [copiedGameId, setCopiedGameId] = useState(false);

  // Parse prompt data to get match context and account bias
  const promptData = parsePromptData(game.prompt);
  const matchContext = promptData?.matchContext;
  const accountBias = promptData?.accountBias;

  // Copy game ID to clipboard
  const handleCopyGameId = () => {
    if (game.gameID) {
      navigator.clipboard.writeText(game.gameID);
      setCopiedGameId(true);
      setTimeout(() => setCopiedGameId(false), 2000);
    }
  };

  // Determine winner based on scores
  const homeScore = parseInt(game.homeTeam?.score?.split("/")[0] || "0");
  const awayScore = parseInt(game.awayTeam?.score?.split("/")[0] || "0");
  const homeWon = homeScore > awayScore;
  const awayWon = awayScore > homeScore;

  const content = (
    <div className="space-y-6">
        {/* Game ID - Show in nested variant */}
        {variant === "nested" && game.gameID && (
          <div className="flex items-center gap-2 pb-2 border-b">
            <Text variant="small" className="text-muted-foreground">
              Game ID: {game.gameID}
            </Text>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={handleCopyGameId}
                  >
                    {copiedGameId ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{copiedGameId ? "Copied!" : "Copy Game ID"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Game Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          {game.date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Date</p>
                <p className="font-medium">
                  {formatDate(game.date) || game.date}
                </p>
              </div>
            </div>
          )}
          {game.ground && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Ground</p>
                <p className="font-medium">{game.ground}</p>
              </div>
            </div>
          )}
          {game.round && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Round</p>
                <p className="font-medium">{game.round}</p>
              </div>
            </div>
          )}
          {game.type && (
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Type</p>
                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                  {game.type}
                </Badge>
              </div>
            </div>
          )}
          {game.gender && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Gender</p>
                <p className="font-medium">{game.gender}</p>
              </div>
            </div>
          )}
          {game.ageGroup && (
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Age Group</p>
                <p className="font-medium">{game.ageGroup}</p>
              </div>
            </div>
          )}
        </div>

        {/* Result Statement */}
        {game.result && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <Text className="text-blue-700 font-medium">{game.result}</Text>
          </div>
        )}

        {/* Teams */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Home Team */}
          <CricketTeamCard
            team={game.homeTeam}
            logo={game.teamHomeLogo}
            isHome={true}
            isWinner={homeWon}
          />

          {/* Away Team */}
          <CricketTeamCard
            team={game.awayTeam}
            logo={game.teamAwayLogo}
            isHome={false}
            isWinner={awayWon}
          />
        </div>

        {/* Match Context - Collapsible */}
        {matchContext && (
          <Collapsible open={isMatchContextOpen} onOpenChange={setIsMatchContextOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>
                  {isMatchContextOpen ? "Hide" : "Show"} Match Context
                </span>
                {isMatchContextOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <MatchContextCard matchContext={matchContext} />
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Account Bias - Collapsible */}
        {accountBias && (
          <Collapsible open={isAccountBiasOpen} onOpenChange={setIsAccountBiasOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>
                  {isAccountBiasOpen ? "Hide" : "Show"} Account Bias
                </span>
                {isAccountBiasOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <AccountBiasCard accountBias={accountBias} />
            </CollapsibleContent>
          </Collapsible>
        )}
    </div>
  );

  // If nested variant, return content without Card wrapper
  if (variant === "nested") {
    return content;
  }

  // Default variant: return with Card wrapper
  return (
    <Card className="shadow-none border transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              {game.gradeName || "Cricket Game"}
            </CardTitle>
            <CardDescription>
              {game.gameID && (
                <div className="flex items-center gap-2">
                  <Text variant="small" className="text-muted-foreground">
                    Game ID: {game.gameID}
                  </Text>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0"
                          onClick={handleCopyGameId}
                        >
                          {copiedGameId ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{copiedGameId ? "Copied!" : "Copy Game ID"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </CardDescription>
          </div>
          {game.status && (
            <Badge
              variant="outline"
              className={
                game.status.toLowerCase() === "completed"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : game.status.toLowerCase() === "in progress"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-slate-50 text-slate-700 border-slate-200"
              }
            >
              {game.status}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {content}
      </CardContent>
    </Card>
  );
}

