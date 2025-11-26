"use client";

import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";

interface Game {
    id: number;
    homeTeam: string;
    awayTeam: string;
    scheduledTime: Date;
    field: string;
    status: string;
    homeScore: number | null;
    awayScore: number | null;
}

interface GamesTableProps {
    games: Game[];
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case "scheduled":
            return <Badge variant="outline">Scheduled</Badge>;
        case "in_progress":
            return <Badge className="bg-green-600">In Progress</Badge>;
        case "completed":
            return <Badge variant="secondary">Completed</Badge>;
        case "cancelled":
            return <Badge variant="destructive">Cancelled</Badge>;
        default:
            return <Badge>{status}</Badge>;
    }
};

const getScoreDisplay = (
    homeScore: number | null,
    awayScore: number | null,
    status: string
) => {
    if (status === "scheduled") {
        return <span className="text-muted-foreground text-sm">vs</span>;
    }
    if (homeScore !== null && awayScore !== null) {
        return (
            <span className="font-semibold">
                {homeScore} - {awayScore}
            </span>
        );
    }
    return <span className="text-muted-foreground text-sm">-</span>;
};

export function GamesTable({ games }: GamesTableProps) {
    if (games.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                        No games found for this fixture.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Games ({games.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Time</TableHead>
                                <TableHead>Field</TableHead>
                                <TableHead>Home Team</TableHead>
                                <TableHead className="text-center">Score</TableHead>
                                <TableHead>Away Team</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {games.map((game) => (
                                <TableRow key={game.id}>
                                    <TableCell>
                                        <span className="text-sm">
                                            {format(game.scheduledTime, "h:mm a")}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{game.field}</Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{game.homeTeam}</TableCell>
                                    <TableCell className="text-center">
                                        {getScoreDisplay(game.homeScore, game.awayScore, game.status)}
                                    </TableCell>
                                    <TableCell className="font-medium">{game.awayTeam}</TableCell>
                                    <TableCell>{getStatusBadge(game.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Edit className="h-4 w-4 mr-1" />
                                                Edit
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
