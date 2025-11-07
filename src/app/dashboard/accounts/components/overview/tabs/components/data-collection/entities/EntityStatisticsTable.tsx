"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label, H4, SubsectionTitle, ByLine } from "@/components/type/titles";
import { formatPercentage } from "@/utils/chart-formatters";
import {
  Database,
  Trophy,
  Users,
  Gamepad2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

interface EntityStatisticsTableProps {
  data: AccountStatsResponse;
}

/**
 * EntityStatisticsTable Component
 *
 * Displays entity statistics for competitions, teams, and games in a table format.
 * Shows key metrics including items found, updated, new, errors, and rates with visual indicators.
 */
export default function EntityStatisticsTable({
  data,
}: EntityStatisticsTableProps) {
  const entityStats = data.data.entityStatistics;

  // Helper function to get error rate color (errorRate is 0-100 range)
  const getErrorRateColor = (errorRate: number): string => {
    if (errorRate > 10) return "text-error-600 font-semibold";
    if (errorRate > 5) return "text-warning-600";
    return "text-success-600";
  };

  // Helper function to get rate badge color (rate is 0-100 range)
  const getRateBadgeColor = (rate: number): string => {
    if (rate >= 80) return "bg-success-500";
    if (rate >= 50) return "bg-info-500";
    if (rate >= 20) return "bg-warning-500";
    return "bg-error-500";
  };

  // Helper function to get new item rate badge color (rate is 0-100 range)
  const getNewItemRateBadgeColor = (rate: number): string => {
    if (rate > 20) return "bg-success-500";
    if (rate > 10) return "bg-info-500";
    return "bg-slate-500";
  };

  // Helper function to get error rate badge color (errorRate is 0-100 range)
  const getErrorRateBadgeColor = (errorRate: number): string => {
    if (errorRate > 10) return "bg-error-500";
    if (errorRate > 5) return "bg-warning-500";
    return "bg-success-500";
  };

  // Entity type configuration with icons and labels
  const entityTypes = [
    {
      key: "competitions" as const,
      label: "Competitions",
      icon: Trophy,
      iconColor: "text-amber-500",
    },
    {
      key: "teams" as const,
      label: "Teams",
      icon: Users,
      iconColor: "text-blue-500",
    },
    {
      key: "games" as const,
      label: "Games",
      icon: Gamepad2,
      iconColor: "text-purple-500",
    },
  ];

  return (
    <ElementContainer variant="dark" border padding="md">
      <div className="flex items-center gap-2 mb-2">
        <Database className="w-5 h-5 text-slate-600" />
        <SubsectionTitle className="m-0">Entity Statistics</SubsectionTitle>
      </div>
      <ByLine className="mb-4">
        Breakdown of data collection statistics by entity type
      </ByLine>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Entity Type</TableHead>
              <TableHead className="text-right">Items Found</TableHead>
              <TableHead className="text-right">Items Updated</TableHead>
              <TableHead className="text-right">Items New</TableHead>
              <TableHead className="text-right">Errors</TableHead>
              <TableHead className="text-center">Update Rate</TableHead>
              <TableHead className="text-center">New Item Rate</TableHead>
              <TableHead className="text-center">Error Rate</TableHead>
              <TableHead className="text-right">Avg Items/Collection</TableHead>
              <TableHead className="text-right">Collections</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entityTypes.map((entityType) => {
              const stats = entityStats[entityType.key];
              const IconComponent = entityType.icon;

              return (
                <TableRow key={entityType.key}>
                  {/* Entity Type */}
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <IconComponent
                        className={`w-4 h-4 ${entityType.iconColor}`}
                      />
                      <span>{entityType.label}</span>
                    </div>
                  </TableCell>

                  {/* Items Found */}
                  <TableCell className="text-right font-semibold">
                    {stats.totalItemsFound.toLocaleString()}
                  </TableCell>

                  {/* Items Updated */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span>{stats.totalItemsUpdated.toLocaleString()}</span>
                      {stats.totalItemsUpdated > 0 && (
                        <TrendingUp className="w-3 h-3 text-blue-500" />
                      )}
                    </div>
                  </TableCell>

                  {/* Items New */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-success-600 font-medium">
                        {stats.totalItemsNew.toLocaleString()}
                      </span>
                      {stats.totalItemsNew > 0 && (
                        <TrendingUp className="w-3 h-3 text-success-500" />
                      )}
                    </div>
                  </TableCell>

                  {/* Errors */}
                  <TableCell className="text-right">
                    {stats.totalErrors > 0 ? (
                      <div className="flex items-center justify-end gap-1">
                        <AlertCircle className="w-4 h-4 text-error-500" />
                        <span className="text-error-600 font-semibold">
                          {stats.totalErrors.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-success-600">0</span>
                    )}
                  </TableCell>

                  {/* Update Rate */}
                  <TableCell className="text-center">
                    <Badge
                      className={`${getRateBadgeColor(
                        stats.updateRate
                      )} text-white border-0 rounded-full text-xs`}
                    >
                      {formatPercentage(stats.updateRate)}
                    </Badge>
                  </TableCell>

                  {/* New Item Rate */}
                  <TableCell className="text-center">
                    <Badge
                      className={`${getNewItemRateBadgeColor(
                        stats.newItemRate
                      )} text-white border-0 rounded-full text-xs`}
                    >
                      {formatPercentage(stats.newItemRate)}
                    </Badge>
                  </TableCell>

                  {/* Error Rate */}
                  <TableCell className="text-center">
                    <Badge
                      className={`${getErrorRateBadgeColor(
                        stats.errorRate
                      )} text-white border-0 rounded-full text-xs ${getErrorRateColor(
                        stats.errorRate
                      )}`}
                    >
                      {formatPercentage(stats.errorRate)}
                    </Badge>
                  </TableCell>

                  {/* Average Items Per Collection */}
                  <TableCell className="text-right text-muted-foreground">
                    {stats.averageItemsPerCollection.toFixed(1)}
                  </TableCell>

                  {/* Collections Processed */}
                  <TableCell className="text-right">
                    {stats.collectionsProcessed.toLocaleString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Summary Footer */}
      <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label className="text-xs m-0">Total Items Found</Label>
          <H4 className="text-lg font-semibold m-0">
            {(
              entityStats.competitions.totalItemsFound +
              entityStats.teams.totalItemsFound +
              entityStats.games.totalItemsFound
            ).toLocaleString()}
          </H4>
        </div>
        <div className="space-y-1">
          <Label className="text-xs m-0">Total Errors</Label>
          <H4 className="text-lg font-semibold m-0 text-error-600">
            {(
              entityStats.competitions.totalErrors +
              entityStats.teams.totalErrors +
              entityStats.games.totalErrors
            ).toLocaleString()}
          </H4>
        </div>
        <div className="space-y-1">
          <Label className="text-xs m-0">Avg Error Rate</Label>
          <H4 className="text-lg font-semibold m-0">
            {formatPercentage(
              (entityStats.competitions.errorRate +
                entityStats.teams.errorRate +
                entityStats.games.errorRate) /
                3
            )}
          </H4>
        </div>
      </div>
    </ElementContainer>
  );
}
