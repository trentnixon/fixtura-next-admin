"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Gauge } from "lucide-react";
import { SingleFixtureDetailResponse } from "@/types/fixtureDetail";
import { Button } from "@/components/ui/button";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { format } from "date-fns";

interface FixtureAdminContextProps {
  data: SingleFixtureDetailResponse;
}

export default function FixtureAdminContext({
  data,
}: FixtureAdminContextProps) {
  const { context, meta } = data;
  const [showPerformance, setShowPerformance] = useState(false);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "PPp");
    } catch {
      return dateString;
    }
  };

  const admin = context.admin;
  const performance = meta.performance;

  return (
    <SectionContainer
      title="Administrative Context"
      description="Timestamps and performance metrics"
    >
      <div className="space-y-4">
        {/* Timestamps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {admin.createdAt && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-500">
                Created At
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {formatDate(admin.createdAt)}
              </div>
            </div>
          )}
          {admin.updatedAt && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-500">
                Updated At
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {formatDate(admin.updatedAt)}
              </div>
            </div>
          )}
          {admin.publishedAt && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-500">
                Published At
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {formatDate(admin.publishedAt)}
              </div>
            </div>
          )}
          {admin.lastPromptUpdate && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-500">
                Last Prompt Update
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {formatDate(admin.lastPromptUpdate)}
              </div>
            </div>
          )}
        </div>

        {/* Generated At */}
        <div className="pt-2 border-t">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-500">
            Generated At
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {formatDate(meta.generatedAt)}
          </div>
        </div>

        {/* Performance Metrics (Collapsible) */}
        <div className="pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPerformance(!showPerformance)}
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              <span className="text-sm font-medium">Performance Metrics</span>
            </div>
            {showPerformance ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
          {showPerformance && (
            <div className="mt-3 space-y-2 pl-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Fetch Time
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {performance.fetchTimeMs}ms
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Processing Time
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {performance.processingTimeMs}ms
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Total Time
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {performance.totalTimeMs}ms
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </SectionContainer>
  );
}


