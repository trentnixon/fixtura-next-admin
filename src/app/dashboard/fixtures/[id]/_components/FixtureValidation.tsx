"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { SingleFixtureDetailResponse } from "@/types/fixtureDetail";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { cn } from "@/lib/utils";

interface FixtureValidationProps {
  data: SingleFixtureDetailResponse;
}

export default function FixtureValidation({ data }: FixtureValidationProps) {
  const { validation } = data.meta;

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "excellent":
      case "good":
        return "default";
      case "fair":
        return "secondary";
      case "poor":
        return "outline";
      case "critical":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Get color class based on percentage
  const getProgressColor = (value: number): string => {
    if (value >= 80) return "bg-green-500"; // Excellent
    if (value >= 60) return "bg-blue-500"; // Good
    if (value >= 40) return "bg-yellow-500"; // Fair
    if (value >= 20) return "bg-orange-500"; // Poor
    return "bg-red-500"; // Critical
  };

  const breakdownItems = [
    { label: "Basic Info", value: validation.breakdown.basicInfo },
    { label: "Scheduling", value: validation.breakdown.scheduling },
    { label: "Match Details", value: validation.breakdown.matchDetails },
    { label: "Content", value: validation.breakdown.content },
    { label: "Relations", value: validation.breakdown.relations },
    { label: "Results", value: validation.breakdown.results },
  ];

  return (
    <SectionContainer
      title="Data Quality"
      description="Fixture data completeness validation"
    >
      <div className="space-y-6">
        {/* Overall Score */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              {validation.overallScore}%
            </div>
            <Badge variant={getStatusVariant(validation.status)} className="text-sm">
              {validation.status}
            </Badge>
          </div>
          {validation.missingFields.length === 0 &&
            validation.recommendations.length === 0 && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Complete</span>
              </div>
            )}
        </div>

        {/* Overall Progress Bar with Color */}
        <div className="relative">
          <Progress
            value={validation.overallScore}
            className={cn("h-3", "[&>div]:transition-all")}
            indicatorClassName={getProgressColor(validation.overallScore)}
          />
        </div>

        {/* Breakdown - Progress Bars Only */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Breakdown by Category
          </div>
          <div className="space-y-3">
            {breakdownItems.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.label}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {item.value}%
                  </span>
                </div>
                <Progress
                  value={item.value}
                  className="h-2"
                  indicatorClassName={getProgressColor(item.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Issues */}
        {(validation.missingFields.length > 0 ||
          validation.recommendations.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {validation.missingFields.length > 0 && (
                <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="font-semibold text-sm text-yellow-900 dark:text-yellow-100">
                      Missing Fields ({validation.missingFields.length})
                    </span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-yellow-800 dark:text-yellow-200">
                    {validation.missingFields.slice(0, 3).map((field, index) => (
                      <li key={index}>{field}</li>
                    ))}
                    {validation.missingFields.length > 3 && (
                      <li className="text-yellow-600 dark:text-yellow-400">
                        +{validation.missingFields.length - 3} more
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {validation.recommendations.length > 0 && (
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                      Recommendations ({validation.recommendations.length})
                    </span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-blue-800 dark:text-blue-200">
                    {validation.recommendations.slice(0, 3).map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                    {validation.recommendations.length > 3 && (
                      <li className="text-blue-600 dark:text-blue-400">
                        +{validation.recommendations.length - 3} more
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
      </div>
    </SectionContainer>
  );
}
