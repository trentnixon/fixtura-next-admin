"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { EmptyState } from "@/components/ui-library";
import { Label, H4 } from "@/components/type/titles";
import { Badge } from "@/components/ui/badge";
import { TestRun } from "@/types/fetch-account-scrape-test";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface AccountTestDiscrepanciesTableProps {
  data: TestRun;
}

export function AccountTestDiscrepanciesTable({
  data,
}: AccountTestDiscrepanciesTableProps) {
  // Since we don't have detailed discrepancies in the TestRun interface,
  // we'll create a summary based on the available data
  const discrepancies = [];

  // Validation Failure - only show if there are validations to check
  if (data.validation.totalValidations > 0) {
    discrepancies.push({
      id: 1,
      type: "Validation Failure",
      description: `${data.validation.failedValidations} validations failed out of ${data.validation.totalValidations}`,
      severity: data.validation.failedValidations > 0 ? "high" : "none",
      status: data.validation.failedValidations > 0 ? "failed" : "passed",
    });
  } else {
    // Show info if no validations were performed
    discrepancies.push({
      id: 1,
      type: "Validation Status",
      description: "No validations were performed for this test",
      severity: "none",
      status: "passed",
    });
  }

  // Item Count Mismatch - only show if expected count is set (> 0)
  if (data.dataComparison.expectedItemCount > 0) {
    const isMatch =
      data.dataComparison.itemCountMatch ??
      data.dataComparison.scrapedItemCount ===
        data.dataComparison.expectedItemCount;

    discrepancies.push({
      id: 2,
      type: "Item Count Mismatch",
      description: `Scraped ${data.dataComparison.scrapedItemCount} items, expected ${data.dataComparison.expectedItemCount}`,
      severity: !isMatch ? "medium" : "none",
      status: isMatch ? "passed" : "warning",
    });
  } else {
    // Show info if no expected count is set
    discrepancies.push({
      id: 2,
      type: "Item Count",
      description: `Scraped ${data.dataComparison.scrapedItemCount} items (no expected count set)`,
      severity: "none",
      status: "passed",
    });
  }

  // Regression Detection
  discrepancies.push({
    id: 3,
    type: "Regression Detection",
    description: data.regressionDetected
      ? "Regression detected in test results"
      : "No regression detected",
    severity: data.regressionDetected ? "high" : "none",
    status: data.regressionDetected ? "failed" : "passed",
  });

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-error-500 text-white";
      case "medium":
        return "bg-warning-500 text-white";
      case "low":
        return "bg-info-500 text-white";
      default:
        return "bg-success-500 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-error-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-success-500" />;
    }
  };

  const getBorderColor = (status: string) => {
    switch (status) {
      case "passed":
        return "border-l-success-500";
      case "failed":
        return "border-l-error-500";
      case "warning":
        return "border-l-warning-500";
      default:
        return "border-l-success-500";
    }
  };

  return (
    <SectionContainer
      title="Test Analysis & Discrepancies"
      description="Detailed analysis of test results and detected issues"
      variant="compact"
    >
      {discrepancies.length === 0 ? (
        <EmptyState title="No discrepancies found" variant="minimal" />
      ) : (
        <ul className="space-y-2">
          {discrepancies.map((discrepancy) => (
            <li
              key={discrepancy.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-colors border-l-4 ${getBorderColor(
                discrepancy.status
              )} ${
                discrepancy.status === "failed"
                  ? "border-error-200 bg-error-50/50 hover:bg-error-50"
                  : discrepancy.status === "warning"
                  ? "border-warning-200 bg-warning-50/50 hover:bg-warning-50"
                  : "border-slate-200 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`p-2 rounded-lg flex-shrink-0 ${
                    discrepancy.status === "failed"
                      ? "bg-error-100 text-error-700"
                      : discrepancy.status === "warning"
                      ? "bg-warning-100 text-warning-700"
                      : "bg-success-100 text-success-700"
                  }`}
                >
                  {getStatusIcon(discrepancy.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <Label className="font-semibold text-sm m-0 mb-1 block">
                    {discrepancy.type}
                  </Label>
                  <p className="text-xs text-muted-foreground m-0">
                    {discrepancy.description}
                  </p>
                </div>
              </div>
              <Badge
                className={`rounded-full flex-shrink-0 ${getSeverityBadgeColor(
                  discrepancy.severity
                )}`}
              >
                {discrepancy.severity === "none"
                  ? "No Issues"
                  : discrepancy.severity.toUpperCase()}
              </Badge>
            </li>
          ))}
        </ul>
      )}

      {/* Test Summary */}
      <ElementContainer
        title="Test Summary"
        variant="dark"
        border
        padding="md"
        className="mt-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white rounded border border-slate-200">
            <H4 className="text-xl font-bold text-info-600 m-0 mb-1">
              {data.validation.totalValidations}
            </H4>
            <Label className="text-xs text-muted-foreground m-0">
              Total Validations
            </Label>
          </div>
          <div className="text-center p-3 bg-white rounded border border-slate-200">
            <H4 className="text-xl font-bold text-success-600 m-0 mb-1">
              {data.validation.passedValidations}
            </H4>
            <Label className="text-xs text-muted-foreground m-0">Passed</Label>
          </div>
          <div className="text-center p-3 bg-white rounded border border-slate-200">
            <H4 className="text-xl font-bold text-error-600 m-0 mb-1">
              {data.validation.failedValidations}
            </H4>
            <Label className="text-xs text-muted-foreground m-0">Failed</Label>
          </div>
        </div>
      </ElementContainer>
    </SectionContainer>
  );
}
