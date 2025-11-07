"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Progress } from "@/components/ui/progress";
import { Label, H4, SubsectionTitle, ByLine } from "@/components/type/titles";
import { EmptyState } from "@/components/ui-library";
import { formatPercentage } from "@/utils/chart-formatters";
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
      <ElementContainer variant="dark" border padding="md">
        <div className="flex items-center gap-2 mb-2">
          <Database className="w-5 h-5 text-indigo-500" />
          <SubsectionTitle className="m-0">Data Volume</SubsectionTitle>
        </div>
        <ByLine className="mb-4">Data volume statistics and breakdown</ByLine>
        <EmptyState
          variant="minimal"
          description="No data volume information available"
        />
      </ElementContainer>
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
    <ElementContainer variant="dark" border padding="md">
      <div className="flex items-center gap-2 mb-2">
        <Database className="w-5 h-5 text-indigo-500" />
        <SubsectionTitle className="m-0">Data Volume</SubsectionTitle>
      </div>
      <ByLine className="mb-4">
        Data volume statistics and processing breakdown
      </ByLine>

      <div className="space-y-6">
        {/* Primary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-sm m-0">Total Items Processed</Label>
            <H4 className="text-3xl font-bold m-0 text-indigo-600">
              {totalItemsProcessed.toLocaleString()}
            </H4>
            <ByLine className="text-xs m-0">Across all collections</ByLine>
          </div>

          <div className="space-y-1">
            <Label className="text-sm m-0">Average Items Per Collection</Label>
            <H4 className="text-3xl font-bold m-0 text-purple-600">
              {averageItemsPerCollection.toFixed(0)}
            </H4>
            <ByLine className="text-xs m-0">
              Mean items per collection run
            </ByLine>
          </div>
        </div>

        {/* Ratio Metrics */}
        <div className="space-y-4 pt-4 border-t">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm m-0">Update Ratio</Label>
              <H4 className="text-sm font-semibold m-0 text-success-600">
                {formatPercentage(updateRatio)}
              </H4>
            </div>
            <Progress value={updateRatio} className="h-2" />
            <ByLine className="text-xs m-0">
              ~{estimatedUpdated.toLocaleString()} items updated
            </ByLine>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm m-0">New Item Ratio</Label>
              <H4 className="text-sm font-semibold m-0 text-info-600">
                {formatPercentage(newItemRatio)}
              </H4>
            </div>
            <Progress value={newItemRatio} className="h-2" />
            <ByLine className="text-xs m-0">
              ~{estimatedNew.toLocaleString()} new items
            </ByLine>
          </div>
        </div>

        {/* Visual Breakdown */}
        <div className="space-y-3 pt-4 border-t">
          <Label className="text-sm font-medium m-0">Estimated Breakdown</Label>
          <div className="flex gap-2 h-8 rounded-md overflow-hidden">
            {updateRatio > 0 && (
              <div
                className="bg-success-500 flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${updateRatio}%` }}
                title={`Updated: ${estimatedUpdated.toLocaleString()} (${formatPercentage(
                  updateRatio
                )})`}
              >
                {updateRatio > 5 && formatPercentage(updateRatio)}
              </div>
            )}
            {newItemRatio > 0 && (
              <div
                className="bg-info-500 flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${newItemRatio}%` }}
                title={`New: ${estimatedNew.toLocaleString()} (${formatPercentage(
                  newItemRatio
                )})`}
              >
                {newItemRatio > 5 && formatPercentage(newItemRatio)}
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
              <div className="w-3 h-3 bg-success-500 rounded-sm" />
              <span>Updated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-info-500 rounded-sm" />
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
          <div className="text-center space-y-1">
            <H4 className="text-2xl font-semibold m-0 text-success-600">
              {estimatedUpdated.toLocaleString()}
            </H4>
            <Label className="text-xs m-0">Updated Items</Label>
          </div>
          <div className="text-center space-y-1">
            <H4 className="text-2xl font-semibold m-0 text-info-600">
              {estimatedNew.toLocaleString()}
            </H4>
            <Label className="text-xs m-0">New Items</Label>
          </div>
          <div className="text-center space-y-1">
            <H4 className="text-2xl font-semibold m-0">
              {remaining.toLocaleString()}
            </H4>
            <Label className="text-xs m-0">Other Items</Label>
          </div>
        </div>
      </div>
    </ElementContainer>
  );
}
