"use client";

import { useState } from "react";
import type { LadderGrade } from "@/types/downloadAsset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Trophy, DatabaseIcon } from "lucide-react";
import LadderTable from "./LadderTable";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import Link from "next/link";

interface LadderGradeCardProps {
  grade: LadderGrade;
  variant?: "default" | "nested";
}

/**
 * LadderGradeCard Component
 *
 * Displays a single ladder grade:
 * - Grade name and team count
 * - Collapsible league table
 * - CMS link button (if variant is default)
 */
export default function LadderGradeCard({
  grade,
  variant = "default",
}: LadderGradeCardProps) {
  const { strapiLocation } = useGlobalContext();
  const [isOpen, setIsOpen] = useState(false);

  const teamCount = grade.League.length;
  const gradeName = grade.gradeName;

  // Build CMS link URL
  const cmsUrl = `${strapiLocation.grade}?page=1&pageSize=10&sort=gradeName:ASC&_q=${encodeURIComponent(gradeName)}`;

  // If nested variant, return only the content (no Card wrapper)
  if (variant === "nested") {
    return (
      <div className="space-y-4">
        <LadderTable teams={grade.League} />
      </div>
    );
  }

  // Default variant with Card and Collapsible
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="shadow-none border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-lg font-semibold">
                {grade.gradeName}
              </CardTitle>
              <Badge variant="outline" className="bg-slate-50 text-slate-700">
                {teamCount} {teamCount === 1 ? "team" : "teams"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {/* CMS Link Button */}
              <Button variant="primary" asChild size="sm">
                <Link href={cmsUrl} target="_blank" rel="noopener noreferrer">
                  <DatabaseIcon className="h-4 w-4 mr-2" />
                  CMS
                </Link>
              </Button>
              {/* Collapsible Toggle */}
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isOpen ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Hide Table
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Show Table
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <LadderTable teams={grade.League} />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

