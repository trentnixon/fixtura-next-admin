/**
 * Analytics Helper Utilities
 *
 * Utility functions for formatting, calculating, and processing analytics data.
 */

// Currency formatting
export const formatCurrency = (cents: number): string => {
  return `$${(cents / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Percentage formatting
export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Activity rate calculation
export const calculateActivityRate = (
  active: number,
  total: number
): number => {
  return total > 0 ? (active / total) * 100 : 0;
};

// Revenue per account
export const calculateRevenuePerAccount = (
  revenue: number,
  accounts: number
): number => {
  return accounts > 0 ? revenue / accounts : 0;
};

// Get latest entry from time series
export const getLatestEntry = (
  data: Record<string, number>
): [string, number] | null => {
  const entries = Object.entries(data);
  return entries.length > 0 ? entries[entries.length - 1] : null;
};

// Find highest value in distribution
export const getHighestDistribution = (
  distribution: Record<string, number>
): [string, number] | null => {
  const entries = Object.entries(distribution);
  if (entries.length === 0) return null;
  return entries.reduce((max, curr) => (curr[1] > max[1] ? curr : max));
};

// Get trend color class
export const getTrendColor = (
  trend: "increasing" | "decreasing" | "stable"
): string => {
  switch (trend) {
    case "increasing":
      return "text-green-600";
    case "decreasing":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

// Format date for display
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

// Get trend indicator icon
export const getTrendIcon = (
  trend: "increasing" | "decreasing" | "stable"
): string => {
  switch (trend) {
    case "increasing":
      return "↑";
    case "decreasing":
      return "↓";
    default:
      return "→";
  }
};
