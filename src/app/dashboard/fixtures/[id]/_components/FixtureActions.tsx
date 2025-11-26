"use client";

import { ExternalLink, Play, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FixtureActionsProps {
    fixtureId: number;
    scorecardUrl: string | null;
    clubIds: number[];
}

export default function FixtureActions({
    fixtureId,
    scorecardUrl,
    clubIds,
}: FixtureActionsProps) {
    return (
        <div className="flex items-center gap-2">
            {/* View External Scorecard */}
            {scorecardUrl && (
                <Button
                    variant="default"
                    size="sm"
                    asChild
                >
                    <a
                        href={scorecardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                    >
                        <ExternalLink className="w-4 h-4" />
                        <span>View External Scorecard</span>
                    </a>
                </Button>
            )}

            {/* Render Action */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => {
                    // TODO: Implement render trigger
                    console.log("Trigger render for fixture:", fixtureId);
                }}
            >
                <Play className="w-4 h-4 mr-2" />
                <span>Render #{fixtureId}</span>
            </Button>

            {/* Clubs Action */}
            {clubIds.length > 0 && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        // TODO: Implement clubs navigation/action
                        console.log("View clubs:", clubIds);
                    }}
                >
                    <Building2 className="w-4 h-4 mr-2" />
                    <span>Clubs ({clubIds.length})</span>
                </Button>
            )}
        </div>
    );
}
