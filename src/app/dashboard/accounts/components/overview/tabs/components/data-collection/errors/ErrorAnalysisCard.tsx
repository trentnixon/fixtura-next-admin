"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Badge } from "@/components/ui/badge";
import { Label, H4, SubsectionTitle, ByLine } from "@/components/type/titles";
import { formatPercentage } from "@/utils/chart-formatters";
import {
  AlertTriangle,
  AlertCircle,
  Trophy,
  Users,
  Gamepad2,
  TrendingUp,
} from "lucide-react";

interface ErrorAnalysisCardProps {
  data: AccountStatsResponse;
}

/**
 * ErrorAnalysisCard Component
 *
 * Displays error overview with:
 * - Overall Error Rate (large metric with color coding)
 * - Collections with Errors count
 * - Total Errors across all entities
 * - Error Rate breakdown by entity type (competitions, teams, games)
 */
export default function ErrorAnalysisCard({ data }: ErrorAnalysisCardProps) {
  const errorAnalysis = data.data.errorAnalysis;
  const summary = data.data.summary;

  // Helper function to get error rate severity
  const getErrorSeverity = (
    errorRate: number
  ): {
    level: "low" | "medium" | "high" | "critical";
    color: string;
    borderColor: string;
    badgeColor: string;
    description: string;
  } => {
    if (errorRate >= 0.2) {
      return {
        level: "critical",
        color: "text-error-600",
        borderColor: "border-error-500",
        badgeColor: "bg-error-500",
        description: "Critical - Immediate attention required",
      };
    } else if (errorRate >= 0.1) {
      return {
        level: "high",
        color: "text-error-600",
        borderColor: "border-error-500",
        badgeColor: "bg-error-500",
        description: "High - Review and resolve errors",
      };
    } else if (errorRate >= 0.05) {
      return {
        level: "medium",
        color: "text-warning-600",
        borderColor: "border-warning-500",
        badgeColor: "bg-warning-500",
        description: "Medium - Monitor error rates",
      };
    } else {
      return {
        level: "low",
        color: "text-success-600",
        borderColor: "border-success-500",
        badgeColor: "bg-success-500",
        description: "Low - Error rates are acceptable",
      };
    }
  };

  const severity = getErrorSeverity(errorAnalysis.overallErrorRate);
  const errorRatePercent = formatPercentage(
    errorAnalysis.overallErrorRate * 100
  );

  // Entity type configuration
  const entityTypes = [
    {
      key: "competitions" as const,
      label: "Competitions",
      icon: Trophy,
      iconColor: "text-amber-500",
      errorRate: errorAnalysis.errorRateByEntityType.competitions,
    },
    {
      key: "teams" as const,
      label: "Teams",
      icon: Users,
      iconColor: "text-blue-500",
      errorRate: errorAnalysis.errorRateByEntityType.teams,
    },
    {
      key: "games" as const,
      label: "Games",
      icon: Gamepad2,
      iconColor: "text-purple-500",
      errorRate: errorAnalysis.errorRateByEntityType.games,
    },
  ];

  // Calculate error percentage of total collections
  const errorCollectionPercentage =
    summary.totalCollections > 0
      ? (errorAnalysis.collectionsWithErrors / summary.totalCollections) * 100
      : 0;

  return (
    <ElementContainer
      variant="dark"
      border
      padding="md"
      className={`border-b-4 ${severity.borderColor}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className={`w-5 h-5 ${severity.color}`} />
          <SubsectionTitle className="m-0">Error Analysis</SubsectionTitle>
        </div>
        <Badge
          className={`${severity.badgeColor} text-white border-0 rounded-full text-sm`}
        >
          {severity.level.toUpperCase()}
        </Badge>
      </div>
      <ByLine className="mb-4">{severity.description}</ByLine>

      <div className="space-y-6">
        {/* Overall Error Rate - Large Metric */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm m-0">Overall Error Rate</Label>
            <H4 className={`text-4xl font-bold m-0 ${severity.color}`}>
              {errorRatePercent}
            </H4>
          </div>
          <div className="relative w-full">
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full transition-all ${
                  severity.level === "critical" || severity.level === "high"
                    ? "bg-error-500"
                    : severity.level === "medium"
                    ? "bg-warning-500"
                    : "bg-success-500"
                }`}
                style={{ width: `${errorAnalysis.overallErrorRate * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Key Error Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <Label className="text-sm m-0 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-error-500" />
              Collections with Errors
            </Label>
            <div className="flex items-baseline gap-2">
              <H4 className="text-2xl font-bold m-0 text-error-600">
                {errorAnalysis.collectionsWithErrors.toLocaleString()}
              </H4>
              <ByLine className="text-sm m-0">
                of {summary.totalCollections.toLocaleString()} total
              </ByLine>
            </div>
            <ByLine className="text-xs m-0">
              {errorCollectionPercentage.toFixed(1)}% of collections affected
            </ByLine>
          </div>

          <div className="space-y-1">
            <Label className="text-sm m-0 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning-500" />
              Total Errors
            </Label>
            <div className="flex items-baseline gap-2">
              <H4 className="text-2xl font-bold m-0 text-warning-600">
                {errorAnalysis.totalErrors.toLocaleString()}
              </H4>
              {errorAnalysis.totalErrors > 0 && (
                <TrendingUp className="w-4 h-4 text-error-500" />
              )}
            </div>
            <ByLine className="text-xs m-0">Across all entity types</ByLine>
          </div>
        </div>

        {/* Error Rate by Entity Type */}
        <div className="pt-4 border-t space-y-3">
          <SubsectionTitle className="text-sm m-0">
            Error Rate by Entity Type
          </SubsectionTitle>
          <div className="space-y-3">
            {entityTypes.map((entityType) => {
              const IconComponent = entityType.icon;
              const entityErrorRate = entityType.errorRate;
              const entitySeverity = getErrorSeverity(entityErrorRate);
              const entityErrorPercent = formatPercentage(
                entityErrorRate * 100
              );

              return (
                <div key={entityType.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent
                        className={`w-4 h-4 ${entityType.iconColor}`}
                      />
                      <Label className="text-sm m-0">{entityType.label}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${entitySeverity.badgeColor} text-white border-0 rounded-full text-xs`}
                      >
                        {entityErrorPercent}
                      </Badge>
                      {entityErrorRate >= 0.1 && (
                        <AlertCircle className="w-4 h-4 text-error-500" />
                      )}
                    </div>
                  </div>
                  <div className="relative w-full">
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full transition-all ${
                          entitySeverity.level === "critical" ||
                          entitySeverity.level === "high"
                            ? "bg-error-500"
                            : entitySeverity.level === "medium"
                            ? "bg-warning-500"
                            : "bg-success-500"
                        }`}
                        style={{
                          width: `${entityErrorRate * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        {errorAnalysis.totalErrors > 0 && (
          <div className="pt-4 border-t">
            <div className="rounded-lg bg-error-50 border border-error-200 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-error-600 mt-0.5" />
                <div className="flex-1">
                  <SubsectionTitle className="text-sm m-0 text-error-900">
                    Action Required
                  </SubsectionTitle>
                  <ByLine className="text-xs m-0 mt-1 text-error-700">
                    {errorAnalysis.totalErrors} error
                    {errorAnalysis.totalErrors !== 1 ? "s" : ""} detected across{" "}
                    {errorAnalysis.collectionsWithErrors} collection
                    {errorAnalysis.collectionsWithErrors !== 1 ? "s" : ""}.{" "}
                    {errorAnalysis.overallErrorRate >= 0.1
                      ? "Review error logs and resolve issues to improve data collection reliability."
                      : "Monitor error rates to ensure they remain within acceptable thresholds."}
                  </ByLine>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ElementContainer>
  );
}
