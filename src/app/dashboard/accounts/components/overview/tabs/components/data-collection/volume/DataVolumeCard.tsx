"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Database } from "lucide-react";

interface DataVolumeCardProps {
  data: AccountStatsResponse;
}

/**
 * DataVolumeCard Component
 *
 * Displays data volume statistics including:
 * - Total Items Processed
 * - Average Items Per Collection
 * - Update Ratio %
 * - New Item Ratio %
 * - Visual breakdown
 */
export default function DataVolumeCard({ data }: DataVolumeCardProps) {
  const volume = data.data.dataVolume;

  if (!volume) {
    return (
      <Card className="shadow-none bg-slate-50 border rounded-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-500" />
            Data Volume
          </CardTitle>
          <CardDescription>
            Data volume statistics and breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No data volume information available
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalItemsProcessed = volume.totalItemsProcessed || 0;
  const averageItemsPerCollection = volume.averageItemsPerCollection || 0;
  const updateRatio = volume.updateRatio || 0;
  const newItemRatio = volume.newItemRatio || 0;

  // Calculate estimated values for visualization
  // These are approximations based on ratios
  const estimatedUpdated =
    totalItemsProcessed > 0
      ? Math.round((totalItemsProcessed * updateRatio) / 100)
      : 0;
  const estimatedNew =
    totalItemsProcessed > 0
      ? Math.round((totalItemsProcessed * newItemRatio) / 100)
      : 0;

  // Calculate remaining (items that are neither updated nor new)
  const remaining = totalItemsProcessed - estimatedUpdated - estimatedNew;

  return (
    <Card className="shadow-none bg-slate-50 border rounded-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-500" />
          <CardTitle className="text-lg font-semibold">Data Volume</CardTitle>
        </div>
        <CardDescription>
          Data volume statistics and processing breakdown
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Primary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Total Items Processed
            </div>
            <div className="text-3xl font-bold text-indigo-600">
              {totalItemsProcessed.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              Across all collections
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Average Items Per Collection
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {averageItemsPerCollection.toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground">
              Mean items per collection run
            </div>
          </div>
        </div>

        {/* Ratio Metrics */}
        <div className="space-y-4 pt-4 border-t">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Update Ratio</span>
              <span className="font-semibold text-emerald-600">
                {updateRatio.toFixed(1)}%
              </span>
            </div>
            <Progress value={updateRatio} className="h-2" />
            <div className="text-xs text-muted-foreground">
              ~{estimatedUpdated.toLocaleString()} items updated
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">New Item Ratio</span>
              <span className="font-semibold text-blue-600">
                {newItemRatio.toFixed(1)}%
              </span>
            </div>
            <Progress value={newItemRatio} className="h-2" />
            <div className="text-xs text-muted-foreground">
              ~{estimatedNew.toLocaleString()} new items
            </div>
          </div>
        </div>

        {/* Visual Breakdown */}
        <div className="space-y-3 pt-4 border-t">
          <div className="text-sm font-medium text-muted-foreground">
            Estimated Breakdown
          </div>
          <div className="flex gap-2 h-8 rounded-md overflow-hidden">
            {updateRatio > 0 && (
              <div
                className="bg-emerald-500 flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${updateRatio}%` }}
                title={`Updated: ${estimatedUpdated.toLocaleString()} (${updateRatio.toFixed(
                  1
                )}%)`}
              >
                {updateRatio > 5 && `${updateRatio.toFixed(0)}%`}
              </div>
            )}
            {newItemRatio > 0 && (
              <div
                className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${newItemRatio}%` }}
                title={`New: ${estimatedNew.toLocaleString()} (${newItemRatio.toFixed(
                  1
                )}%)`}
              >
                {newItemRatio > 5 && `${newItemRatio.toFixed(0)}%`}
              </div>
            )}
            {remaining > 0 && (
              <div
                className="bg-slate-300 flex items-center justify-center text-slate-700 text-xs font-medium"
                style={{ width: `${100 - updateRatio - newItemRatio}%` }}
                title={`Other: ~${remaining.toLocaleString()}`}
              >
                {100 - updateRatio - newItemRatio > 5 && "Other"}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
              <span>Updated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-sm" />
              <span>New</span>
            </div>
            {remaining > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-300 rounded-sm" />
                <span>Other</span>
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-semibold text-emerald-600">
              {estimatedUpdated.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Updated Items
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-blue-600">
              {estimatedNew.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">New Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold">
              {remaining.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Other Items
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
