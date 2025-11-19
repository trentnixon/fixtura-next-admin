/**
 * Forecasting utilities for cost projections
 */

export interface ForecastPoint {
  period: string;
  forecast: number;
  confidenceLower: number;
  confidenceUpper: number;
  isHistorical: boolean;
}

export interface ForecastResult {
  historical: ForecastPoint[];
  projected: ForecastPoint[];
  trend: "increasing" | "decreasing" | "stable";
  nextPeriodEstimate: number;
  confidenceInterval: number;
}

/**
 * Calculate Simple Moving Average (SMA)
 * @param values - Array of numeric values
 * @param period - Number of periods to average
 */
export function calculateSMA(values: number[], period: number): number {
  if (values.length === 0 || period === 0) return 0;
  const recent = values.slice(-period);
  const sum = recent.reduce((acc, val) => acc + val, 0);
  return sum / recent.length;
}

/**
 * Calculate Linear Regression for trend projection
 * Returns slope and intercept
 */
export function calculateLinearRegression(
  xValues: number[],
  yValues: number[]
): { slope: number; intercept: number; rSquared: number } {
  const n = xValues.length;
  if (n < 2) return { slope: 0, intercept: 0, rSquared: 0 };

  const sumX = xValues.reduce((acc, x) => acc + x, 0);
  const sumY = yValues.reduce((acc, y) => acc + y, 0);
  const sumXY = xValues.reduce((acc, x, i) => acc + x * yValues[i], 0);
  const sumXX = xValues.reduce((acc, x) => acc + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R-squared
  const yMean = sumY / n;
  const ssRes = yValues.reduce((acc, y, i) => {
    const predicted = slope * xValues[i] + intercept;
    return acc + Math.pow(y - predicted, 2);
  }, 0);
  const ssTot = yValues.reduce((acc, y) => acc + Math.pow(y - yMean, 2), 0);
  const rSquared = ssTot === 0 ? 0 : 1 - ssRes / ssTot;

  return { slope, intercept, rSquared };
}

/**
 * Calculate standard deviation
 */
export function calculateStdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
  const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
  const avgSquaredDiff =
    squaredDiffs.reduce((acc, val) => acc + val, 0) / values.length;
  return Math.sqrt(avgSquaredDiff);
}

/**
 * Forecast using Simple Moving Average
 * @param historicalData - Array of historical cost values
 * @param periods - Number of future periods to forecast
 * @param window - Moving average window size
 */
export function forecastSMA(
  historicalData: Array<{ period: string; cost: number }>,
  periods: number = 4,
  window: number = 7
): ForecastResult {
  const costs = historicalData.map((d) => d.cost);
  const stdDev = calculateStdDev(costs);
  const sma = calculateSMA(costs, window);

  const historical: ForecastPoint[] = historicalData.map((d) => ({
    period: d.period,
    forecast: d.cost,
    confidenceLower: d.cost - stdDev,
    confidenceUpper: d.cost + stdDev,
    isHistorical: true,
  }));

  const projected: ForecastPoint[] = [];

  // Generate future period labels (simplified - would need actual date logic)
  for (let i = 1; i <= periods; i++) {
    const forecast = sma;
    const confidenceInterval = stdDev * 1.96; // 95% confidence
    projected.push({
      period: `Period +${i}`,
      forecast,
      confidenceLower: Math.max(0, forecast - confidenceInterval),
      confidenceUpper: forecast + confidenceInterval,
      isHistorical: false,
    });
  }

  // Determine trend
  const recentTrend =
    costs.length >= 2 ? costs[costs.length - 1] - costs[costs.length - 2] : 0;
  const trend: "increasing" | "decreasing" | "stable" =
    recentTrend > stdDev * 0.1
      ? "increasing"
      : recentTrend < -stdDev * 0.1
      ? "decreasing"
      : "stable";

  return {
    historical,
    projected,
    trend,
    nextPeriodEstimate: sma,
    confidenceInterval: stdDev * 1.96,
  };
}

/**
 * Forecast using Linear Regression
 * @param historicalData - Array of historical cost values
 * @param periods - Number of future periods to forecast
 */
export function forecastLinearRegression(
  historicalData: Array<{ period: string; cost: number }>,
  periods: number = 4
): ForecastResult {
  if (historicalData.length < 2) {
    // Fallback to SMA if insufficient data
    return forecastSMA(historicalData, periods);
  }

  const costs = historicalData.map((d) => d.cost);
  const xValues = historicalData.map((_, i) => i);
  const { slope, intercept } = calculateLinearRegression(xValues, costs);

  const stdDev = calculateStdDev(costs);
  const lastIndex = historicalData.length - 1;

  const historical: ForecastPoint[] = historicalData.map((d, i) => {
    const predicted = slope * i + intercept;
    return {
      period: d.period,
      forecast: d.cost,
      confidenceLower: predicted - stdDev,
      confidenceUpper: predicted + stdDev,
      isHistorical: true,
    };
  });

  const projected: ForecastPoint[] = [];
  for (let i = 1; i <= periods; i++) {
    const futureIndex = lastIndex + i;
    const forecast = slope * futureIndex + intercept;
    const confidenceInterval =
      stdDev * 1.96 * Math.sqrt(1 + 1 / historicalData.length);
    projected.push({
      period: `Period +${i}`,
      forecast: Math.max(0, forecast), // Ensure non-negative
      confidenceLower: Math.max(0, forecast - confidenceInterval),
      confidenceUpper: forecast + confidenceInterval,
      isHistorical: false,
    });
  }

  // Determine trend based on slope
  const trend: "increasing" | "decreasing" | "stable" =
    slope > stdDev * 0.01
      ? "increasing"
      : slope < -stdDev * 0.01
      ? "decreasing"
      : "stable";

  const nextPeriodEstimate = slope * (lastIndex + 1) + intercept;

  return {
    historical,
    projected,
    trend,
    nextPeriodEstimate: Math.max(0, nextPeriodEstimate),
    confidenceInterval: stdDev * 1.96,
  };
}

/**
 * Hybrid forecast: Uses linear regression for trend, SMA for baseline
 */
export function forecastHybrid(
  historicalData: Array<{ period: string; cost: number }>,
  periods: number = 4,
  window: number = 7
): ForecastResult {
  if (historicalData.length < 3) {
    return forecastSMA(historicalData, periods, window);
  }

  const smaResult = forecastSMA(historicalData, periods, window);
  const lrResult = forecastLinearRegression(historicalData, periods);

  // Weight: 70% linear regression (trend), 30% SMA (baseline)
  const projected = smaResult.projected.map((smaPoint, i) => {
    const lrPoint = lrResult.projected[i];
    if (!lrPoint) return smaPoint;

    const forecast = lrPoint.forecast * 0.7 + smaPoint.forecast * 0.3;
    const confidenceLower =
      lrPoint.confidenceLower * 0.7 + smaPoint.confidenceLower * 0.3;
    const confidenceUpper =
      lrPoint.confidenceUpper * 0.7 + smaPoint.confidenceUpper * 0.3;

    return {
      ...smaPoint,
      forecast: Math.max(0, forecast),
      confidenceLower: Math.max(0, confidenceLower),
      confidenceUpper,
    };
  });

  return {
    ...lrResult,
    projected,
    nextPeriodEstimate:
      lrResult.nextPeriodEstimate * 0.7 + smaResult.nextPeriodEstimate * 0.3,
  };
}
