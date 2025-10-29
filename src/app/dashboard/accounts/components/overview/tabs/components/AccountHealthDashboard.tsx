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
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Award,
  TrendingUp,
  Shield,
  CreditCard,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

/**
 * AccountHealthDashboard Component
 *
 * Displays account health score with detailed breakdown and visual indicators.
 * Provides health level assessment and recommendations.
 *
 * @param analytics - Account analytics data
 */
export default function AccountHealthDashboard({
  analytics,
}: {
  analytics?: AccountAnalytics;
}) {
  if (!analytics?.accountHealthScore) {
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

  const { overallScore, breakdown, healthLevel } = analytics.accountHealthScore;

  const getHealthBadgeVariant = (level: string) => {
    switch (level) {
      case "excellent":
        return "default";
      case "good":
        return "default";
      case "fair":
        return "secondary";
      case "poor":
      case "critical":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getRecommendations = (level: string) => {
    switch (level) {
      case "excellent":
        return "Account is in excellent health. Keep up the great work!";
      case "good":
        return "Account is performing well. Monitor for any changes.";
      case "fair":
        return "Account needs attention. Review subscription activity and payment patterns.";
      case "poor":
        return "Account health is declining. Immediate action required.";
      case "critical":
        return "Account health is critical. Contact customer support immediately.";
      default:
        return "Unable to assess account health.";
    }
  };

  const healthFactors = [
    {
      name: "Account Setup",
      score: breakdown.accountSetup,
      icon: Shield,
      description: "Profile completeness and configuration",
    },
    {
      name: "Account Activity",
      score: breakdown.accountActivity,
      icon: Activity,
      description: "Recent engagement and usage",
    },
    {
      name: "Payment Success",
      score: breakdown.paymentSuccess,
      icon: CreditCard,
      description: "Successful transaction rate",
    },
    {
      name: "Subscription Continuity",
      score: breakdown.subscriptionContinuity,
      icon: CheckCircle,
      description: "Ongoing subscription stability",
    },
    {
      name: "Trial Conversion",
      score: breakdown.trialConversion,
      icon: TrendingUp,
      description: "Conversion from trial to paid",
    },
  ];

  return (
    <Card className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-500" />
              Account Health Score
            </CardTitle>
            <CardDescription>Overall account health assessment</CardDescription>
          </div>
          <Badge
            variant={getHealthBadgeVariant(healthLevel)}
            className="text-lg"
          >
            {healthLevel.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Score</span>
            <span className="text-2xl font-bold">{overallScore}/100</span>
          </div>
          <Progress value={overallScore} className="h-3" />
        </div>

        {/* Health Factors Breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Health Factors</h3>
          <div className="space-y-3">
            {healthFactors.map((factor, index) => {
              const Icon = factor.icon;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{factor.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {factor.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">
                      {factor.score}/20
                    </span>
                  </div>
                  <Progress value={(factor.score / 20) * 100} className="h-2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="p-4 bg-slate-100 border border-slate-300 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">Recommendations</p>
              <p className="text-sm text-muted-foreground mt-1">
                {getRecommendations(healthLevel)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
