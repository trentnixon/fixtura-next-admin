"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GamesTable } from "./GamesTable";
import { FixtureInfo } from "./FixtureInfo";

// Dummy fixture data - will be replaced with actual API data
const DUMMY_FIXTURES_DATA = {
    "1": {
        id: 1,
        competitionId: 101,
        competitionName: "Premier League 2024",
        gradeId: 201,
        gradeName: "Division 1",
        roundNumber: 1,
        roundName: "Round 1",
        scheduledDate: new Date("2024-12-01T14:00:00"),
        venue: "Central Sports Ground",
        venueAddress: "123 Sports Ave, Melbourne VIC 3000",
        status: "scheduled",
        totalGames: 8,
        completedGames: 0,
        games: [
            {
                id: 101,
                homeTeam: "Eagles FC",
                awayTeam: "Tigers United",
                scheduledTime: new Date("2024-12-01T14:00:00"),
                field: "Field 1",
                status: "scheduled",
                homeScore: null,
                awayScore: null,
            },
            {
                id: 102,
                homeTeam: "Lions SC",
                awayTeam: "Panthers FC",
                scheduledTime: new Date("2024-12-01T14:45:00"),
                field: "Field 2",
                status: "scheduled",
                homeScore: null,
                awayScore: null,
            },
            {
                id: 103,
                homeTeam: "Wolves Athletic",
                awayTeam: "Bears FC",
                scheduledTime: new Date("2024-12-01T15:30:00"),
                field: "Field 1",
                status: "scheduled",
                homeScore: null,
                awayScore: null,
            },
            {
                id: 104,
                homeTeam: "Hawks United",
                awayTeam: "Sharks SC",
                scheduledTime: new Date("2024-12-01T16:15:00"),
                field: "Field 2",
                status: "scheduled",
                homeScore: null,
                awayScore: null,
            },
            {
                id: 105,
                homeTeam: "Dolphins FC",
                awayTeam: "Falcons United",
                scheduledTime: new Date("2024-12-01T17:00:00"),
                field: "Field 1",
                status: "scheduled",
                homeScore: null,
                awayScore: null,
            },
            {
                id: 106,
                homeTeam: "Cobras SC",
                awayTeam: "Rhinos FC",
                scheduledTime: new Date("2024-12-01T17:45:00"),
                field: "Field 2",
                status: "scheduled",
                homeScore: null,
                awayScore: null,
            },
            {
                id: 107,
                homeTeam: "Jaguars United",
                awayTeam: "Stallions FC",
                scheduledTime: new Date("2024-12-01T18:30:00"),
                field: "Field 1",
                status: "scheduled",
                homeScore: null,
                awayScore: null,
            },
            {
                id: 108,
                homeTeam: "Vipers SC",
                awayTeam: "Mustangs United",
                scheduledTime: new Date("2024-12-01T19:15:00"),
                field: "Field 2",
                status: "scheduled",
                homeScore: null,
                awayScore: null,
            },
        ],
    },
    "2": {
        id: 2,
        competitionId: 101,
        competitionName: "Premier League 2024",
        gradeId: 202,
        gradeName: "Division 2",
        roundNumber: 1,
        roundName: "Round 1",
        scheduledDate: new Date("2024-12-01T16:00:00"),
        venue: "North Field Complex",
        venueAddress: "456 North Rd, Melbourne VIC 3001",
        status: "scheduled",
        totalGames: 6,
        completedGames: 0,
        games: [
            {
                id: 201,
                homeTeam: "Rockets FC",
                awayTeam: "Comets United",
                scheduledTime: new Date("2024-12-01T16:00:00"),
                field: "Field A",
                status: "scheduled",
                homeScore: null,
                awayScore: null,
            },
            {
                id: 202,
                homeTeam: "Meteors SC",
                awayTeam: "Stars FC",
                scheduledTime: new Date("2024-12-01T16:45:00"),
                field: "Field B",
                status: "scheduled",
                homeScore: null,
                awayScore: null,
            },
            {
                id: 203,
                homeTeam: "Galaxy United",
                awayTeam: "Cosmos FC",
                scheduledTime: new Date("2024-12-01T17:30:00"),
                field: "Field A",
                status: "scheduled",
                homeScore: null,
                awayScore: null,
            },
            {
                id: 204,
                homeTeam: "Nebula SC",
                awayTeam: "Orbit United",
                scheduledTime: new Date("2024-12-01T18:15:00"),
                field: "Field B",
                status: "scheduled",
                homeScore: null,
                awayScore: null,
            },
            {
                id: 205,
                homeTeam: "Phoenix FC",
                awayTeam: "Eclipse SC",
                scheduledTime: new Date("2024-12-01T19:00:00"),
                field: "Field A",
                status: "scheduled",
                homeScore: null,
                awayScore: null,
            },
            {
                id: 206,
                homeTeam: "Lunar United",
                awayTeam: "Solar FC",
                scheduledTime: new Date("2024-12-01T19:45:00"),
                field: "Field B",
                status: "scheduled",
                homeScore: null,
                awayScore: null,
            },
        ],
    },
    "3": {
        id: 3,
        competitionId: 102,
        competitionName: "Summer Cup 2024",
        gradeId: 203,
        gradeName: "Open Grade",
        roundNumber: 2,
        roundName: "Round 2",
        scheduledDate: new Date("2024-11-28T18:00:00"),
        venue: "Riverside Stadium",
        venueAddress: "789 River St, Melbourne VIC 3002",
        status: "in_progress",
        totalGames: 4,
        completedGames: 2,
        games: [
            {
                id: 301,
                homeTeam: "Thunder FC",
                awayTeam: "Lightning United",
                scheduledTime: new Date("2024-11-28T18:00:00"),
                field: "Main Field",
                status: "completed",
                homeScore: 3,
                awayScore: 2,
            },
            {
                id: 302,
                homeTeam: "Storm SC",
                awayTeam: "Cyclone FC",
                scheduledTime: new Date("2024-11-28T19:00:00"),
                field: "Field 2",
                status: "completed",
                homeScore: 1,
                awayScore: 1,
            },
            {
                id: 303,
                homeTeam: "Blizzard United",
                awayTeam: "Tornado FC",
                scheduledTime: new Date("2024-11-28T20:00:00"),
                field: "Main Field",
                status: "in_progress",
                homeScore: 2,
                awayScore: 1,
            },
            {
                id: 304,
                homeTeam: "Hurricane SC",
                awayTeam: "Typhoon United",
                scheduledTime: new Date("2024-11-28T21:00:00"),
                field: "Field 2",
                status: "scheduled",
                homeScore: null,
                awayScore: null,
            },
        ],
    },
};

interface FixtureDetailProps {
    fixtureId: string;
}

export default function FixtureDetail({ fixtureId }: FixtureDetailProps) {
    const fixture = useMemo(() => {
        return DUMMY_FIXTURES_DATA[fixtureId as keyof typeof DUMMY_FIXTURES_DATA];
    }, [fixtureId]);

    if (!fixture) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                        Fixture not found. Please check the fixture ID and try again.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <FixtureInfo fixture={fixture} />
            <GamesTable games={fixture.games} />
        </div>
    );
}
