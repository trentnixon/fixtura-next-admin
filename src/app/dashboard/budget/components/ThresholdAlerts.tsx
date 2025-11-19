"use client";

import { useState } from "react";
import { useGlobalCostSummary } from "@/hooks/rollups/useGlobalCostSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "./_utils/formatCurrency";

export default function ThresholdAlerts() {
  const [globalThreshold, setGlobalThreshold] = useState<string>("");
  const [accountThreshold, setAccountThreshold] = useState<string>("");
  const [accountId, setAccountId] = useState<string>("");

  const { data: globalData } = useGlobalCostSummary("current-month");

  // Check if thresholds are exceeded
  const globalExceeded =
    globalThreshold &&
    globalData &&
    globalData.totalCost > parseFloat(globalThreshold);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Threshold Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Global Threshold */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="globalThreshold">Global Monthly Threshold ($)</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="globalThreshold"
                  type="number"
                  placeholder="Enter threshold amount"
                  value={globalThreshold}
                  onChange={(e) => setGlobalThreshold(e.target.value)}
                  min="0"
                  step="0.01"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setGlobalThreshold("")}
                >
                  Clear
                </Button>
              </div>
            </div>

            {globalThreshold && globalData && (
              <div
                className={`p-4 rounded-lg border ${
                  globalExceeded
                    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                    : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {globalExceeded ? (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                  <span className="font-semibold">
                    {globalExceeded ? "Threshold Exceeded" : "Within Threshold"}
                  </span>
                </div>
                <div className="text-sm space-y-1">
                  <div>
                    Current Cost: {formatCurrency(globalData.totalCost)}
                  </div>
                  <div>
                    Threshold: {formatCurrency(parseFloat(globalThreshold))}
                  </div>
                  {globalExceeded && (
                    <div className="font-medium text-red-600">
                      Over by:{" "}
                      {formatCurrency(
                        globalData.totalCost - parseFloat(globalThreshold)
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Account Threshold */}
          <div className="space-y-4 pt-4 border-t">
            <div>
              <Label htmlFor="accountIdThreshold">Account ID</Label>
              <Input
                id="accountIdThreshold"
                type="number"
                placeholder="Enter account ID"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                min="1"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="accountThreshold">Account Monthly Threshold ($)</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="accountThreshold"
                  type="number"
                  placeholder="Enter threshold amount"
                  value={accountThreshold}
                  onChange={(e) => setAccountThreshold(e.target.value)}
                  min="0"
                  step="0.01"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setAccountThreshold("");
                    setAccountId("");
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>

            {accountThreshold && accountId && (
              <div className="p-4 rounded-lg border bg-muted">
                <div className="text-sm text-muted-foreground">
                  Account threshold monitoring coming soon. Enter account ID and
                  threshold to set up alerts.
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="pt-4 border-t">
            <div className="text-xs text-muted-foreground">
              <strong>Note:</strong> Threshold alerts are currently displayed
              only. Full notification system (email, in-app alerts) can be
              implemented in a future phase.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

