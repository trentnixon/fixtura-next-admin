"use client";

import { useState } from "react";
import Image from "next/image";
import type { CricketTeam, TeamLogoInfo } from "@/types/downloadAsset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  MapPin,
  Trophy,
} from "lucide-react";
import BattingPerformanceList from "./BattingPerformanceList";
import BowlingPerformanceList from "./BowlingPerformanceList";

interface CricketTeamCardProps {
  team: CricketTeam;
  logo: TeamLogoInfo;
  isHome: boolean;
  isWinner?: boolean;
}

/**
 * CricketTeamCard Component
 *
 * Displays team information:
 * - Team name, logo, isClubTeam badge
 * - Score and overs
 * - Batting performances (top 3, expandable)
 * - Bowling performances (top 3, expandable)
 */
export default function CricketTeamCard({
  team,
  logo,
  isHome,
  isWinner = false,
}: CricketTeamCardProps) {
  const [isBattingExpanded, setIsBattingExpanded] = useState(false);
  const [isBowlingExpanded, setIsBowlingExpanded] = useState(false);

  return (
    <Card
      className={`shadow-none border transition-shadow hover:shadow-md ${
        isWinner ? "border-emerald-300 bg-emerald-50/30" : ""
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {logo && logo.url && (
              <Image
                src={logo.url}
                alt={`${team.name} logo`}
                width={40}
                height={40}
                className="rounded object-contain border"
                unoptimized
              />
            )}
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                {isHome ? (
                  <Home className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                )}
                {team.name || "Team"}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {team.isClubTeam && (
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200"
                  >
                    Club Team
                  </Badge>
                )}
                {isHome && (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    Home
                  </Badge>
                )}
                {!isHome && (
                  <Badge
                    variant="outline"
                    className="bg-orange-50 text-orange-700 border-orange-200"
                  >
                    Away
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score and Overs */}
        <div
          className={`flex items-center justify-between p-3 rounded-md border ${
            isWinner
              ? "bg-emerald-100 border-emerald-300"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <div>
            <p className="text-xs text-muted-foreground">Score</p>
            <p
              className={`text-lg font-bold ${
                isWinner ? "text-emerald-700" : ""
              }`}
            >
              {team.score || "N/A"}
              {isWinner && (
                <Trophy className="h-4 w-4 inline-block ml-2 text-emerald-600" />
              )}
            </p>
          </div>
          {team.overs && (
            <div>
              <p className="text-xs text-muted-foreground">Overs</p>
              <p className="text-lg font-semibold">{team.overs}</p>
            </div>
          )}
        </div>

        {/* First Innings Score (if available) */}
        {(team.homeScoresFirstInnings || team.awayScoresFirstInnings) && (
          <div className="text-xs text-muted-foreground">
            First Innings: {team.homeScoresFirstInnings || team.awayScoresFirstInnings}
          </div>
        )}

        {/* Batting Performances */}
        {team.battingPerformances && team.battingPerformances.length > 0 && (
          <BattingPerformanceList
            performances={team.battingPerformances}
            isExpanded={isBattingExpanded}
            onToggle={() => setIsBattingExpanded(!isBattingExpanded)}
          />
        )}

        {/* Bowling Performances */}
        {team.bowlingPerformances && team.bowlingPerformances.length > 0 && (
          <BowlingPerformanceList
            performances={team.bowlingPerformances}
            isExpanded={isBowlingExpanded}
            onToggle={() => setIsBowlingExpanded(!isBowlingExpanded)}
          />
        )}
      </CardContent>
    </Card>
  );
}

