"use client";

import { SectionTitle } from "@/components/type/titles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const discrepancies = [
    {
      id: 1,
      type: "Validation Failure",
      description: `${data.validation.failedValidations} validations failed out of ${data.validation.totalValidations}`,
      severity: data.validation.failedValidations > 0 ? "high" : "none",
      status: data.validation.failedValidations > 0 ? "failed" : "passed",
    },
    {
      id: 2,
      type: "Item Count Mismatch",
      description: `Scraped ${data.dataComparison.scrapedItemCount} items, expected ${data.dataComparison.expectedItemCount}`,
      severity:
        data.dataComparison.scrapedItemCount !==
        data.dataComparison.expectedItemCount
          ? "medium"
          : "none",
      status:
        data.dataComparison.scrapedItemCount ===
        data.dataComparison.expectedItemCount
          ? "passed"
          : "warning",
    },
    {
      id: 3,
      type: "Regression Detection",
      description: data.regressionDetected
        ? "Regression detected in test results"
        : "No regression detected",
      severity: data.regressionDetected ? "high" : "none",
      status: data.regressionDetected ? "failed" : "passed",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-green-600 bg-green-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <div className="mb-6">
      <Card className="bg-slate-50 border-b-4 border-b-orange-500">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center justify-between w-full">
            <SectionTitle>Test Analysis & Discrepancies</SectionTitle>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {discrepancies.map((discrepancy) => (
              <div
                key={discrepancy.id}
                className="flex items-center justify-between p-3 bg-white rounded border-l-4 border-l-blue-500"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(discrepancy.status)}
                  <div>
                    <div className="font-medium">{discrepancy.type}</div>
                    <div className="text-sm text-gray-600">
                      {discrepancy.description}
                    </div>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(
                    discrepancy.severity
                  )}`}
                >
                  {discrepancy.severity === "none"
                    ? "No Issues"
                    : discrepancy.severity.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          {/* Test Summary */}
          <div className="mt-6 pt-4 border-t">
            <div className="text-sm font-medium mb-3">Test Summary</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded">
                <div className="text-xl font-bold text-blue-600">
                  {data.validation.totalValidations}
                </div>
                <div className="text-xs text-gray-600">Total Validations</div>
              </div>
              <div className="text-center p-3 bg-white rounded">
                <div className="text-xl font-bold text-green-600">
                  {data.validation.passedValidations}
                </div>
                <div className="text-xs text-gray-600">Passed</div>
              </div>
              <div className="text-center p-3 bg-white rounded">
                <div className="text-xl font-bold text-red-600">
                  {data.validation.failedValidations}
                </div>
                <div className="text-xs text-gray-600">Failed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
