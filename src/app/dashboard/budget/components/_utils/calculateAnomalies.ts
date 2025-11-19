/**
 * Calculate z-score for a value given mean and standard deviation
 * @param value - The value to calculate z-score for
 * @param mean - The mean of the dataset
 * @param stdDev - The standard deviation of the dataset
 * @returns The z-score
 */
export function calculateZScore(
  value: number,
  mean: number,
  stdDev: number
): number {
  if (stdDev === 0) return 0;
  return (value - mean) / stdDev;
}

/**
 * Calculate mean of an array of numbers
 */
export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

/**
 * Calculate standard deviation of an array of numbers
 */
export function calculateStdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = calculateMean(values);
  const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
  const avgSquaredDiff = calculateMean(squaredDiffs);
  return Math.sqrt(avgSquaredDiff);
}

/**
 * Detect anomalies in a dataset using z-score
 * @param dataPoints - Array of data points with cost values
 * @param threshold - Z-score threshold (default: 2)
 * @returns Array of anomalies with their z-scores
 */
export interface Anomaly {
  index: number;
  value: number;
  zScore: number;
  type: "spike" | "drop" | "normal";
}

export function detectAnomalies(
  dataPoints: Array<{ cost: number }>,
  threshold: number = 2
): Anomaly[] {
  if (dataPoints.length < 3) return []; // Need at least 3 points for meaningful stats

  const costs = dataPoints.map((dp) => dp.cost);
  const mean = calculateMean(costs);
  const stdDev = calculateStdDev(costs);

  const anomalies: Anomaly[] = [];

  dataPoints.forEach((point, index) => {
    const zScore = calculateZScore(point.cost, mean, stdDev);
    if (Math.abs(zScore) > threshold) {
      anomalies.push({
        index,
        value: point.cost,
        zScore,
        type: zScore > threshold ? "spike" : "drop",
      });
    }
  });

  return anomalies;
}

/**
 * Simple threshold-based anomaly detection (alternative to z-score)
 * Flags values that are X% above or below the average
 */
export function detectAnomaliesByThreshold(
  dataPoints: Array<{ cost: number }>,
  thresholdPercent: number = 50
): Anomaly[] {
  if (dataPoints.length === 0) return [];

  const costs = dataPoints.map((dp) => dp.cost);
  const mean = calculateMean(costs);

  const anomalies: Anomaly[] = [];

  dataPoints.forEach((point, index) => {
    const diff = point.cost - mean;
    const diffPercent = (diff / mean) * 100;

    if (Math.abs(diffPercent) > thresholdPercent) {
      anomalies.push({
        index,
        value: point.cost,
        zScore: diffPercent / thresholdPercent, // Normalized score
        type: diff > 0 ? "spike" : "drop",
      });
    }
  });

  return anomalies;
}
