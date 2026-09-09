import { AccountAnalytics } from "@/types/analytics";
import { CheckCircle, Clock, XCircle } from "lucide-react";

export type TrialRecord = {
  startDate: string;
  endDate: string;
  subscriptionTier: string;
  converted: boolean;
  isActive: boolean;
};

export type TrialStatusTone = "healthy" | "warning" | "neutral";

export type TrialSummaryMetrics = {
  allTrials: TrialRecord[];
  totalTrials: number;
  convertedCount: number;
  conversionRate: number;
  notConvertedCount: number;
  currentTrial: TrialRecord | null;
  status: {
    text: string;
    tone: TrialStatusTone;
    icon: typeof CheckCircle;
  };
  durationDays: number | null;
  statusDescription: string;
};

function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

export function calculateTrialDays(startDate: string, endDate: string): number {
  return calculateDays(startDate, endDate);
}

function checkTrialConversion(
  trialEndDate: string,
  orders: AccountAnalytics["orderHistory"]["orders"],
): boolean {
  const trialEnd = new Date(trialEndDate);

  return orders.some((order) => {
    if (!order.date) return false;

    const orderDate = new Date(order.date);
    if (Number.isNaN(orderDate.getTime())) return false;

    const status = String(order.status ?? "").toLowerCase();
    const isPaid = status === "paid" || status === "true";

    const tier = order.subscriptionTier?.toLowerCase() ?? "";
    const isSeasonPass =
      tier.includes("season pass") ||
      tier.includes("3 month pass") ||
      tier.includes("month pass") ||
      (tier.includes("pass") && !tier.includes("trial") && !tier.includes("free"));

    return isPaid && isSeasonPass && orderDate > trialEnd;
  });
}

export function getTrialSummaryMetrics(
  analytics: AccountAnalytics,
): TrialSummaryMetrics {
  const { trialInstance, trialHistory, hasActiveTrial } = analytics.trialUsage;
  const orders = analytics.orderHistory?.orders ?? [];
  const allTrials: TrialRecord[] = [];

  if (trialInstance) {
    const trialEndDate = new Date(trialInstance.endDate);
    const now = new Date();
    const isActuallyActive = trialInstance.isActive && trialEndDate > now;
    const isConverted =
      !isActuallyActive && checkTrialConversion(trialInstance.endDate, orders);

    allTrials.push({
      startDate: trialInstance.startDate,
      endDate: trialInstance.endDate,
      subscriptionTier: trialInstance.subscriptionTier,
      converted: isConverted,
      isActive: isActuallyActive,
    });
  }

  if (Array.isArray(trialHistory)) {
    trialHistory.forEach((trial) => {
      allTrials.push({
        startDate: trial.startDate,
        endDate: trial.endDate,
        subscriptionTier: trial.subscriptionTier,
        converted: trial.converted || checkTrialConversion(trial.endDate, orders),
        isActive: false,
      });
    });
  }

  const totalTrials = allTrials.length;
  const convertedCount = allTrials.filter((trial) => trial.converted).length;
  const notConvertedCount = totalTrials - convertedCount;
  const conversionRate =
    totalTrials > 0 ? (convertedCount / totalTrials) * 100 : 0;

  const activeTrial = allTrials.find((trial) => trial.isActive) ?? null;
  const historicalTrial =
    [...allTrials]
      .filter((trial) => !trial.isActive)
      .sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      )[0] ?? null;

  const currentTrial = activeTrial ?? historicalTrial;

  const status = (() => {
    if (hasActiveTrial && activeTrial) {
      return {
        text: "Active",
        tone: "healthy" as const,
        icon: CheckCircle,
      };
    }

    if (historicalTrial?.converted) {
      return {
        text: "Converted",
        tone: "healthy" as const,
        icon: CheckCircle,
      };
    }

    if (historicalTrial) {
      return {
        text: "Expired",
        tone: "neutral" as const,
        icon: XCircle,
      };
    }

    return {
      text: "Never activated",
      tone: "neutral" as const,
      icon: Clock,
    };
  })();

  const statusDescription = (() => {
    if (!currentTrial) return "No trial activated";
    if (hasActiveTrial && activeTrial) return "Currently active";
    if (historicalTrial?.converted) return "Converted to paid subscription";
    return "Trial completed without conversion";
  })();

  const durationDays = currentTrial
    ? calculateDays(currentTrial.startDate, currentTrial.endDate)
    : null;

  return {
    allTrials,
    totalTrials,
    convertedCount,
    conversionRate,
    notConvertedCount,
    currentTrial,
    status,
    durationDays,
    statusDescription,
  };
}
