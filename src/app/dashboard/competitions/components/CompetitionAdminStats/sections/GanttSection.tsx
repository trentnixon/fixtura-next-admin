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
import { CompetitionAdminStatsAvailableCompetition } from "@/types/competitionAdminStats";
import {
  GanttFilters,
  type GanttFilters as GanttFiltersType,
} from "./GanttFilters";
import { GanttColorLegend } from "./GanttColorLegend";
import { GanttTooltip } from "./GanttTooltip";
import { CompetitionTooltipContent } from "./CompetitionTooltipContent";

interface GanttSectionProps {
  competitions: CompetitionAdminStatsAvailableCompetition[];
}

export function GanttSection({ competitions }: GanttSectionProps) {
  const [filters, setFilters] = useState<GanttFiltersType>({
    sport: "Cricket",
    association: null,
    season: null,
    hideFinished: true,
  });

  // Debug: Inspect raw competitions data
  // console.log("GanttSection: Raw competitions", competitions);

  const filteredCompetitions = useMemo(() => {
    return competitions.filter((competition) => {
      if (filters.sport !== null && competition.sport !== filters.sport) return false;
      if (filters.association !== null && competition.associationName !== filters.association) return false;
      if (filters.season !== null && competition.season !== filters.season) return false;

      if (filters.hideFinished) {
        // Calculate end date if not present
        let endDate: Date;
        if (competition.startDate) {
          const start = new Date(competition.startDate);
          const duration = Number(competition.durationDays) || 1;
          endDate = new Date(start);
          endDate.setDate(endDate.getDate() + duration);
        } else {
          // If no start date, we can't determine if it's finished.
          // Let's assume it's NOT finished if we don't know.
          return true;
        }

        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() + 1);

        // Hide if it finishes before 1 month from now (i.e. already finished or finishing soon)
        if (endDate < cutoffDate) {
          return false;
        }
      }

      return true;
    });
  }, [competitions, filters]);

  const getWeightColorDynamic = (weight: number) => {
    const w = Number(weight); // Ensure it's a number
    // console.log(`Color Check: Weight=${w}`);

    if (w >= 75) {
      return { backgroundColor: "rgba(34, 197, 94, 0.5)", borderColor: "rgba(34, 197, 94, 1)" };
    } else if (w >= 50) {
      return { backgroundColor: "rgba(234, 179, 8, 0.5)", borderColor: "rgba(234, 179, 8, 1)" };
    } else if (w >= 25) {
      return { backgroundColor: "rgba(249, 115, 22, 0.5)", borderColor: "rgba(249, 115, 22, 1)" };
    }
    return { backgroundColor: "rgba(100, 116, 139, 0.5)", borderColor: "rgba(100, 116, 139, 1)" };
  };

  // Calculate weight thresholds (quartiles) by sport across ALL competitions
  const sportThresholds = useMemo(() => {
    const weightsBySport: Record<string, number[]> = {};

    // Collect weights
    competitions.forEach((comp) => {
      const sport = comp.sport || "Unspecified";
      const weight = Number(comp.weight || 0);
      if (!weightsBySport[sport]) weightsBySport[sport] = [];
      weightsBySport[sport].push(weight);
    });

    // Calculate thresholds
    const thresholds: Record<string, { p75: number; p50: number; p25: number }> = {};

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
        p50: getPercentile(0.50),
        p25: getPercentile(0.25),
      };
    });

    return thresholds;
  }, [competitions]);

  const ganttFeatures: GanttFeature[] = useMemo(() => {
    return filteredCompetitions
      .filter((comp) => comp.startDate) // Only include competitions with valid start date
      .map((comp) => {
        const start = new Date(comp.startDate!);
        const duration = Number(comp.durationDays) || 1; // Default to 1 day if duration is missing
        const end = new Date(start);
        end.setDate(end.getDate() + duration);

        const sport = comp.sport || "Unspecified";
        const rawWeight = Number(comp.weight || 0);
        const thresholds = sportThresholds[sport] || { p75: 0, p50: 0, p25: 0 };

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

        // console.log(`Mapping Comp: ${comp.name}, Sport: ${sport}, Raw: ${rawWeight}, Thresholds:`, thresholds, `Norm: ${normalizedWeight}`);

        return {
          id: comp.id.toString(),
          name: comp.name,
          startAt: start,
          endAt: end,
          weight: normalizedWeight,
          originalWeight: rawWeight, // Store original for display
          competitionId: comp.id,
          season: comp.season || undefined,
        };
      });
  }, [filteredCompetitions, sportThresholds]);

  const sortedFeatures = useMemo(() => {
    return [...ganttFeatures].sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
  }, [ganttFeatures]);

  const hasActiveFilters = Object.values(filters).some(filter => filter !== null && filter !== false);

  if (ganttFeatures.length === 0) {
    return (
      <SectionContainer title="Competition Timeline" description="Gantt chart view of competition start and end dates">
        <div className="space-y-4">
          <GanttFilters competitions={competitions} filters={filters} onFiltersChange={setFilters} />
          <div className="py-8 text-center text-muted-foreground">
            {hasActiveFilters
              ? "No competitions match the current filters. Try adjusting your filter selections."
              : "No competitions with date information available to display."}
          </div>
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer
      title="Competition Timeline"
      description={`Gantt chart showing ${ganttFeatures.length} competition${ganttFeatures.length !== 1 ? "s" : ""} with date information`}
    >
      <div className="space-y-4">
        <GanttFilters competitions={competitions} filters={filters} onFiltersChange={setFilters} />
        <GanttColorLegend />
        <div className="h-[700px] md:w-[800px] lg:w-[1000px] xl:w-[1550px] rounded-lg border">
          <GanttProvider range="monthly" zoom={100}>
            <GanttContent sortedFeatures={sortedFeatures} getWeightColorDynamic={getWeightColorDynamic} />
          </GanttProvider>
        </div>
      </div>
    </SectionContainer>
  );
}

// Inner component that uses Gantt context for scroll-to-view functionality
function GanttContent({
  sortedFeatures,
  getWeightColorDynamic
}: {
  sortedFeatures: GanttFeature[];
  getWeightColorDynamic: (weight: number) => { backgroundColor: string; borderColor: string };
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
            const weight = !isNaN(Number(feature.weight)) ? Number(feature.weight) : 0;
            const colors = getWeightColorDynamic(weight);
            // console.log(`Feature: ${feature.name}, Weight: ${feature.weight}, Resolved Weight: ${weight}, Colors:`, colors);

            return (
              <div key={feature.id} style={{ position: "relative", height: "var(--gantt-row-height)", width: "100%" }}>
                <GanttTooltip content={<CompetitionTooltipContent feature={feature} />}>
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
                      window.location.href = `/dashboard/competitions/${feature.competitionId}`;
                    }}
                  >
                    <div className="flex flex-col flex-1 min-w-0">
                      <p className="truncate text-xs font-medium">
                        {feature.name} <span className="opacity-70">({Number(feature.originalWeight)})</span>
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>{new Date(feature.startAt).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}</span>
                        <span>→</span>
                        <span>{feature.endAt ? new Date(feature.endAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" }) : "N/A"}</span>
                      </div>
                    </div>
                    {typeof feature.season === "string" && feature.season && (
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">{feature.season}</span>
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

