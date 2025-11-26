"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, MapPin, Trophy, Users, Clock } from "lucide-react";

interface FixtureInfoProps {
    fixture: {
        id: number;
        competitionName: string;
        gradeName: string;
        roundName: string;
        scheduledDate: Date;
        venue: string;
        venueAddress: string;
        status: string;
        totalGames: number;
        completedGames: number;
    };
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case "scheduled":
            return <Badge variant="outline">Scheduled</Badge>;
        case "in_progress":
            return <Badge className="bg-green-600">In Progress</Badge>;
        case "completed":
            return <Badge variant="secondary">Completed</Badge>;
        default:
            return <Badge>{status}</Badge>;
    }
};

export function FixtureInfo({ fixture }: FixtureInfoProps) {
    const completionPercentage = Math.round(
        (fixture.completedGames / fixture.totalGames) * 100
    );

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Fixture Information</CardTitle>
                        {getStatusBadge(fixture.status)}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                        <Trophy className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-sm font-medium">Competition</p>
                            <p className="text-sm text-muted-foreground">
                                {fixture.competitionName}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-sm font-medium">Grade</p>
                            <p className="text-sm text-muted-foreground">
                                {fixture.gradeName}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-sm font-medium">Round</p>
                            <p className="text-sm text-muted-foreground">
                                {fixture.roundName}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Schedule & Venue</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-sm font-medium">Date & Time</p>
                            <p className="text-sm text-muted-foreground">
                                {format(fixture.scheduledDate, "EEEE, MMMM dd, yyyy")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {format(fixture.scheduledDate, "h:mm a")}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-sm font-medium">Venue</p>
                            <p className="text-sm text-muted-foreground">{fixture.venue}</p>
                            <p className="text-xs text-muted-foreground">
                                {fixture.venueAddress}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium">Games Progress</p>
                            <p className="text-sm text-muted-foreground">
                                {fixture.completedGames} of {fixture.totalGames} games completed
                            </p>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                    style={{ width: `${completionPercentage}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default FixtureInfo;
