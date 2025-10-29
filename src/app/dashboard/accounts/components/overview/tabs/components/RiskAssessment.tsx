"use client";

import { AccountAnalytics } from "@/types/analytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, CheckCircle, AlertCircle } from "lucide-react";

/**
 * RiskAssessment Component
 *
 * Displays risk indicators and factors affecting account health.
 * Provides risk level assessment and mitigation recommendations.
 *
 * @param analytics - Account analytics data
 */
export default function RiskAssessment({
  analytics,
}: {
  analytics?: AccountAnalytics;
}) {
  if (!analytics?.riskIndicators) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  const {
    paymentFailures,
    subscriptionCancellations,
    longInactivityPeriods,
    downgradeHistory,
    riskLevel,
    riskFactors,
  } = analytics.riskIndicators;

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "high":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case "low":
        return "default";
      case "medium":
        return "secondary";
      case "high":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "medium":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "high":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Shield className="w-5 h-5 text-gray-500" />;
    }
  };

  const riskIndicators = [
    {
      label: "Payment Failures",
      count: paymentFailures,
      severity:
        paymentFailures > 2 ? "high" : paymentFailures > 0 ? "medium" : "low",
      description: "Failed payment attempts",
    },
    {
      label: "Subscription Cancellations",
      count: subscriptionCancellations,
      severity: subscriptionCancellations > 1 ? "medium" : "low",
      description: "Cancelled subscriptions",
    },
    {
      label: "Inactivity Periods",
      count: longInactivityPeriods,
      severity: longInactivityPeriods > 0 ? "medium" : "low",
      description: "Extended periods of no activity",
    },
    {
      label: "Downgrade History",
      count: downgradeHistory,
      severity: downgradeHistory > 0 ? "medium" : "low",
      description: "Subscription tier downgrades",
    },
  ];

  return (
    <Card className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              Risk Assessment
            </CardTitle>
            <CardDescription>
              Account risk factors and indicators
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getRiskIcon(riskLevel)}
            <Badge variant={getRiskBadgeVariant(riskLevel)} className="text-lg">
              {riskLevel.toUpperCase()} RISK
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Risk Indicators */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Risk Indicators</h3>
          <div className="grid grid-cols-2 gap-4">
            {riskIndicators.map((indicator, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg ${
                  indicator.count > 0
                    ? indicator.severity === "high"
                      ? "border-red-200 bg-red-50"
                      : indicator.severity === "medium"
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-green-200 bg-green-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{indicator.label}</p>
                  <p
                    className={`text-lg font-bold ${getRiskColor(
                      indicator.severity
                    )}`}
                  >
                    {indicator.count}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {indicator.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Factors */}
        {riskFactors && riskFactors.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Identified Risk Factors</h3>
            <div className="space-y-2">
              {riskFactors.map((factor, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-slate-100 border border-slate-300 rounded-lg"
                >
                  <AlertTriangle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{factor}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="p-4 bg-slate-100 border border-slate-300 rounded-lg">
          <div className="flex items-start gap-2">
            <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">Risk Mitigation</p>
              <p className="text-sm text-muted-foreground mt-1">
                {riskLevel === "low"
                  ? "Account has minimal risk factors. Continue monitoring."
                  : riskLevel === "medium"
                  ? "Address identified risk factors to improve account stability."
                  : "Immediate action required. Contact account manager to address critical issues."}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
