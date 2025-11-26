"use client";

import { useMemo, useState } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  GanttProvider,
  GanttSidebar,
  GanttSidebarItem,
  GanttTimeline,
  GanttHeader,
  GanttFeatureList,
  GanttFeatureItem,
  GanttToday,
  type GanttFeature,
  useGantt,
} from "@/components/ui/shadcn-io/gantt";
import { ClubInsight } from "@/types/clubInsights";
import { GanttTooltip } from "@/app/dashboard/competitions/components/CompetitionAdminStats/sections/GanttTooltip";
import { ClubTooltipContent } from "./ClubTooltipContent";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ClubGanttSectionProps {
  clubs: ClubInsight[];
}

export function ClubGanttSection({ clubs }: ClubGanttSectionProps) {
  const [hideFinished, setHideFinished] = useState(false);
  const [sortByDate, setSortByDate] = useState(true);

  // Filter clubs with valid date ranges and apply hideFinished filter
  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      // Filter out clubs without date ranges
      if (!club.competitionDateRange) {
        return false;
      }

      const dateRange = club.competitionDateRange;
      if (!dateRange.earliestStartDate || !dateRange.latestEndDate) {
        return false;
      }

      // Apply hideFinished filter (hide if ends before 1 month from now)
      if (hideFinished) {
        const endDate = new Date(dateRange.latestEndDate);
        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() + 1);

        // Hide if it finishes before 1 month from now (i.e. already finished or finishing soon)
        if (endDate < cutoffDate) {
          return false;
        }
      }

      return true;
    });
  }, [clubs, hideFinished]);

  // Calculate weight thresholds (quartiles) by sport across ALL clubs
  const sportThresholds = useMemo(() => {
    const weightsBySport: Record<string, number[]> = {};

    // Collect weights (using combined weighting: competitionCount + teamCount)
    filteredClubs.forEach((club) => {
      const sport = club.sport || "Unspecified";
      // Calculate weight as combination of competition and team counts
      const weight = club.competitionCount + club.teamCount;
      if (!weightsBySport[sport]) weightsBySport[sport] = [];
      weightsBySport[sport].push(weight);
    });

    // Calculate thresholds
    const thresholds: Record<
      string,
      { p75: number; p50: number; p25: number }
    > = {};

    Object.keys(weightsBySport).forEach((sport) => {
      const weights = weightsBySport[sport].sort((a, b) => a - b);
      const len = weights.length;

      if (len === 0) {
        thresholds[sport] = { p75: 0, p50: 0, p25: 0 };
        return;
      }

      const getPercentile = (p: number) => {
        const index = Math.floor(len * p);
        return weights[Math.min(index, len - 1)];
      };

      thresholds[sport] = {
        p75: getPercentile(0.75),
        p50: getPercentile(0.5),
        p25: getPercentile(0.25),
      };
    });

    return thresholds;
  }, [filteredClubs]);

  // Transform clubs to Gantt features
  const ganttFeatures: GanttFeature[] = useMemo(() => {
    return filteredClubs.map((club) => {
      const dateRange = club.competitionDateRange!;
      const start = new Date(dateRange.earliestStartDate!);
      const end = new Date(dateRange.latestEndDate!);

      const sport = club.sport || "Unspecified";
      // Calculate weight as combination of competition and team counts
      const rawWeight = club.competitionCount + club.teamCount;
      const thresholds = sportThresholds[sport] || { p75: 0, p50: 0, p25: 0 };

      // Normalize weight based on quartiles (same logic as competition Gantt)
      let normalizedWeight = 0;
      if (rawWeight === 0) {
        normalizedWeight = 0; // Gray
      } else if (rawWeight >= thresholds.p75) {
        normalizedWeight = 80; // Green
      } else if (rawWeight >= thresholds.p50) {
        normalizedWeight = 60; // Yellow
      } else if (rawWeight >= thresholds.p25) {
        normalizedWeight = 40; // Orange
      } else {
        normalizedWeight = 20; // Gray
      }

      // Calculate duration in days for display
      const durationDays = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        id: `club-${club.id}`,
        name: club.name,
        startAt: start,
        endAt: end,
        group: sport,
        weight: normalizedWeight,
        originalWeight: rawWeight, // Store original for display
        // Store additional data for tooltip
        clubId: club.id,
        sport: club.sport,
        competitionCount: dateRange.totalCompetitions,
        validDateCount: dateRange.competitionsWithValidDates,
        durationDays: durationDays,
        teamCount: club.teamCount,
        associationCount: club.associationCount,
        associationNames: club.associationNames,
      } as GanttFeature;
    });
  }, [filteredClubs, sportThresholds]);

  // Sort by start date or alphabetically
  const sortedFeatures = useMemo(() => {
    if (sortByDate) {
      // Sort by start date (current behavior)
      return [...ganttFeatures].sort(
        (a, b) => a.startAt.getTime() - b.startAt.getTime()
      );
    } else {
      // Sort alphabetically by name
      return [...ganttFeatures].sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [ganttFeatures, sortByDate]);

  // Color coding based on weight (same logic as competition Gantt)
  const getWeightColorDynamic = (weight: number) => {
    const w = Number(weight); // Ensure it's a number

    if (w >= 75) {
      return {
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        borderColor: "rgba(34, 197, 94, 1)",
      };
    } else if (w >= 50) {
      return {
        backgroundColor: "rgba(234, 179, 8, 0.5)",
        borderColor: "rgba(234, 179, 8, 1)",
      };
    } else if (w >= 25) {
      return {
        backgroundColor: "rgba(249, 115, 22, 0.5)",
        borderColor: "rgba(249, 115, 22, 1)",
      };
    }
    return {
      backgroundColor: "rgba(100, 116, 139, 0.5)",
      borderColor: "rgba(100, 116, 139, 1)",
    };
  };

  const hasActiveFilters = hideFinished;

  // Calculate statistics for display
  const stats = useMemo(() => {
    const totalClubs = clubs.length;
    const clubsWithDateRangeObject = clubs.filter(
      (club) => club.competitionDateRange !== null
    ).length;
    const clubsWithValidDates = clubs.filter(
      (club) =>
        club.competitionDateRange &&
        club.competitionDateRange.earliestStartDate &&
        club.competitionDateRange.latestEndDate
    ).length;
    const clubsWithNullDates = clubsWithDateRangeObject - clubsWithValidDates;
    const clubsWithoutDateRanges = totalClubs - clubsWithDateRangeObject;
    const displayedClubs = ganttFeatures.length;
    const hiddenByFilter = clubsWithValidDates - displayedClubs;

    return {
      totalClubs,
      clubsWithDateRanges: clubsWithValidDates,
      clubsWithoutDateRanges,
      displayedClubs,
      hiddenByFilter,
      clubsWithDateRangeObject,
      clubsWithNullDates,
    };
  }, [clubs, ganttFeatures.length]);

  if (ganttFeatures.length === 0) {
    return (
      <SectionContainer
        title="Club Competition Timeline"
        description="Gantt chart view of club competition start and end dates"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-end gap-4 border-b pb-4">
            <div className="flex items-center gap-3 h-10">
              <Label
                htmlFor="gantt-hide-finished-filter"
                className="text-sm font-medium"
              >
                Hide Finished
              </Label>
              <Switch
                id="gantt-hide-finished-filter"
                checked={hideFinished}
                onCheckedChange={setHideFinished}
              />
            </div>
            <div className="flex items-center gap-3 h-10">
              <Label
                htmlFor="gantt-sort-by-date-filter"
                className="text-sm font-medium"
              >
                Sort by Date
              </Label>
              <Switch
                id="gantt-sort-by-date-filter"
                checked={sortByDate}
                onCheckedChange={setSortByDate}
              />
            </div>
          </div>
          <div className="py-8 text-center text-muted-foreground space-y-2">
            <p>
              {hasActiveFilters
                ? "No clubs match the current filters. Try adjusting your filter selections."
                : "No clubs with date information available to display."}
            </p>
            <div className="text-xs space-y-1 pt-2 border-t">
              <p>
                Total clubs in response: <strong>{stats.totalClubs}</strong>
              </p>
              <p>
                Clubs with date range object:{" "}
                <strong>{stats.clubsWithDateRangeObject}</strong>
              </p>
              <p>
                Clubs with valid dates:{" "}
                <strong>{stats.clubsWithDateRanges}</strong>
              </p>
              {stats.clubsWithNullDates > 0 && (
                <p>
                  Clubs with null dates:{" "}
                  <strong>{stats.clubsWithNullDates}</strong>
                </p>
              )}
              <p>
                Clubs without date range object:{" "}
                <strong>{stats.clubsWithoutDateRanges}</strong>
              </p>
            </div>
          </div>
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer
      title="Club Competition Timeline"
      description={`Gantt chart showing ${ganttFeatures.length} club${
        ganttFeatures.length !== 1 ? "s" : ""
      } with competition date information`}
    >
      <div className="space-y-4">
        {/* Statistics Display */}
        <div className="text-xs text-muted-foreground border-b pb-3 -mt-2">
          <p>
            Total clubs: <strong>{stats.totalClubs}</strong> | With valid dates:{" "}
            <strong>{stats.clubsWithDateRanges}</strong> | Without date range:{" "}
            <strong>{stats.clubsWithoutDateRanges}</strong>
            {stats.clubsWithNullDates > 0 && (
              <>
                {" "}
                | With null dates: <strong>{stats.clubsWithNullDates}</strong>
              </>
            )}
            {hideFinished && stats.hiddenByFilter > 0 && (
              <>
                {" "}
                | Hidden by filter: <strong>{stats.hiddenByFilter}</strong>
              </>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-4 border-b pb-4">
          <div className="flex items-center gap-3 h-10">
            <Label
              htmlFor="gantt-hide-finished-filter"
              className="text-sm font-medium"
            >
              Hide Finished
            </Label>
            <Switch
              id="gantt-hide-finished-filter"
              checked={hideFinished}
              onCheckedChange={setHideFinished}
            />
          </div>
          <div className="flex items-center gap-3 h-10">
            <Label
              htmlFor="gantt-sort-by-date-filter"
              className="text-sm font-medium"
            >
              Sort by Date
            </Label>
            <Switch
              id="gantt-sort-by-date-filter"
              checked={sortByDate}
              onCheckedChange={setSortByDate}
            />
          </div>
        </div>
        <div className="h-[700px] md:w-[800px] lg:w-[1000px] xl:w-[1550px] rounded-lg border">
          <GanttProvider range="monthly" zoom={100}>
            <GanttContent
              sortedFeatures={sortedFeatures}
              getWeightColorDynamic={getWeightColorDynamic}
            />
          </GanttProvider>
        </div>
      </div>
    </SectionContainer>
  );
}

// Inner component that uses Gantt context for scroll-to-view functionality
function GanttContent({
  sortedFeatures,
  getWeightColorDynamic,
}: {
  sortedFeatures: GanttFeature[];
  getWeightColorDynamic: (weight: number) => {
    backgroundColor: string;
    borderColor: string;
  };
}) {
  const gantt = useGantt();

  const handleScrollToFeature = (featureId: string) => {
    const feature = sortedFeatures.find((f) => f.id === featureId);
    if (feature) {
      gantt.scrollToFeature(feature);
    }
  };

  return (
    <>
      <GanttSidebar count={sortedFeatures.length}>
        {sortedFeatures.map((feature) => (
          <GanttSidebarItem
            key={feature.id}
            feature={feature}
            onSelectItem={handleScrollToFeature}
          />
        ))}
      </GanttSidebar>

      <GanttTimeline>
        <GanttHeader />
        <GanttFeatureList>
          {sortedFeatures.map((feature) => {
            const weight = !isNaN(Number(feature.weight))
              ? Number(feature.weight)
              : 0;
            const colors = getWeightColorDynamic(weight);

            return (
              <div
                key={feature.id}
                style={{
                  position: "relative",
                  height: "var(--gantt-row-height)",
                  width: "100%",
                }}
              >
                <GanttTooltip
                  content={<ClubTooltipContent feature={feature} />}
                >
                  <GanttFeatureItem
                    feature={feature}
                    className="cursor-pointer"
                    style={{
                      backgroundColor: colors.backgroundColor,
                      borderColor: colors.borderColor,
                      borderWidth: "1px",
                      borderStyle: "solid",
                    }}
                    onClick={() => {
                      const clubId = feature.clubId as number;
                      if (clubId) {
                        window.location.href = `/dashboard/club/${clubId}`;
                      }
                    }}
                  >
                    <div className="flex flex-col flex-1 min-w-0">
                      <p className="truncate text-xs font-medium">
                        {feature.name}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>
                          {new Date(feature.startAt).toLocaleDateString(
                            "en-AU",
                            { day: "numeric", month: "short" }
                          )}
                        </span>
                        <span>→</span>
                        <span>
                          {feature.endAt
                            ? new Date(feature.endAt).toLocaleDateString(
                                "en-AU",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                    {feature.group && typeof feature.group === "string" && (
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                        {feature.group}
                      </span>
                    )}
                  </GanttFeatureItem>
                </GanttTooltip>
              </div>
            );
          })}
        </GanttFeatureList>
        <GanttToday />
      </GanttTimeline>
    </>
  );
}
