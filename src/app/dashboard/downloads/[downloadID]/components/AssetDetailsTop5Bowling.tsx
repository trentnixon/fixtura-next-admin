"use client";

import type { Top5BowlingPerformance } from "@/types/downloadAsset";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import Top5BowlingList from "./Top5BowlingList";

interface AssetDetailsTop5BowlingProps {
  performances: Top5BowlingPerformance[];
}

/**
 * AssetDetailsTop5Bowling Component
 *
 * Displays Top5Bowling asset-specific data:
 * - Top 5 bowling performances
 * - Player stats (wickets, runs, overs)
 * - Team information
 * - Grade and competition badges
 */
export default function AssetDetailsTop5Bowling({
  performances,
}: AssetDetailsTop5BowlingProps) {
  const performanceCount = performances.length;

  return (
    <SectionContainer
      title="Top 5 Bowling"
      description={`${performanceCount} ${performanceCount === 1 ? "performance" : "performances"}`}
    >
      <Top5BowlingList performances={performances} />
    </SectionContainer>
  );
}

