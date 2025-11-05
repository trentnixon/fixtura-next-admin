"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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

  // Helper function to format percentages
  const formatPercent = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Helper function to get error rate color
  const getErrorRateColor = (errorRate: number): string => {
    if (errorRate > 0.1) return "text-red-600 font-semibold";
    if (errorRate > 0.05) return "text-yellow-600";
    return "text-emerald-600";
  };

  // Helper function to get rate badge variant
  const getRateBadgeVariant = (
    rate: number
  ): "default" | "secondary" | "destructive" | "outline" => {
    if (rate >= 0.8) return "default";
    if (rate >= 0.5) return "secondary";
    if (rate >= 0.2) return "outline";
    return "destructive";
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
    <Card className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-slate-600" />
          <CardTitle className="text-lg font-semibold">
            Entity Statistics
          </CardTitle>
        </div>
        <CardDescription>
          Breakdown of data collection statistics by entity type
        </CardDescription>
      </CardHeader>

      <CardContent>
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
                <TableHead className="text-right">
                  Avg Items/Collection
                </TableHead>
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
                        <span className="text-emerald-600 font-medium">
                          {stats.totalItemsNew.toLocaleString()}
                        </span>
                        {stats.totalItemsNew > 0 && (
                          <TrendingUp className="w-3 h-3 text-emerald-500" />
                        )}
                      </div>
                    </TableCell>

                    {/* Errors */}
                    <TableCell className="text-right">
                      {stats.totalErrors > 0 ? (
                        <div className="flex items-center justify-end gap-1">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <span className="text-red-600 font-semibold">
                            {stats.totalErrors.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-emerald-600">0</span>
                      )}
                    </TableCell>

                    {/* Update Rate */}
                    <TableCell className="text-center">
                      <Badge
                        variant={getRateBadgeVariant(stats.updateRate)}
                        className="text-xs"
                      >
                        {formatPercent(stats.updateRate)}
                      </Badge>
                    </TableCell>

                    {/* New Item Rate */}
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          stats.newItemRate > 0.2
                            ? "default"
                            : stats.newItemRate > 0.1
                            ? "secondary"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {formatPercent(stats.newItemRate)}
                      </Badge>
                    </TableCell>

                    {/* Error Rate */}
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          stats.errorRate > 0.1
                            ? "destructive"
                            : stats.errorRate > 0.05
                            ? "secondary"
                            : "default"
                        }
                        className={`text-xs ${getErrorRateColor(
                          stats.errorRate
                        )}`}
                      >
                        {formatPercent(stats.errorRate)}
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
        <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Total Items Found
            </div>
            <div className="text-lg font-semibold">
              {(
                entityStats.competitions.totalItemsFound +
                entityStats.teams.totalItemsFound +
                entityStats.games.totalItemsFound
              ).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Total Errors
            </div>
            <div className="text-lg font-semibold text-red-600">
              {(
                entityStats.competitions.totalErrors +
                entityStats.teams.totalErrors +
                entityStats.games.totalErrors
              ).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Avg Error Rate
            </div>
            <div className="text-lg font-semibold">
              {formatPercent(
                (entityStats.competitions.errorRate +
                  entityStats.teams.errorRate +
                  entityStats.games.errorRate) /
                  3
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
