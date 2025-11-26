"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface FixturesFiltersProps {
    competitionFilter: string;
    setCompetitionFilter: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
}

export function FixturesFilters({
    competitionFilter,
    setCompetitionFilter,
    statusFilter,
    setStatusFilter,
}: FixturesFiltersProps) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="competition-filter">Filter by Competition</Label>
                        <Input
                            id="competition-filter"
                            placeholder="Search competitions..."
                            value={competitionFilter}
                            onChange={(e) => setCompetitionFilter(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status-filter">Filter by Status</Label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger id="status-filter">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
