"use client";

import type { AccountBias } from "@/types/downloadAsset";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users } from "lucide-react";
import { Label } from "@/components/type/titles";

interface AccountBiasCardProps {
  accountBias: AccountBias;
}

/**
 * AccountBiasCard Component
 *
 * Displays account bias information:
 * - Is bias indicator
 * - Club teams list
 * - Focused teams list
 */
export default function AccountBiasCard({
  accountBias,
}: AccountBiasCardProps) {
  return (
    <Card className="shadow-none border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-4 w-4" />
          Account Bias
        </CardTitle>
        <CardDescription>
          Account bias settings and team preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Is Bias Indicator */}
        {accountBias.isBias && (
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                accountBias.isBias.toLowerCase() === "true" ||
                accountBias.isBias === "1"
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : "bg-slate-50 text-slate-700 border-slate-200"
              }
            >
              {accountBias.isBias.toLowerCase() === "true" ||
              accountBias.isBias === "1"
                ? "Bias Enabled"
                : "Bias Disabled"}
            </Badge>
          </div>
        )}

        {/* Club Teams */}
        {accountBias.clubTeams && accountBias.clubTeams.length > 0 && (
          <div>
            <Label className="mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Club Teams ({accountBias.clubTeams.length})
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {accountBias.clubTeams.map((team, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200"
                >
                  {team}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Focused Teams */}
        {accountBias.focusedTeams && accountBias.focusedTeams.length > 0 && (
          <div>
            <Label className="mb-2 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Focused Teams ({accountBias.focusedTeams.length})
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {accountBias.focusedTeams.map((team, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  {team}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

