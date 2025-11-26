"use client";

import { useMemo } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Skeleton } from "@/components/ui/skeleton";
import { useFixtureInsights } from "@/hooks/fixtures/useFixtureInsights";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building2, Trophy } from "lucide-react";

export function TopEntities() {
    const { data, isLoading, error, refetch } = useFixtureInsights();

    const topAssociations = useMemo(() => {
        if (!data?.data?.categories?.byAssociation) return [];
        return [...data.data.categories.byAssociation]
            .sort((a, b) => b.fixtureCount - a.fixtureCount)
            .slice(0, 5);
    }, [data]);

    const topCompetitions = useMemo(() => {
        if (!data?.data?.categories?.byCompetition) return [];
        return [...data.data.categories.byCompetition]
            .sort((a, b) => b.fixtureCount - a.fixtureCount)
            .slice(0, 5);
    }, [data]);

    if (isLoading) {
        return (
            <SectionContainer
                title="Top Entities"
                description="Highest volume entities"
                className="h-full"
            >
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                            <Skeleton className="h-4 w-8" />
                        </div>
                    ))}
                </div>
            </SectionContainer>
        );
    }

    if (error) {
        return (
            <SectionContainer title="Top Entities" className="h-full">
                <ErrorState
                    error={error}
                    title="Failed to load entities"
                    onRetry={() => refetch()}
                    variant="minimal"
                />
            </SectionContainer>
        );
    }

    return (
        <SectionContainer
            title="Top Entities"
            description="Highest volume entities"
            className="h-full"
        >
            <Tabs defaultValue="associations" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="associations">Associations</TabsTrigger>
                    <TabsTrigger value="competitions">Competitions</TabsTrigger>
                </TabsList>

                <TabsContent value="associations" className="mt-0">
                    <ScrollArea className="h-[240px] pr-4">
                        <div className="space-y-4">
                            {topAssociations.map((assoc, i) => (
                                <div
                                    key={assoc.associationId}
                                    className="flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
                                            {i + 1}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-medium truncate" title={assoc.associationName}>
                                                {assoc.associationName}
                                            </span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Trophy className="h-3 w-3" />
                                                {assoc.competitionCount} Comps
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-sm font-bold tabular-nums shrink-0">
                                        {assoc.fixtureCount}
                                    </div>
                                </div>
                            ))}
                            {topAssociations.length === 0 && (
                                <div className="text-center py-8 text-sm text-muted-foreground">
                                    No associations found
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="competitions" className="mt-0">
                    <ScrollArea className="h-[240px] pr-4">
                        <div className="space-y-4">
                            {topCompetitions.map((comp, i) => (
                                <div
                                    key={comp.competitionId}
                                    className="flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 font-bold text-xs">
                                            {i + 1}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-medium truncate" title={comp.competitionName}>
                                                {comp.competitionName}
                                            </span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1 truncate" title={comp.associationName}>
                                                <Building2 className="h-3 w-3" />
                                                {comp.associationName}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-sm font-bold tabular-nums shrink-0">
                                        {comp.fixtureCount}
                                    </div>
                                </div>
                            ))}
                            {topCompetitions.length === 0 && (
                                <div className="text-center py-8 text-sm text-muted-foreground">
                                    No competitions found
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </SectionContainer>
    );
}
