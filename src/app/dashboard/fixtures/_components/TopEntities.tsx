"use client";

import { useMemo } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Skeleton } from "@/components/ui/skeleton";
import { useFixtureInsights } from "@/hooks/fixtures/useFixtureInsights";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
        title="Fixture Leaders"
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
      <SectionContainer title="Fixture Leaders" className="h-full">
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
      title="Fixture Leaders"
      description="Associations and competitions with the most fixture volume."
      className="h-full"
    >
      <Tabs defaultValue="associations" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="associations">Associations</TabsTrigger>
          <TabsTrigger value="competitions">Competitions</TabsTrigger>
        </TabsList>

        <TabsContent value="associations" className="mt-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead>Association</TableHead>
                <TableHead className="text-right">Competitions</TableHead>
                <TableHead className="text-right">Fixtures</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topAssociations.map((assoc, i) => (
                <TableRow key={assoc.associationId}>
                  <TableCell>
                    <div className="text-sm font-medium text-slate-900">
                      {assoc.associationName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Rank {i + 1}
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {assoc.competitionCount}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {assoc.fixtureCount}
                  </TableCell>
                </TableRow>
              ))}
              {topAssociations.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="py-8 text-center text-sm text-muted-foreground"
                  >
                    No associations found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="competitions" className="mt-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead>Competition</TableHead>
                <TableHead>Association</TableHead>
                <TableHead className="text-right">Fixtures</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCompetitions.map((comp, i) => (
                <TableRow key={comp.competitionId}>
                  <TableCell>
                    <div className="text-sm font-medium text-slate-900">
                      {comp.competitionName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Rank {i + 1}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {comp.associationName}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {comp.fixtureCount}
                  </TableCell>
                </TableRow>
              ))}
              {topCompetitions.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="py-8 text-center text-sm text-muted-foreground"
                  >
                    No competitions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </SectionContainer>
  );
}
