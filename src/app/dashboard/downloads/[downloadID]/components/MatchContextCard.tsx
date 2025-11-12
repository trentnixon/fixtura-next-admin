"use client";

import type { MatchContext } from "@/types/downloadAsset";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Info,
  Target,
} from "lucide-react";
import Text from "@/components/ui-library/foundation/Text";
import { Label } from "@/components/type/titles";

interface MatchContextCardProps {
  matchContext: MatchContext;
}

/**
 * MatchContextCard Component
 *
 * Displays match context information:
 * - Competition, grade, round, ground
 * - Match type, toss winner, toss result
 * - Result statement
 * - Day one and final days play
 */
export default function MatchContextCard({
  matchContext,
}: MatchContextCardProps) {
  return (
    <Card className="shadow-none border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Info className="h-4 w-4" />
          Match Context
        </CardTitle>
        <CardDescription>
          Competition, grade, and match details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Competition and Grade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {matchContext.competition && (
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Competition</p>
                <p className="font-medium">{matchContext.competition}</p>
              </div>
            </div>
          )}
          {matchContext.grade && (
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Grade</p>
                <p className="font-medium">{matchContext.grade}</p>
              </div>
            </div>
          )}
          {matchContext.round && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Round</p>
                <p className="font-medium">{matchContext.round}</p>
              </div>
            </div>
          )}
          {matchContext.ground && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Ground</p>
                <p className="font-medium">{matchContext.ground}</p>
              </div>
            </div>
          )}
          {matchContext.matchType && (
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Match Type</p>
                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                  {matchContext.matchType}
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Toss Information */}
        {(matchContext.tossWinner || matchContext.tossResult) && (
          <div className="p-3 bg-slate-50 rounded-md border">
            <Label className="mb-2">Toss Information:</Label>
            <div className="space-y-1 text-sm">
              {matchContext.tossWinner && (
                <Text>
                  <Text as="span" weight="semibold">Toss Winner:</Text>{" "}
                  {matchContext.tossWinner}
                </Text>
              )}
              {matchContext.tossResult && (
                <Text>
                  <Text as="span" weight="semibold">Toss Result:</Text>{" "}
                  {matchContext.tossResult}
                </Text>
              )}
            </div>
          </div>
        )}

        {/* Result Statement */}
        {matchContext.resultStatement && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <Label className="mb-2">Result:</Label>
            <Text className="text-blue-700 font-medium">
              {matchContext.resultStatement}
            </Text>
          </div>
        )}

        {/* Day Information */}
        {(matchContext.dayOne || matchContext.finalDaysPlay) && (
          <div className="space-y-2 text-sm">
            {matchContext.dayOne && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Day One</p>
                  <p className="font-medium">{matchContext.dayOne}</p>
                </div>
              </div>
            )}
            {matchContext.finalDaysPlay && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Final Days Play</p>
                  <p className="font-medium">{matchContext.finalDaysPlay}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

