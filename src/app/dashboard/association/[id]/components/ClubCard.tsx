"use client";

import Image from "next/image";
import { ExternalLink, Trophy, Users } from "lucide-react";
import { ClubDetail } from "@/types/associationDetail";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";

/**
 * ClubCard Component
 *
 * Individual club card displaying:
 * - Name, sport, logo
 * - Competition count, team count
 * - Active status badge
 * - PlayHQ link (if available)
 */
interface ClubCardProps {
  club: ClubDetail;
}

export default function ClubCard({ club }: ClubCardProps) {
  const { name, sport, logoUrl, isActive, href, competitionCount, teamCount } =
    club;

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-start gap-3">
          {/* Logo */}
          {logoUrl && (
            <div className="flex-shrink-0">
              <div className="relative w-12 h-12 rounded-lg border-2 bg-white p-1 shadow-sm">
                <Image
                  src={logoUrl}
                  alt={`${name} logo`}
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
            </div>
          )}

          {/* Name and Sport */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate">
              {name}
            </h3>
            {sport && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {sport}
              </p>
            )}
            <StatusBadge
              status={isActive}
              trueLabel="Active"
              falseLabel="Inactive"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Competitions</p>
              <p className="text-lg font-semibold">{competitionCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Teams</p>
              <p className="text-lg font-semibold">{teamCount}</p>
            </div>
          </div>
        </div>

        {/* PlayHQ Link */}
        {href && (
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View on PlayHQ
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
